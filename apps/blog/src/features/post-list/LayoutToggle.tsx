"use client";

import { Button, cn, Grid, List } from "@hyoungmin/ui";
export type LayoutType = "list" | "card";

interface LayoutToggleProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export const LayoutToggle = ({ layout, onLayoutChange }: LayoutToggleProps) => {
  return (
    <div className="flex items-center gap-1 border border-zinc-950 p-1 dark:border-stone-50">
      <Button
        type="button"
        variant={layout === "list" ? "default" : "ghost"}
        size="icon"
        aria-label="List layout"
        aria-pressed={layout === "list"}
        onClick={() => onLayoutChange("list")}
        className={cn(
          "flex h-9 w-9 items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-stone-50",
          layout === "list"
            ? "bg-zinc-950 text-stone-50 dark:bg-stone-50 dark:text-zinc-950"
            : "bg-transparent",
        )}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={layout === "card" ? "default" : "ghost"}
        size="icon"
        aria-label="Card layout"
        aria-pressed={layout === "card"}
        onClick={() => onLayoutChange("card")}
        className={cn(
          "flex h-9 w-9 items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-stone-50",
          layout === "card"
            ? "bg-zinc-950 text-stone-50 dark:bg-stone-50 dark:text-zinc-950"
            : "bg-transparent",
        )}
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  );
};
