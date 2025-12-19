"use server";

import { Redis } from "@upstash/redis";

// Redis 클라이언트 (환경변수 자동 로드)
const redis = Redis.fromEnv();
const HEART_KEY = "wedding:hearts";

// 1. 초기 하트 수 가져오기
export const getHeartCount = async () => {
  try {
    const count = await redis.get<number>(HEART_KEY);
    return count || 0;
  } catch (error) {
    console.error("Redis Get Error:", error);
    return 0;
  }
};

// 2. 하트 증가 (배치 처리)
export const incrementHeart = async (amount: number) => {
  try {
    if (amount <= 0) return null;
    const newCount = await redis.incrby(HEART_KEY, amount);
    return newCount;
  } catch (error) {
    console.error("Redis Incr Error:", error);
    return null;
  }
};
