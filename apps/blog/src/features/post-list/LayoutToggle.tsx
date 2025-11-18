"use client";

import { Button, cn, Grid, List } from "@hyoungmin/ui";
export type LayoutType = "list" | "card";

interface LayoutToggleProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export const LayoutToggle = ({ layout, onLayoutChange }: LayoutToggleProps) => {
  return (
    <div className="flex items-center gap-2 border border-primary-200 rounded-md p-1">
      <Button
        type="button"
        variant={layout === "list" ? "default" : "ghost"}
        size="icon"
        aria-label="List layout"
        onClick={() => onLayoutChange("list")}
        className={cn(
          "h-8 w-8 text-primary-500 hover:text-primary-100 flex items-center justify-center",
          layout === "list"
            ? "bg-primary-500 text-primary-100"
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
        onClick={() => onLayoutChange("card")}
        className={cn(
          "h-8 w-8 text-primary-500 hover:text-primary-100 flex items-center justify-center",
          layout === "card"
            ? "bg-primary-500 text-primary-100"
            : "bg-transparent",
        )}
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  );
};
