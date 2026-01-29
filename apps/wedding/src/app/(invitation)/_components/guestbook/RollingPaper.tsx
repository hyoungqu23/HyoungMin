"use client";

import ChevronLeft from "@icons/arrow_left.svg";
import ChevronRight from "@icons/arrow_right.svg";
import Close from "@icons/close.svg";
import { AnimatePresence, motion, useInView, type PanInfo } from "motion/react";
import Image from "next/image";
import {
  Activity,
  memo,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import {
  addGuestMessage,
  getGuestMessages,
  type GuestMessage,
} from "../../_actions/guestbook";

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

// 메시지 카드 컴포넌트 (truncation 적용)
type MessageCardProps = {
  message: GuestMessage;
  index: number;
  onClick: (index: number) => void;
};

const MessageCard = memo(function MessageCard({
  message,
  index,
  onClick,
}: MessageCardProps) {
  const { color, rotation } = getMessageStyle(message.id);

  const handleClick = useCallback(() => {
    onClick(index);
  }, [onClick, index]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={handleClick}
      className={`relative p-3 rounded-sm shadow-md ${color} min-h-15 flex flex-col justify-between break-inside-avoid mb-4 cursor-pointer hover:shadow-lg transition-shadow`}
      style={{ rotate: `${rotation}deg` }}
    >
      <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed font-yeongwol line-clamp-3">
        {message.message}
      </p>
      <div className="text-right mt-2">
        <span className="text-xs text-stone-500 font-bold tracking-tight">
          - {message.name}
        </span>
      </div>
    </motion.div>
  );
});

// 메시지 모달 컴포넌트 (갤러리 형태)
type MessageModalProps = {
  messages: GuestMessage[];
  selectedIndex: number | null;
  onClose: () => void;
  onIndexChange: (newIndex: number) => void;
};

const modalVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const MessageModal = ({
  messages,
  selectedIndex,
  onClose,
  onIndexChange,
}: MessageModalProps) => {
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      if (selectedIndex === null) return;
      setDirection(newDirection);

      let nextIndex = selectedIndex + newDirection;
      if (nextIndex < 0) nextIndex = messages.length - 1;
      if (nextIndex >= messages.length) nextIndex = 0;

      onIndexChange(nextIndex);
    },
    [selectedIndex, messages.length, onIndexChange],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, onClose, paginate]);

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo,
  ) => {
    const swipeConfidenceThreshold = 5000;
    const swipePower = Math.abs(offset.x) * velocity.x;

    if (swipePower < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipePower > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  if (selectedIndex === null) return null;

  const currentMessage = messages[selectedIndex];
  const { color } = getMessageStyle(currentMessage.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-md px-6 py-20"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"
        onClick={onClose}
      >
        <Image src={Close} alt="Close" width={16} height={16} />
      </button>

      <button
        className="absolute left-2 z-50 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
        onClick={(e) => {
          e.stopPropagation();
          paginate(-1);
        }}
      >
        <Image src={ChevronLeft} alt="Previous" width={20} height={20} />
      </button>
      <button
        className="absolute right-2 z-50 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
        onClick={(e) => {
          e.stopPropagation();
          paginate(1);
        }}
      >
        <Image src={ChevronRight} alt="Next" width={20} height={20} />
      </button>

      <div
        className="relative w-full max-w-sm flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={selectedIndex}
            custom={direction}
            variants={modalVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            className={`w-[80%] p-6 rounded-lg shadow-2xl ${color}`}
          >
            <p className="text-base text-stone-700 whitespace-pre-wrap leading-relaxed font-yeongwol">
              {currentMessage.message}
            </p>
            <div className="text-right mt-4">
              <span className="text-sm text-stone-500 font-bold tracking-tight">
                - {currentMessage.name}
              </span>
            </div>

            <div className="text-center mt-4 text-stone-400 text-xs">
              {selectedIndex + 1} / {messages.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
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

  // 갤러리 모달 상태
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleIndexChange = useCallback((newIndex: number) => {
    setSelectedIndex(newIndex);
  }, []);

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
            <div className="grid grid-cols-3 gap-3">
              {messages?.map((msg, index) => (
                <MessageCard
                  key={msg.id}
                  message={msg}
                  index={index}
                  onClick={handleSelect}
                />
              ))}
            </div>

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

      {/* 갤러리 모달 */}
      <AnimatePresence>
        {selectedIndex !== null && messages && (
          <MessageModal
            messages={messages}
            selectedIndex={selectedIndex}
            onClose={handleClose}
            onIndexChange={handleIndexChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
