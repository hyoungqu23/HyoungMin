import { Archivo_Black, IBM_Plex_Mono } from "next/font/google";

import "./portfolio.css";

const PortfolioLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={`${archivoBlack.variable} ${ibmPlexMono.variable}`}>
      {children}
    </div>
  );
};

export default PortfolioLayout;

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-black",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});
