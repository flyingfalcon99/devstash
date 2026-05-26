"use client";

import { Folder } from "lucide-react";
import { fieldLabel } from "@/lib/constants/form-styles";

interface CollectionPickerProps {
  collections: { id: string; name: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function CollectionPicker({ collections, selected, onChange }: CollectionPickerProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className={fieldLabel}>Collections</label>
      <div className="max-h-32 overflow-y-auto rounded-lg border border-input bg-transparent thin-scrollbar">
        {collections.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">No collections yet</p>
        ) : (
          <div className="p-1 space-y-0.5">
            {collections.map((col) => {
              const checked = selected.includes(col.id);
              return (
                <label
                  key={col.id}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(col.id)}
                    className="h-3.5 w-3.5 accent-primary shrink-0"
                  />
                  <Folder className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{col.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
