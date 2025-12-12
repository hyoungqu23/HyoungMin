"use client";

import { motion } from "motion/react";

export const UploadWeddingPhoto = () => {
  return (
    <motion.a
      whileTap={{ scale: 0.95 }}
      href="https://photos.google.com/share/AF1QipNM4t2baLUmZq_81HycTX1FjJrUdYlXpLA6QBws8v_H7E0cMyciig1U0TIEB_0Qxg?key=UDU4MGVQWWZSSkJSc3BiODJ5MXRGS1Y3TFotLU9R"
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-400 hover:bg-rose-200 text-rose-500 rounded-full shadow-md transition-colors"
    >
      업로드하기
    </motion.a>
  );
};
