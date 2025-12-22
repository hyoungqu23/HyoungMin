import { atom } from "jotai";

export type ProposalMode = "locked" | "scroll" | "manual";

export const proposalModeAtom = atom<ProposalMode>("locked");

export const activeMemoryIdAtom = atom<string | null>(null);
export const isLetterOpenAtom = atom((get) => get(activeMemoryIdAtom) !== null);

export const focusedMemoryIdAtom = atom<string | null>(null);
