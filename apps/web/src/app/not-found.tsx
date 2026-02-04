"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-white">
      <div className="space-y-2 text-center">
        <h1 className="text-6xl font-bold text-black">404</h1>
        <p className="text-xl text-gray-600">Page not found</p>
      </div>
      <p className="text-gray-500">The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
