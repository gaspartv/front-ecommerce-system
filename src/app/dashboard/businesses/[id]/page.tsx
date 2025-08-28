"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useParams, useRouter } from "next/navigation";
import BusinessWizard from "../_components/BusinessWizard";

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.id as string;
  return (
    <ProtectedRoute>
      <DashboardLayout
        currentPage="businesses"
        title="Editar Empresa"
        subtitle="Edição de empresa"
      >
        <BusinessWizard
          mode="edit"
          businessId={businessId}
          onFinished={() => router.push("/dashboard/businesses")}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
