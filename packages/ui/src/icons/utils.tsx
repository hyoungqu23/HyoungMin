import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function createIcon(
  viewBox: string,
  children: React.ReactNode,
): React.ComponentType<IconProps> {
  return ({ size = 24, className, ...props }) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}
