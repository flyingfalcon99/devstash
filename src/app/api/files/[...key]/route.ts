import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getFromR2 } from "@/lib/r2";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const objectKey = key.join("/");

  // Key format: uploads/{userId}/{uuid}.ext — verify ownership
  const segments = objectKey.split("/");
  if (segments[0] !== "uploads" || segments[1] !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const object = await getFromR2(objectKey);
    if (!object.Body) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contentType = object.ContentType ?? "application/octet-stream";
    const fileName = objectKey.split("/").pop() ?? "download";

    // Stream the R2 body through
    const nodeStream = object.Body.transformToWebStream();
    return new Response(nodeStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
