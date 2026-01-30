"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { incrementHeart } from "../../_actions/hearts";

type Particle = {
  id: number;
  x: number;
  y: number;
  targetY: number;
  rotate: number;
  scale: number;
  color: string;
};

const STORAGE_KEY = "wedding_heart_local_count";
const MAX_FILL_COUNT = 10;

const CUTE_HEART_PATH =
  "M 50,23 C 28,2 2,32 15,58 C 24,76 45,90 50,93 C 55,90 76,76 85,58 C 98,32 72,2 50,23 Z";

const HEART_COLORS = [
  "text-rose-400",
  "text-pink-400",
  "text-red-400",
  "text-rose-300",
];

const CuteParticleHeart = ({ color }: { color: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={`w-full h-full drop-shadow-sm ${color}`}
  >
    <path d={CUTE_HEART_PATH} stroke="none" />
  </svg>
);

type HeartButtonProps = {
  initialCountPromise: Promise<number>;
};

export const HeartButton = ({ initialCountPromise }: HeartButtonProps) => {
  const initialCount = use(initialCountPromise);

  const [globalCount, setGlobalCount] = useState(initialCount);
  const [localCount, setLocalCount] = useState(0);

  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClicking, setIsClicking] = useState(false);

  const pendingCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const save = useEffectEvent((count: string) => {
    setLocalCount(parseInt(count, 10));
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      save(saved);
    }
  }, []);

  useEffect(() => {
    if (localCount > 0) {
      localStorage.setItem(STORAGE_KEY, localCount.toString());
    }
  }, [localCount]);

  const handleClick = useCallback(() => {
    setGlobalCount((prev) => prev + 1);
    setLocalCount((prev) => prev + 1);
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 150);

    const newParticle: Particle = {
      id: Date.now(),
      x: (Math.random() - 0.5) * 100,
      y: 0,
      targetY: -150 - Math.random() * 60,
      rotate: (Math.random() - 0.5) * 40,
      scale: 0.5 + Math.random() * 0.5,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    };

    setParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);

    pendingCount.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const amount = pendingCount.current;
      if (amount === 0) return;

      pendingCount.current = 0;
      const serverCount = await incrementHeart(amount);
      if (serverCount !== null) setGlobalCount(serverCount);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingCount.current > 0) {
        void incrementHeart(pendingCount.current);
      }
    };
  }, []);

  const fillRatio = Math.min(localCount, MAX_FILL_COUNT) / MAX_FILL_COUNT;

  return (
    <div className="fixed bottom-4 left-2 z-40 flex flex-col items-center font-pretendard gap-0.5">
      {/* 파티클 */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-60 overflow-visible">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 ${p.color}`}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: p.targetY,
                x: p.x,
                rotate: p.rotate,
                scale: p.scale,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <CuteParticleHeart color="" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 카운트 */}
      <motion.div
        key={globalCount}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="px-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-rose-100 shadow-sm text-[10px] font-bold text-primary tabular-nums"
      >
        {globalCount > 0 ? globalCount.toLocaleString() : "Like"}
      </motion.div>

      {/* 버튼 */}
      <motion.button
        onClick={handleClick}
        animate={{ scale: isClicking ? 0.85 : 1, rotate: isClicking ? -5 : 0 }}
        whileHover={{ scale: 1.1 }}
        className="relative size-8 drop-shadow-xl cursor-pointer transition-transform active:scale-90"
        style={{ filter: "drop-shadow(0px 4px 6px rgba(251, 113, 133, 0.4))" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <mask id="cute-heart-mask">
              <path d={CUTE_HEART_PATH} fill="white" />
            </mask>
          </defs>

          <path d={CUTE_HEART_PATH} fill="white" stroke="none" />

          <g mask="url(#cute-heart-mask)">
            <motion.rect
              x="0"
              width="100"
              height="100"
              fill="#FB7185"
              initial={{ y: 100 }}
              animate={{ y: 100 - fillRatio * 100 }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
            />
          </g>

          <path
            d={CUTE_HEART_PATH}
            fill="none"
            stroke={localCount > 0 ? "#FB7185" : "#E7E5E4"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M 25,35 Q 30,25 40,25"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-60"
          />
        </svg>
      </motion.button>
    </div>
  );
};
