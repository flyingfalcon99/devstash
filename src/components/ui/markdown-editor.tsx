"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "write" | "preview";

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  maxHeight?: number;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  maxHeight = 400,
  className,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>(readOnly ? "preview" : "write");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (tab === "write" && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value, tab]);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("rounded-lg overflow-hidden border border-border", className)}>
      <div className="flex items-center justify-between px-1 bg-[#2d2d2d] border-b border-[#3a3a3a]">
        <div className="flex items-center">
          {!readOnly && (
            <button
              type="button"
              onClick={() => setTab("write")}
              className={cn(
                "px-3 py-2 text-xs transition-colors border-b-2 -mb-px",
                tab === "write"
                  ? "text-[#cccccc] border-[#569cd6]"
                  : "text-[#858585] border-transparent hover:text-[#cccccc]"
              )}
            >
              Write
            </button>
          )}
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "px-3 py-2 text-xs transition-colors border-b-2 -mb-px",
              tab === "preview"
                ? "text-[#cccccc] border-[#569cd6]"
                : "text-[#858585] border-transparent hover:text-[#cccccc]"
            )}
          >
            Preview
          </button>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-[#858585] hover:text-[#cccccc] transition-colors pr-2"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="bg-[#1e1e1e] thin-scrollbar" style={{ maxHeight, overflowY: "auto" }}>
        {tab === "write" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Write markdown here…"
            className="w-full bg-transparent text-[#cccccc] text-xs font-mono p-3 resize-none outline-none placeholder:text-[#555]"
            style={{ minHeight: 120, display: "block" }}
          />
        ) : (
          <div className="p-3">
            {value ? (
              <div className="prose prose-sm prose-invert max-w-none prose-pre:bg-[#2a2a2a] prose-code:text-[#ce9178] prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-[#569cd6] prose-a:text-[#569cd6]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            ) : (
              <span className="text-xs text-[#555]">Nothing to preview.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
