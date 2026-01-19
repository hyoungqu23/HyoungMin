import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getProductHistory, RankHistory } from "../lib/commands";

interface Props {
  productId: string;
}

export function HistoryChart({ productId }: Props) {
  const [data, setData] = useState<RankHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const history = await getProductHistory(productId);
        if (mounted && requestId === requestIdRef.current) {
          // Sort by date just in case
          const sorted = [...history].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
          setData(sorted);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        if (mounted && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    if (productId) {
      fetchHistory();
    } else {
      setData([]);
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-64 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No history data available.
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 px-2">
        30-Day Ranking Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            tickFormatter={(date) => {
              // Format: "MM/DD HH:mm" or just "MM/DD"
              try {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              } catch {
                return date;
              }
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            reversed
            domain={[1, 100]} /* Or 'auto' */
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Line
            type="monotone"
            dataKey="rank"
            stroke="#FACC15" /* Yellow-400 */
            strokeWidth={3}
            dot={{ r: 4, fill: "#FACC15", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
