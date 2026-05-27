"use client";

import { useState } from "react";
import Editor, { type BeforeMount } from "@monaco-editor/react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorPreferences } from "@/context/editor-preferences-context";

const LANGUAGE_MAP: Record<string, string> = {
  typescript: "typescript",
  ts: "typescript",
  tsx: "typescript",
  javascript: "javascript",
  js: "javascript",
  jsx: "javascript",
  python: "python",
  py: "python",
  rust: "rust",
  go: "go",
  java: "java",
  c: "c",
  cpp: "cpp",
  "c++": "cpp",
  "c#": "csharp",
  csharp: "csharp",
  php: "php",
  ruby: "ruby",
  rb: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  sql: "sql",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  markdown: "markdown",
  md: "markdown",
  bash: "shell",
  sh: "shell",
  shell: "shell",
  powershell: "powershell",
  dockerfile: "dockerfile",
  xml: "xml",
};

function toMonacoLanguage(lang: string | null | undefined): string {
  if (!lang) return "plaintext";
  return LANGUAGE_MAP[lang.toLowerCase()] ?? "plaintext";
}

const LINE_HEIGHT = 20;
const MIN_HEIGHT = 80;

function calcEditorHeight(value: string, maxHeight: number): number {
  const lines = (value || "").split("\n").length;
  return Math.min(Math.max(lines * LINE_HEIGHT + 16, MIN_HEIGHT), maxHeight);
}

const handleBeforeMount: BeforeMount = async (monaco) => {
  try {
    const [{ default: monokai }, { default: githubDark }] = await Promise.all([
      import("monaco-themes/themes/Monokai.json"),
      import("monaco-themes/themes/GitHub Dark.json"),
    ]);
    monaco.editor.defineTheme("monokai", monokai as Parameters<typeof monaco.editor.defineTheme>[1]);
    monaco.editor.defineTheme("github-dark", githubDark as Parameters<typeof monaco.editor.defineTheme>[1]);
  } catch {
    // theme loading is non-critical; editor falls back to vs-dark
  }
};

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string | null;
  readOnly?: boolean;
  maxHeight?: number;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  maxHeight = 400,
  className,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const { prefs } = useEditorPreferences();

  const monacoLang = toMonacoLanguage(language);
  const editorHeight = calcEditorHeight(value, maxHeight);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("rounded-lg overflow-hidden border border-border", className)}>
      <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e] border-b border-[#333]">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-3">
          {language && (
            <span className="text-[10px] text-[#858585] font-mono">{language}</span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-[#858585] hover:text-[#cccccc] transition-colors"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div style={{ height: editorHeight }}>
        <Editor
          value={value}
          onChange={(val) => onChange?.(val ?? "")}
          language={monacoLang}
          theme={prefs.theme}
          beforeMount={handleBeforeMount}
          loading={
            <div className="h-full w-full bg-[#1e1e1e] flex items-center justify-center">
              <span className="text-xs text-[#858585]">Loading editor…</span>
            </div>
          }
          options={{
            readOnly,
            minimap: { enabled: prefs.minimap },
            lineNumbers: readOnly ? "off" : "on",
            scrollBeyondLastLine: false,
            fontSize: prefs.fontSize,
            tabSize: prefs.tabSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
            wordWrap: prefs.wordWrap ? "on" : "off",
            automaticLayout: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
              useShadows: false,
            },
            renderLineHighlight: readOnly ? "none" : "line",
            padding: { top: 8, bottom: 8 },
            folding: false,
            glyphMargin: false,
            lineDecorationsWidth: readOnly ? 0 : 4,
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
          }}
        />
      </div>
    </div>
  );
}
