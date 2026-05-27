"use client";

import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import type { SearchItemData, SearchCollectionData } from "@/lib/db/search";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchItemData[];
  collections: SearchCollectionData[];
  onSelectItem: (id: string) => void;
}

function substringFilter(value: string, search: string): number {
  const trimmed = search.trim();
  if (!trimmed) return 1;
  const v = value.toLowerCase();
  const terms = trimmed.toLowerCase().split(/\s+/);
  if (!terms.every((t) => v.includes(t))) return 0;
  return v.startsWith(trimmed.toLowerCase()) ? 1 : 0.5;
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  collections,
  onSelectItem,
}: CommandPaletteProps) {
  const router = useRouter();

  function handleSelectItem(id: string) {
    onOpenChange(false);
    onSelectItem(id);
  }

  function handleSelectCollection(id: string) {
    onOpenChange(false);
    router.push(`/collections/${id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden top-[20%] translate-y-0 sm:max-w-lg"
        showCloseButton={false}
      >
        <Command filter={substringFilter}>
          <CommandInput placeholder="Search items and collections…" autoFocus />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {items.length > 0 && (
              <CommandGroup heading="Items">
                {items.map((item) => {
                  const Icon = itemTypeIconMap[item.typeIcon as keyof typeof itemTypeIconMap];
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.typeName}`}
                      onSelect={() => handleSelectItem(item.id)}
                    >
                      {Icon && (
                        <Icon className="h-4 w-4 shrink-0" style={{ color: item.typeColor }} />
                      )}
                      <span className="truncate">{item.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground capitalize shrink-0">
                        {item.typeName}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {items.length > 0 && collections.length > 0 && <CommandSeparator />}

            {collections.length > 0 && (
              <CommandGroup heading="Collections">
                {collections.map((col) => (
                  <CommandItem
                    key={col.id}
                    value={col.name}
                    onSelect={() => handleSelectCollection(col.id)}
                  >
                    <Folder className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{col.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground shrink-0">
                      {col.itemCount} {col.itemCount === 1 ? "item" : "items"}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
