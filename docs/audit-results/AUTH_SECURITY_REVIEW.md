# Auth Security Review
Last audited: 2026-05-18

## Scope
Files reviewed:
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/verify-email/route.ts`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/reset-password/route.ts`
- `src/app/api/profile/route.ts`
- `src/app/api/profile/change-password/route.ts`
- `src/auth.ts`
- `src/auth.config.ts`
- `src/proxy.ts`
- `src/lib/email.ts`
- `src/lib/feature-flags.ts`
- `src/app/(dashboard)/profile/page.tsx`
- `src/components/features/profile/change-password-form.tsx`
- `src/components/features/profile/delete-account-button.tsx`
- `prisma/schema.prisma` (read to validate token model uniqueness constraints)

---

## CRITICAL

No critical issues found.

---

## HIGH

### Password Reset Does Not Invalidate Active Sessions
- **File**: `src/app/api/auth/reset-password/route.ts` (Lines 32–37)
- **Problem**: After a successful password reset, the handler updates the user's password and deletes the consumed reset token, but it does not invalidate any existing NextAuth sessions. Because the project uses `strategy: "jwt"` (stateless JWTs), any attacker who had previously obtained a valid session JWT — for example via session fixation, token theft, or a shared device — retains full authenticated access even after the account owner changes their password via the reset flow. The reset flow is specifically designed for situations where credentials are compromised, so failing to terminate existing sessions defeats its primary security purpose.
- **Exploit scenario**: An attacker steals a user's session JWT (e.g. via XSS or network interception). The legitimate user notices, triggers a password reset, and sets a new password. The attacker's stolen JWT continues to work for the remainder of its configured expiry window because no server-side invalidation has occurred.
- **Fix**: After updating the password, delete all `Session` records for that user from the database (`prisma.session.deleteMany({ where: { userId: user.id } })`). While JWT sessions are stateless, NextAuth still writes `Session` rows when using the Prisma adapter; clearing them causes `auth()` to return null on the next request for any existing session. Additionally, consider shortening the JWT `maxAge` to reduce the exposure window if immediate revocation is needed. Note: the same gap exists in `change-password`, but the threat model there is lower because the user must already know the current password.

---

## MEDIUM

