const FALLBACK_UNLOCK_CODE = "151226";

export const PROPOSE_UNLOCK_CODE =
  process.env.NEXT_PUBLIC_PROPOSE_UNLOCK_CODE ?? FALLBACK_UNLOCK_CODE;

export const isUnlockCodeValid = (code: string) => {
  return code.trim() === PROPOSE_UNLOCK_CODE;
};
