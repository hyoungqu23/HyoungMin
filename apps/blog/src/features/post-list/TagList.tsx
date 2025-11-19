import type { PostMeta } from "@hyoungmin/schema";

type TagListProps = {
  tags: PostMeta["tags"];
  limit?: number;
};

export const TagList = ({ tags, limit = tags.length }: TagListProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, limit).map((tag) => (
        <span key={tag} className="px-2 py-1 text-xs border rounded">
          {tag}
        </span>
      ))}
    </div>
  );
};
