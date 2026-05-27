import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
}

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

const linkClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground";
const disabledClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none";

export function PaginationControls({ page, totalPages }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {page > 1 ? (
        <Link href={`?page=${page - 1}`} className={cn(linkClass, "gap-1 pr-3")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Prev</span>
        </Link>
      ) : (
        <span className={cn(disabledClass, "gap-1 pr-3")}>
          <ChevronLeft className="h-4 w-4" />
          <span>Prev</span>
        </span>
      )}

      {pageNumbers.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="inline-flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={`?page=${p}`}
            className={cn(
              linkClass,
              p === page && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={`?page=${page + 1}`} className={cn(linkClass, "gap-1 pl-3")}>
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(disabledClass, "gap-1 pl-3")}>
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
