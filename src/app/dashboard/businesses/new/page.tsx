"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useRouter } from "next/navigation";
import BusinessWizard from "../_components/BusinessWizard";

export default function NovaEmpresaPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <DashboardLayout
        currentPage="businesses"
        title="Nova Empresa"
        subtitle="Criação de empresa"
      >
        <BusinessWizard
          mode="create"
          onFinished={() => router.push("/dashboard/businesses")}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
