"use client";

import { useEditorPreferences } from "@/context/editor-preferences-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FONT_SIZES = [11, 12, 13, 14, 16, 18];
const TAB_SIZES = [2, 4];
const THEMES = [
  { value: "vs-dark", label: "VS Dark" },
  { value: "monokai", label: "Monokai" },
  { value: "github-dark", label: "GitHub Dark" },
];

export function EditorPreferencesForm() {
  const { prefs, updatePrefs } = useEditorPreferences();

  return (
    <div className="space-y-5">
      {/* Theme */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium">Theme</Label>
          <p className="text-xs text-muted-foreground">Editor color theme</p>
        </div>
        <Select
          value={prefs.theme}
          onValueChange={(value) => { if (value) updatePrefs({ theme: value }); }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font size */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium">Font Size</Label>
          <p className="text-xs text-muted-foreground">Editor font size in pixels</p>
        </div>
        <Select
          value={String(prefs.fontSize)}
          onValueChange={(value) => { if (value) updatePrefs({ fontSize: Number(value) }); }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab size */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-medium">Tab Size</Label>
          <p className="text-xs text-muted-foreground">Number of spaces per tab</p>
        </div>
        <Select
          value={String(prefs.tabSize)}
          onValueChange={(value) => { if (value) updatePrefs({ tabSize: Number(value) }); }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAB_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s} spaces
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Word wrap */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="word-wrap" className="text-sm font-medium">Word Wrap</Label>
          <p className="text-xs text-muted-foreground">Wrap long lines in the editor</p>
        </div>
        <Switch
          id="word-wrap"
          checked={prefs.wordWrap}
          onCheckedChange={(checked) => updatePrefs({ wordWrap: checked })}
        />
      </div>

      {/* Minimap */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="minimap" className="text-sm font-medium">Minimap</Label>
          <p className="text-xs text-muted-foreground">Show code overview minimap</p>
        </div>
        <Switch
          id="minimap"
          checked={prefs.minimap}
          onCheckedChange={(checked) => updatePrefs({ minimap: checked })}
        />
      </div>
    </div>
  );
}
