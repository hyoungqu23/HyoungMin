"use client";

import { motion, useInView } from "motion/react";
import { Activity, useEffect, useEffectEvent, useRef, useState } from "react";
import {
  addGuestMessage,
  getGuestMessages,
  type GuestMessage,
} from "../../_actions/guestbook";
import { ScrollMasonry } from "../common/ScrollMasonry";

const NOTE_COLORS = [
  "bg-yellow-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-rose-100",
  "bg-purple-100",
  "bg-orange-100",
];

const getMessageStyle = (id: string) => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = NOTE_COLORS[hash % NOTE_COLORS.length];
  const rotation = (hash % 7) - 3;

  return { color, rotation };
};

export const RollingPaper = ({
  initialMessages,
}: {
  initialMessages: GuestMessage[];
}) => {
  const [messages, setMessages] = useState<GuestMessage[] | undefined>(
    initialMessages,
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, { margin: "100px" });

  const loadMore = useEffectEvent(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const newMessages = await getGuestMessages(nextPage, 10);

    if (newMessages.length === 0) {
      setHasMore(false);
    } else {
      setMessages((prev) => [...(prev || []), ...newMessages]);
      setPage(nextPage);
    }
    setIsLoading(false);
  });

  useEffect(() => {
    if (isInView && hasMore) {
      loadMore();
    }
  }, [hasMore, isInView]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("message", message.trim());

      const { success, newMessage } = await addGuestMessage(formData);
      if (success && newMessage) {
        setMessages((prev) => [newMessage, ...(prev || [])]);
        setName("");
        setMessage("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-3 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/60 shadow-sm"
      >
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="이름"
            className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            남기기
          </button>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          placeholder="축하의 말을 남겨주세요 :)"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white/80 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      </form>

      <Activity
        mode={messages?.length && messages.length > 0 ? "visible" : "hidden"}
      >
        <div className="w-full rounded-3xl border border-stone-200/60 bg-stone-50/80 shadow-inner p-4 pb-6 relative overflow-hidden min-h-[260px]">
          <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_1px_1px,#e5e7eb_0,transparent_1px)] bg-size-[16px_16px]" />

          <div className="relative">
            <ScrollMasonry className="pb-4">
              {messages?.map((msg) => {
                const { color, rotation } = getMessageStyle(msg.id);

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className={`relative p-3 rounded-sm shadow-md ${color} min-h-15 flex flex-col justify-between break-inside-avoid mb-4`}
                    style={{ rotate: `${rotation}deg` }}
                  >
                    <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed font-yeongwol">
                      {msg.message}
                    </p>
                    <div className="text-right mt-2">
                      <span className="text-xs text-stone-500 font-bold tracking-tight">
                        - {msg.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </ScrollMasonry>

            <div ref={loadMoreRef} className="py-4 text-center w-full">
              {isLoading && (
                <div className="inline-block w-5 h-5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
              )}
              {!hasMore && messages && messages.length > 0 && (
                <p className="text-xs text-stone-400">마지막 메시지입니다 🌸</p>
              )}
            </div>
          </div>
        </div>
      </Activity>
    </div>
  );
};
