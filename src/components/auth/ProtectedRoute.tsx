"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedContent({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se chegou até aqui, o middleware já fez a verificação de autenticação
  return <>{children}</>;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <ProtectedContent>{children}</ProtectedContent>;
}
