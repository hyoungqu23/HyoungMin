import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Day",
  description: "Hyoungmin and Heejea's Wedding Day",
};

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;
