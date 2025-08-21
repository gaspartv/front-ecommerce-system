"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { BuildingOfficeIcon, HomeIcon, UsersIcon } from "@/components/icons";

export default function DashboardPage() {
  const activities = [
    {
      action: "Nova empresa cadastrada",
      user: "Tech Solutions Ltd.",
      time: "2 minutos atrás",
    },
    { action: "Usuário criado", user: "João Silva", time: "15 minutos atrás" },
    {
      action: "Empresa atualizada",
      user: "Commerce Inc.",
      time: "1 hora atrás",
    },
    { action: "Usuário removido", user: "Maria Santos", time: "2 horas atrás" },
  ];

  return (
    <DashboardLayout
      currentPage="dashboard"
      title="Dashboard"
      subtitle="Bem-vindo ao painel de controle"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total de Empresas"
          value="12"
          icon={
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="Total de Usuários"
          value="248"
          icon={
            <UsersIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          }
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          title="Ativos Hoje"
          value="89"
          icon={
            <HomeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          }
          bgColor="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Atividades Recentes
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.user}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