### Unbounded Password Length Enables bcrypt DoS
- **File**: `src/app/api/auth/register/route.ts` (Line 23), `src/app/api/auth/reset-password/route.ts` (Line 30), `src/app/api/profile/change-password/route.ts` (Line 32)
- **Problem**: No maximum length is enforced on the `password` field before it is passed to `bcrypt.hash()`. bcrypt is intentionally CPU-intensive (10 rounds here). Sending a very long password — for example 1 MB of data — will cause the server to spend significant CPU time on a single request. An unauthenticated attacker can hit the `/api/auth/register` and `/api/auth/reset-password` endpoints with repeated large payloads to saturate server CPU. The `register` and `reset-password` endpoints require no session, making them the most exposed attack surface.
- **Exploit scenario**: An attacker sends a flood of POST requests to `/api/auth/register` with passwords of e.g. 500,000 characters. Each request forces a full bcrypt computation, potentially blocking or severely slowing the Node.js event loop for other users.
- **Fix**: Reject passwords longer than a sane maximum (e.g. 72 characters, which is bcrypt's actual input limit, or 128 characters as a practical cap) before calling `bcrypt.hash()`. Add the check immediately after the input validation block in all three routes:
  ```ts
  if (password.length > 128) {
    return NextResponse.json({ error: "Password too long" }, { status: 400 })
  }
  ```
  Also apply rate limiting (e.g. via an Edge middleware or Upstash Ratelimit) to the register and reset-password endpoints.

### Email Verification Token Not Scoped — Cross-Token Type Confusion Possible When Feature Flag Is Off Then On
- **File**: `src/app/api/auth/verify-email/route.ts` (Line 12), `src/app/api/auth/register/route.ts` (Lines 35–40)
- **Problem**: When `emailVerificationEnabled` is `false`, no verification tokens are created on registration and `emailVerified` is set immediately to `new Date()`. If the flag is later switched to `true`, all pre-existing users already have `emailVerified` set and are unaffected — this part is fine. However, the lookup in `verify-email` is done solely by `token` value (`findUnique({ where: { token } })`) with no check that the `identifier` does *not* start with `reset:`. This means a valid, unexpired password reset token could technically be submitted to `/api/auth/verify-email?token=<reset_token>` and would pass the lookup. The handler would then call `prisma.user.update({ where: { email: record.identifier }, … })` — but since reset token identifiers are `reset:<email>` (not a bare email), the `where: { email: "reset:user@example.com" }` lookup would find no user and Prisma would throw a `RecordNotFoundError`, crashing the handler with a 500.
- **Exploit scenario**: This is not directly exploitable for account takeover, but it does create an unhandled error path (500 response) that could be abused to probe whether a reset token is still valid, and it indicates missing defensive layering between token types.
- **Fix**: Add an explicit guard in `verify-email` to reject tokens whose `identifier` starts with `reset:`:
  ```ts
  if (record.identifier.startsWith("reset:")) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid-token", origin))
  }
  ```
  This mirrors the already-correct pattern in `reset-password` which checks `record.identifier.startsWith(RESET_PREFIX)`.

---

## LOW

### No Minimum Password Length or Complexity Enforcement
- **File**: `src/app/api/auth/register/route.ts` (Lines 10–16), `src/app/api/auth/reset-password/route.ts` (Lines 10–15), `src/app/api/profile/change-password/route.ts` (Lines 14–20)
- **Problem**: The API accepts any non-empty string as a valid password. A user could register or reset with a single-character password (e.g. `"a"`), which bcrypt will hash successfully. There is no server-side minimum length check.
- **Exploit scenario**: Users can set trivially guessable passwords, increasing account compromise risk via credential stuffing or brute force.
- **Fix**: Enforce a minimum length server-side (e.g. 8 characters) in all three routes. Client-side validation in the form is not sufficient since the API is directly callable.

### Verification Token URL Construction Uses Unvalidated Environment Variable
- **File**: `src/lib/email.ts` (Lines 6–9, 29–32)
- **Problem**: The base URL for email links is constructed from `process.env.AUTH_URL` or `process.env.VERCEL_URL` without any validation or sanitisation. If `AUTH_URL` is misconfigured (e.g. missing a trailing protocol, or set to an attacker-controlled value in a misconfigured deployment environment), the generated verification and reset links could point to the wrong host. This is an operational/configuration risk rather than a code exploit, but it is worth hardening.
- **Fix**: Validate that the resolved `baseUrl` starts with `https://` (or `http://` for localhost) before constructing the URL, and log a warning or throw at startup if it does not.

### `proxy.ts` Middleware Only Guards `/dashboard` Routes
- **File**: `src/proxy.ts` (Lines 13–15)
- **Problem**: The middleware matcher covers only `/dashboard/:path*`. The API routes under `/api/profile/*` are not covered by the Edge middleware. This is not a vulnerability in itself — the API routes correctly call `auth()` and check `session?.user?.id` internally — but if a future API route is added under a different path prefix without its own `auth()` check, there is no safety-net middleware layer to catch it. This is a defense-in-depth gap, not an active exploit.
- **Fix**: Consider expanding the middleware matcher to also cover `/api/profile/:path*` (and any other authenticated API namespaces) as a secondary layer, so that unauthenticated requests are rejected at the Edge before reaching the handler.

### `auth.config.ts` Credentials `authorize` Always Returns `null`
- **File**: `src/auth.config.ts` (Line 11)
- **Problem**: The Edge-compatible `authConfig` exports a Credentials provider stub whose `authorize` function unconditionally returns `null`. This is intentional (the real `authorize` logic lives in `src/auth.ts` for Node.js compatibility), but it means that if the middleware ever mistakenly imports from `authConfig` directly for sign-in validation rather than from the full `auth.ts`, all credential logins would silently fail with no error. The separation is a known NextAuth v5 Edge pattern, but it deserves a comment to prevent future confusion.
- **Fix**: Add a comment to `auth.config.ts` explaining that the `authorize: () => null` stub is intentional and that the real implementation is in `src/auth.ts`. This prevents a future developer from thinking the stub is a bug and "fixing" it incorrectly.

---

## Passed Checks

- ✓ **bcrypt salt rounds** (`src/auth.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/auth/reset-password/route.ts`, `src/app/api/profile/change-password/route.ts`) — All password hashing uses `bcrypt.hash(password, 10)`. Salt rounds of 10 is the current OWASP recommended minimum for bcrypt; salt is generated automatically per hash.
- ✓ **bcrypt safe comparison** (`src/auth.ts` line 35, `src/app/api/profile/change-password/route.ts` line 27) — `bcrypt.compare()` is used for all password verification; no plain string equality is performed on hashes.
- ✓ **Email verification token expiry** (`src/app/api/auth/verify-email/route.ts` lines 18–20) — Expired tokens are detected and deleted before any action is taken.
- ✓ **Email verification token single-use enforcement** (`src/app/api/auth/verify-email/route.ts` line 28) — Token is deleted from the database immediately after successful verification. The `token` column has a `@unique` constraint in the Prisma schema, preventing reuse at the DB level.
- ✓ **Password reset token expiry** (`src/app/api/auth/reset-password/route.ts` lines 24–27) — Expired reset tokens are detected and deleted before any action is taken.
- ✓ **Password reset token single-use enforcement** (`src/app/api/auth/reset-password/route.ts` line 37) — Token is deleted immediately after successful password reset.
- ✓ **Password reset token prefix isolation** (`src/app/api/auth/forgot-password/route.ts` line 5, `src/app/api/auth/reset-password/route.ts` lines 5, 20) — Reset tokens use `reset:<email>` as their `identifier`, and the reset handler checks `record.identifier.startsWith(RESET_PREFIX)` before acting. A raw email verification token cannot be accepted by the reset endpoint.
- ✓ **Password reset identifier scoping** (`src/app/api/auth/reset-password/route.ts` line 29) — The email used to update the password is extracted from the stored token's `identifier`, not from user-supplied input, preventing identifier substitution attacks.
- ✓ **Forgot-password email enumeration protection** (`src/app/api/auth/forgot-password/route.ts` lines 15–18) — The identical success response is constructed before any user lookup, and returned for both existing and non-existing emails.
- ✓ **API route session validation — DELETE /api/profile** (`src/app/api/profile/route.ts` lines 6–9) — Calls `auth()` and checks `session?.user?.id`; delete is scoped to `{ id: session.user.id }`.
- ✓ **API route session validation — POST /api/profile/change-password** (`src/app/api/profile/change-password/route.ts` lines 7–10) — Calls `auth()` and checks `session?.user?.id`; all DB operations use the session user ID.
- ✓ **Change-password verifies current password** (`src/app/api/profile/change-password/route.ts` lines 27–29) — `bcrypt.compare()` is called against the stored hash before allowing a password update.
- ✓ **Delete-account scoped to session user** (`src/app/api/profile/route.ts` line 11) — `prisma.user.delete` uses `{ id: session.user.id }`, not any client-supplied ID.
- ✓ **Existing reset tokens invalidated before issuing new ones** (`src/app/api/auth/forgot-password/route.ts` lines 24–26) — `deleteMany` removes all existing reset tokens for an email before creating a new one, preventing token accumulation.
- ✓ **OAuth user cannot trigger credential password reset** (`src/app/api/auth/forgot-password/route.ts` line 21) — The handler checks `user?.password` and returns the generic OK response early if the account has no credentials, so OAuth-only accounts cannot receive a reset token.
- ✓ **Profile page server-side session guard** (`src/app/(dashboard)/profile/page.tsx` lines 24–25) — Server component calls `auth()` and `redirect`s if no session, before any DB query.
- ✓ **JWT session ID propagation** (`src/auth.ts` lines 49–52) — The `session` callback sets `session.user.id = token.sub`, ensuring the session ID is always the authoritative database user ID rather than a client-supplied value.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High     | 1 |
| Medium   | 2 |
| Low      | 4 |
| **Total** | **7** |
