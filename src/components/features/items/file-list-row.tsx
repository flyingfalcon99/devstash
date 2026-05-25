"use client";

import { Download, FileText, FileImage, FileCode, FileJson, File } from "lucide-react";
import type { ItemCardItem } from "./item-card";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ fileName }: { fileName: string }) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return <FileText className="h-5 w-5 text-red-400 shrink-0" />;
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return <FileImage className="h-5 w-5 text-blue-400 shrink-0" />;
  if (["js", "ts", "tsx", "jsx", "py", "rb", "go", "rs", "sh"].includes(ext)) return <FileCode className="h-5 w-5 text-yellow-400 shrink-0" />;
  if (["json", "yaml", "yml", "toml", "xml"].includes(ext)) return <FileJson className="h-5 w-5 text-green-400 shrink-0" />;
  return <File className="h-5 w-5 text-muted-foreground shrink-0" />;
}

interface FileListRowProps {
  item: ItemCardItem;
  onOpen: (id: string) => void;
}

export function FileListRow({ item, onOpen }: FileListRowProps) {
  const fileName = item.fileName ?? item.title;

  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
    >
      <FileTypeIcon fileName={fileName} />

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
        )}
      </div>

      {/* Meta: size + date — stacks on mobile */}
      <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
        <span className="w-16 text-right">
          {item.fileSize != null ? formatBytes(item.fileSize) : "—"}
        </span>
        <span className="w-20 text-right">
          {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      {/* Mobile meta */}
      <div className="flex sm:hidden flex-col items-end text-xs text-muted-foreground shrink-0 gap-0.5">
        <span>{item.fileSize != null ? formatBytes(item.fileSize) : "—"}</span>
        <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
      </div>

      {/* Download */}
      {item.fileUrl && (
        <a
          href={`/api/files/${item.fileUrl}`}
          download={fileName}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Download"
        >
          <Download className="h-4 w-4" />
        </a>
      )}
    </button>
  );
}
