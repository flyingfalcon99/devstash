"use client";

import { useRef, useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
const FILE_EXTS = [".pdf", ".txt", ".md", ".json", ".yaml", ".yml", ".xml", ".csv", ".toml", ".ini"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface UploadResult {
  key: string;
  fileName: string;
  fileSize: number;
}

interface FileUploadProps {
  itemType: "file" | "image";
  onUpload: (result: UploadResult) => void;
  onClear: () => void;
  uploaded: UploadResult | null;
}

export function FileUpload({ itemType, onUpload, onClear, uploaded }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const exts = itemType === "image" ? IMAGE_EXTS : FILE_EXTS;
  const accept = exts.join(",");
  const maxLabel = itemType === "image" ? "5 MB" : "10 MB";

  async function uploadFile(file: File) {
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("itemType", itemType);

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };

      xhr.onload = () => {
        setProgress(null);
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText) as UploadResult;
          onUpload(result);
          resolve();
        } else {
          const msg = JSON.parse(xhr.responseText)?.error ?? "Upload failed";
          setError(msg);
          reject(new Error(msg));
        }
      };

      xhr.onerror = () => {
        setProgress(null);
        setError("Upload failed");
        reject(new Error("Upload failed"));
      };

      xhr.send(formData);
    });
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    uploadFile(files[0]);
  }

  if (uploaded) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-xs">{uploaded.fileName}</span>
          <span className="text-xs text-muted-foreground shrink-0">{formatBytes(uploaded.fileSize)}</span>
        </div>
        <button type="button" onClick={onClear} className="ml-2 text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors",
          dragging ? "border-ring bg-muted/40" : "border-border hover:border-ring/50 hover:bg-muted/20"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="h-5 w-5 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">{exts.join(", ")} · max {maxLabel}</p>

        {progress !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
