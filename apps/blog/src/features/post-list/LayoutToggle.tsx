"use client";

import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { Button } from "@hyoungmin/ui";

export type LayoutType = "list" | "card";

interface LayoutToggleProps {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export const LayoutToggle = ({ layout, onLayoutChange }: LayoutToggleProps) => {
  return (
    <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-md p-1">
      <Button
        type="button"
        variant={layout === "list" ? "default" : "ghost"}
        size="icon"
        aria-label="List layout"
        onClick={() => onLayoutChange("list")}
        className="h-8 w-8"
      >
        <ListBulletIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={layout === "card" ? "default" : "ghost"}
        size="icon"
        aria-label="Card layout"
        onClick={() => onLayoutChange("card")}
        className="h-8 w-8"
      >
        <Squares2X2Icon className="h-4 w-4" />
      </Button>
    </div>
  );
};
