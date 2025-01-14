import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { SessionProvider } from "@/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'userArray',
  description: 'Linear companion for open source and user facing teams',
  icons: {
    icon: '/new_logo.png',
    shortcut: '/new_logo.png',
    apple: '/new_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter font-light`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
