"use client";

type HorizontalScrollProps = {
  children: React.ReactNode;
  speed?: number;
  className?: string;
};

export const HorizontalScroll = ({
  children,
  speed = 200,
  className = "",
}: HorizontalScrollProps) => {
  return (
    <section className={`w-full overflow-hidden ${className}`}>
      <div
        className="flex gap-2 whitespace-nowrap animate-marquee"
        style={
          {
            "--marquee-duration": `${speed}s`,
            width: "max-content",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center gap-2">{children}</div>
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      </div>
    </section>
  );
};
