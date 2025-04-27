"use client";

import { type ReactNode } from "react";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { LanguageProvider } from "./language-provider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}
