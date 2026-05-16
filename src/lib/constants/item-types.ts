import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
} from "lucide-react";

export const itemTypeIconMap = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
} as const;

export type ItemTypeIconMap = typeof itemTypeIconMap;
