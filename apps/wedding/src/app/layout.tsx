import type { Metadata } from "next";
import "./globals.css";
import { Splash } from "./_components/Splash";
import { FloatingButton } from "./_components/FloatingButton";
import { Analytics } from "./_components/Analytics";

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
      <body className="antialiased">
        <Analytics />
        <Splash />
        {children}
        <FloatingButton />
      </body>
    </html>
  );
};

export default RootLayout;
