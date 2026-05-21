import Link from "next/link";
import { File, Star, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { itemTypeIconMap } from "@/lib/constants/item-types";

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    isFavorite: boolean;
    language: string | null;
    createdAt: Date;
    itemType: {
      name: string;
      icon: string;
      color: string;
    };
  };
}

export function ItemCard({ item }: ItemCardProps) {
  const Icon = itemTypeIconMap[item.itemType.icon as keyof typeof itemTypeIconMap] || File;
  const color = item.itemType.color;

  return (
    <Link href={`/items/${item.id}`}>
      <Card
        className="hover:bg-muted/50 transition-colors shadow-sm h-full flex flex-col"
        style={{ borderLeftColor: color, borderLeftWidth: "3px" }}
      >
        <CardHeader className="p-4 pb-2 flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 max-w-[80%]">
              <Icon className="h-4 w-4 shrink-0" style={{ color }} />
              <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
            </div>
            {item.isFavorite && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
            )}
          </div>
          <CardDescription className="text-xs line-clamp-2">
            {item.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs text-muted-foreground flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal capitalize">
              {item.itemType.name}
            </Badge>
            {item.language && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                {item.language}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
