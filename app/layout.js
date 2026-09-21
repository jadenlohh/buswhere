import { DM_Sans } from "next/font/google";
import "./globals.css";

const inter = DM_Sans({
  subsets: ["latin"]
});


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <body className="flex h-full justify-center">{children}</body>
    </html>
  );
}
