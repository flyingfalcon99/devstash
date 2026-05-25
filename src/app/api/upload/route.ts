import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToR2 } from "@/lib/r2";

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"]);
const FILE_TYPES = new Set([
  "application/pdf", "text/plain", "text/markdown", "application/json",
  "application/x-yaml", "text/yaml", "application/xml", "text/xml",
  "text/csv", "application/toml",
]);
const IMAGE_MAX = 5 * 1024 * 1024;
const FILE_MAX = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const itemType = formData.get("itemType") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const isImage = itemType === "image";
  const allowedTypes = isImage ? IMAGE_TYPES : FILE_TYPES;
  const maxSize = isImage ? IMAGE_MAX : FILE_MAX;

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }
  if (file.size > maxSize) {
    const limit = isImage ? "5 MB" : "10 MB";
    return NextResponse.json({ error: `File exceeds ${limit} limit` }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "";
  const key = `uploads/${session.user.id}/${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadToR2(key, buffer, file.type);

  return NextResponse.json({ key, fileName: file.name, fileSize: file.size });
}
