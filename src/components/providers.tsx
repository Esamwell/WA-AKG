"use client";

import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "@/components/chat/socket-context";
import { LanguageProvider } from "@/contexts/language-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
