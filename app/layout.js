import { Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";

const inter = Atkinson_Hyperlegible_Next({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="flex h-full w-auto justify-center lg:bg-[#F7F7F7]">{children}</body>
    </html>
  );
}
