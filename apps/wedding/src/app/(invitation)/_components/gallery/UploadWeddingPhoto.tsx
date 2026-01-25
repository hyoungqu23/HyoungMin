"use client";

import { motion } from "motion/react";

export const UploadWeddingPhoto = () => {
  return (
    <motion.a
      whileTap={{ scale: 0.95 }}
      href="https://photos.google.com/share/AF1QipNM4t2baLUmZq_81HycTX1FjJrUdYlXpLA6QBws8v_H7E0cMyciig1U0TIEB_0Qxg?key=UDU4MGVQWWZSSkJSc3BiODJ5MXRGS1Y3TFotLU9R"
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white font-bold rounded-full shadow-md transition-colors"
    >
      신랑, 신부의 예쁜 사진 전달하기
    </motion.a>
  );
};
