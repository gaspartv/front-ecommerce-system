"use client";

import { LoadingProvider } from "@/contexts/loading-context";
import TopLoadingBar from "@/libs/n-progress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode, useState } from "react";

interface iProviderProps {
  children: ReactNode;
}

export default function Providers({ children }: iProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <TopLoadingBar />
        <NuqsAdapter>{children}</NuqsAdapter>
      </LoadingProvider>
    </QueryClientProvider>
  );
}
