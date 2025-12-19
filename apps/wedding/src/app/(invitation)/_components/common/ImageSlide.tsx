import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

type SlideImage = {
  src: string | StaticImageData;
  alt?: string;
};

type ImageSlideProps = {
  images: SlideImage[];
  className?: string;
  aspectRatioClassName?: string;
  durationSec?: number;
};

// Pure CSS-driven slider (no JS handlers). Duplicates the slide list so the
// keyframe animation loops seamlessly. Animation pauses on hover and respects
// prefers-reduced-motion.
export const ImageSlide = ({
  images,
  className = "",
  aspectRatioClassName = "aspect-[4/3]",
  durationSec = 18,
}: ImageSlideProps) => {
  if (images.length === 0) return null;

  const shouldAnimate = images.length > 1;
  const loopedImages = shouldAnimate ? [...images, ...images] : images;
  const safeDuration = Math.max(durationSec, 6);

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl border border-rose-100 bg-white/70 shadow-sm ${className}`}
      style={
        {
          "--slide-count": images.length,
          "--image-slide-duration": `${safeDuration}s`,
        } as CSSProperties
      }
    >
      <div
        className="flex image-slide-track"
        data-animate={shouldAnimate}
        aria-live="polite"
      >
        {loopedImages.map((image, index) => (
          <div
            key={`${typeof image.src === "string" ? image.src : image.src.src}-${index}`}
            className={`relative w-full flex-shrink-0 ${aspectRatioClassName}`}
          >
            <Image
              src={image.src}
              alt={image.alt ?? `Slide ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {shouldAnimate ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent"
            aria-hidden
          />
        </>
      ) : null}

      <style jsx>{`
        .image-slide-track {
          width: calc(var(--slide-count) * 200%);
          animation: image-slide var(--image-slide-duration) linear infinite;
        }

        .image-slide-track[data-animate="false"] {
          width: 100%;
          animation: none;
        }

        .group:hover .image-slide-track {
          animation-play-state: paused;
        }

        @keyframes image-slide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% * var(--slide-count)));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .image-slide-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
