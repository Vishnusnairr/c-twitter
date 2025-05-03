// app/layout.js
"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-black text-[18px] font-medium text-white">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
