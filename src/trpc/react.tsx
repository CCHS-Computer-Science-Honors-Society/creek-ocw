"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";

import { type AppRouter } from "@/server/api/root";
import { getUrl, transformer } from "./shared";
import { Toaster } from "sonner";

export const api = createTRPCReact<AppRouter>();

type Theme = "light" | "dark" | "system";
export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers: Headers;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const { theme } = useTheme();

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            const heads = new Map(props.headers);
            heads.set("x-trpc-source", "react");
            return Object.fromEntries(heads);
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {props.children}
        </ThemeProvider>
        <Toaster
          richColors
          position="top-center"
          theme={(theme as Theme) ?? "system"}
        />
      </api.Provider>
    </QueryClientProvider>
  );
}
