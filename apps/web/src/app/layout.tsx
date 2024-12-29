import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import local from "next/font/local";
import localFont from "next/font/local";
import { SessProvider } from "@/providers/SessionProvider";

const localInter = localFont({
  src: [
    {
      path: "../../public/fonts/inter/Inter-Thin.ttf",
      weight: "100",
      style: "thin",
    },
    {
      path: "../../public/fonts/inter/Inter-ExtraLight.ttf",
      weight: "200",
      style: "extralight",
    },
    {
      path: "../../public/fonts/inter/Inter-Light.ttf",
      weight: "300",
      style: "light",
    },
    {
      path: "../../public/fonts/inter/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/Inter-Medium.ttf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../../public/fonts/inter/Inter-SemiBold.ttf",
      weight: "600",
      style: "semibold",
    },
    {
      path: "../../public/fonts/inter/Inter-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/fonts/inter/Inter-ExtraBold.ttf",
      weight: "800",
      style: "extrabold",
    },
    {
      path: "../../public/fonts/inter/Inter-Black.ttf",
      weight: "900",
      style: "black",
    },
  ],
});

// const deacon = local({
//   src: [
//     {
//       path: "../../public/fonts/Inter.otf",
//       weight: "800",
//     },
//   ],
//   variable: "--font-deacon",
// });

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  // weight: "400",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "march",
  description: "A lightweight sprint planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter font-light`}>
      {/* <body className={inter.className}> */}
        <SessProvider>{children}</SessProvider>
      </body>
    </html>
  );
}
