import { ProductItem } from "../lib/commands";

interface Props {
  items: ProductItem[];
  onSelect: (item: ProductItem) => void;
  selectedId?: string;
}

export function RankingList({ items, onSelect, selectedId }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p>No results found.</p>
        <p className="text-xs mt-1">Try searching or crawling.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item) => (
        <li
          key={`${item.product_id}-${item.rank}`}
          onClick={() => onSelect(item)}
          className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${
            selectedId === item.product_id
              ? "bg-yellow-50/60"
              : "hover:bg-gray-50"
          }`}
        >
          {/* Rank Badge */}
          <div
            className={`mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
              item.rank <= 3
                ? "bg-yellow-400 text-yellow-900"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {item.rank}
          </div>

          {/* Thumbnail */}
          {item.img_thumb ? (
            <img
              src={item.img_thumb}
              alt=""
              className="w-12 h-12 rounded bg-gray-100 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-gray-100" />
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 truncate">
              {item.brand_name}
            </div>
            <div className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
              {item.product_name}
            </div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              {item.price.toLocaleString()}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
