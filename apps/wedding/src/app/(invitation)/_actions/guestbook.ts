"use server";

import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";

const redis = Redis.fromEnv();
const GUESTBOOK_KEY = "wedding:guestbook";

export type GuestMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: number;
};

export const addGuestMessage = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  if (!name || !message) return { success: false, newMessage: null };

  const now = Date.now();
  const newMessage: GuestMessage = {
    id: now.toString(),
    name,
    message,
    createdAt: now,
  };

  try {
    await redis.lpush(GUESTBOOK_KEY, newMessage);
    revalidatePath("/");
    return { success: true, newMessage };
  } catch (error) {
    console.error("Guestbook Error:", error);
    return { success: false, newMessage: null };
  }
};

export const getGuestMessages = async (
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const messages = await redis.lrange<GuestMessage>(
      GUESTBOOK_KEY,
      start,
      end,
    );
    return messages ?? [];
  } catch {
    return [];
  }
};

export const getGuestMessageCount = async () => {
  try {
    return await redis.llen(GUESTBOOK_KEY);
  } catch {
    return 0;
  }
};
