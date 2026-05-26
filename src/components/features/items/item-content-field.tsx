"use client";

import { CodeEditor } from "@/components/ui/code-editor";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { cn } from "@/lib/utils";
import { textareaClass } from "@/lib/constants/form-styles";

const CODE_TYPES = ["snippet", "command"];
const MARKDOWN_TYPES = ["note", "prompt"];

interface ItemContentFieldProps {
  typeName: string;
  value: string;
  onChange?: (val: string) => void;
  language?: string | null;
  maxHeight?: number;
  rows?: number;
}

export function ItemContentField({
  typeName,
  value,
  onChange,
  language,
  maxHeight,
  rows = 8,
}: ItemContentFieldProps) {
  const readOnly = !onChange;

  if (CODE_TYPES.includes(typeName)) {
    return (
      <CodeEditor
        value={value}
        onChange={onChange ?? (() => {})}
        language={language ?? null}
        readOnly={readOnly}
        maxHeight={maxHeight}
      />
    );
  }

  if (MARKDOWN_TYPES.includes(typeName)) {
    return (
      <MarkdownEditor
        value={value}
        onChange={onChange ?? (() => {})}
        readOnly={readOnly}
        maxHeight={maxHeight}
      />
    );
  }

  if (readOnly) {
    return (
      <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono">
        {value}
      </pre>
    );
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste your content here"
      rows={rows}
      className={cn(textareaClass, "font-mono text-xs")}
    />
  );
}
