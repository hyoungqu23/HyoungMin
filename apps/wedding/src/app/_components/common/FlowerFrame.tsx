"use client";

import Image from "next/image";
import { motion } from "motion/react";

export const FlowerFrame = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto p-4">
      <div className="absolute inset-0 z-20 pointer-events-none">
        <Image
          src="/images/frame.svg"
          alt="Flower Frame"
          fill
          className="object-cover scale-110 rotate-180"
        />
      </div>

      <div className="relative z-10 w-full aspect-3/4 rounded-t-full rounded-b-3xl overflow-hidden shadow-lg bg-stone-100">
        <Image
          src={imageSrc}
          alt="Wedding Day"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-stone-500/5 mix-blend-multiply pointer-events-none" />
      </div>
    </div>
  );
};
