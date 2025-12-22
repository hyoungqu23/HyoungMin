"use client";

import { Canvas } from "@react-three/fiber";
import { useAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { MEMORIES } from "../_constants/memories";
import { isUnlockCodeValid } from "../_actions/unlock";
import { activeMemoryIdAtom, proposalModeAtom } from "../_stores/lock";
import { ProposeScene } from "./ProposeScene";
import { ProposeScrollScene } from "./ProposeScrollScene";

const MAX_CODE_LENGTH = 6;

export const ProposeClient = () => {
  const [mode, setMode] = useAtom(proposalModeAtom);
  const [activeMemoryId, setActiveMemoryId] = useAtom(activeMemoryIdAtom);
  const [code, setCode] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeMemory = activeMemoryId
    ? (MEMORIES.find((memory) => memory.id === activeMemoryId) ?? null)
    : null;

  useEffect(() => {
    if (mode === "locked") {
      inputRef.current?.focus();
    }
  }, [mode]);

  useEffect(() => {
    if (!activeMemoryId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMemoryId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeMemoryId, setActiveMemoryId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length < MAX_CODE_LENGTH) {
      triggerError("Enter the full passcode.");
      return;
    }

    if (!isUnlockCodeValid(code)) {
      triggerError("That code does not match.");
      return;
    }

    setHasError(false);
    setErrorMessage(null);
    setCode("");
    setMode("scroll");
  };

  const triggerError = (message: string) => {
    setHasError(true);
    setErrorMessage(message);
    window.setTimeout(() => {
      setHasError(false);
    }, 600);
  };

  const handleCodeChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, MAX_CODE_LENGTH);
    setCode(sanitized);
    if (errorMessage) setErrorMessage(null);
  };

  return (
    <div className="relative h-svh w-screen overflow-hidden bg-[#070810] text-white">
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 1.4, 6.4], fov: 40 }}
        dpr={[1, 1.6]}
      >
        <Suspense fallback={null}>
          {mode === "locked" ? <ProposeScene /> : <ProposeScrollScene />}
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {mode === "locked" ? (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#05060a]/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative w-[min(92vw,440px)] rounded-[28px] border border-white/10 bg-linear-to-br from-[#1a1b24] via-[#12131a] to-[#0b0c12] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                      Private Vault
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-white">
                      Memory Lock
                    </h1>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] tracking-[0.2em] text-white/60">
                    HM
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-linear-to-br from-[#2a2b36] to-[#0d0e13] shadow-inner shadow-black/60">
                    <div className="h-6 w-6 rounded-full border border-white/20" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Enter our passcode
                    </p>
                    <p className="text-xs text-white/60">
                      4 digits unlock the gallery.
                    </p>
                  </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/50">
                    Passcode
                  </label>
                  <motion.div
                    animate={hasError ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <input
                      ref={inputRef}
                      value={code}
                      onChange={(event) => handleCodeChange(event.target.value)}
                      type="password"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={MAX_CODE_LENGTH}
                      className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-lg tracking-[0.4em] text-white shadow-inner shadow-black/80 outline-none transition focus:border-white/40"
                    />
                  </motion.div>
                  {errorMessage ? (
                    <motion.p
                      className="text-xs text-rose-200/90"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errorMessage}
                    </motion.p>
                  ) : null}
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      className="flex-1 rounded-2xl bg-white text-sm font-semibold text-[#0d0f16] shadow-[0_12px_24px_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5"
                      whileTap={{ scale: 0.98 }}
                    >
                      Unlock
                    </motion.button>
                    <motion.button
                      type="button"
                      className="rounded-2xl border border-white/15 px-4 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCode("")}
                    >
                      Clear
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mode === "scroll" && activeMemory ? (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onPointerDown={() => setActiveMemoryId(null)}
          >
            <motion.div
              className="relative w-[min(92vw,620px)] max-h-[min(82svh,760px)] overflow-hidden rounded-[28px] border border-black/10 bg-linear-to-b from-[#fffdf7] to-[#fff7f0] text-stone-900 shadow-[0_30px_110px_rgba(0,0,0,0.35)]"
              initial={{ y: 18, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_55%)]" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-4">
                  <div className="flex flex-col">
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                      {activeMemory.date}
                    </p>
                    <p className="mt-1 text-lg font-semibold">추억 편지</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-stone-700 shadow-sm transition hover:bg-white"
                    onClick={() => setActiveMemoryId(null)}
                  >
                    닫기
                  </button>
                </div>
                <div className="flex-1 overflow-auto px-6 py-6">
                  <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-inner">
                    <p className="whitespace-pre-line leading-relaxed text-stone-800">
                      {activeMemory.letter}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
