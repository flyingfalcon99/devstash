"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { updateEditorPreferences } from "@/lib/actions/editor-preferences";
import { DEFAULT_EDITOR_PREFERENCES, type EditorPreferences } from "@/lib/editor-preferences";

interface EditorPreferencesContextValue {
  prefs: EditorPreferences;
  updatePrefs: (partial: Partial<EditorPreferences>) => Promise<void>;
}

const EditorPreferencesContext = createContext<EditorPreferencesContextValue>({
  prefs: DEFAULT_EDITOR_PREFERENCES,
  updatePrefs: async () => {},
});

export function useEditorPreferences() {
  return useContext(EditorPreferencesContext);
}

interface EditorPreferencesProviderProps {
  initialPrefs: EditorPreferences;
  children: React.ReactNode;
}

export function EditorPreferencesProvider({
  initialPrefs,
  children,
}: EditorPreferencesProviderProps) {
  const [prefs, setPrefs] = useState<EditorPreferences>(initialPrefs);

  async function updatePrefs(partial: Partial<EditorPreferences>) {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    const result = await updateEditorPreferences(next);
    if (result.success) {
      toast.success("Editor preferences saved");
    } else {
      setPrefs(prefs);
      toast.error("Failed to save preferences");
    }
  }

  return (
    <EditorPreferencesContext.Provider value={{ prefs, updatePrefs }}>
      {children}
    </EditorPreferencesContext.Provider>
  );
}
