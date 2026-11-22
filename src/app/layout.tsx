import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { BagDrawer } from "@/components/BagDrawer";
import { Toast } from "@/components/Toast";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Normand — Calm clothing for slow days",
  description:
    "Heavy cotton, washed linen and brushed wool from small workshops. Calm clothing for slow days.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <SmoothScroll />
          {children}
          <BagDrawer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
