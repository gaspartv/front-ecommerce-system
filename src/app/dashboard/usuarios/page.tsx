"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";

interface Usuario extends Record<string, unknown> {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  role: string;
  status: string;
}

export default function UsuariosPage() {
  const usuarios: Usuario[] = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao@techsolutions.com",
      empresa: "Tech Solutions Ltd.",
      role: "Admin",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@commerce.com",
      empresa: "Commerce Inc.",
      role: "Usuário",
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      email: "pedro@digitalworld.com",
      empresa: "Digital World",
      role: "Usuário",
      status: "Inativo",
    },
    {
      id: 4,
      nome: "Ana Costa",
      email: "ana@innovation.com",
      empresa: "Innovation Corp.",
      role: "Manager",
      status: "Ativo",
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "Manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const columns = [
    {
      header: "Usuário",
      key: "nome",
      render: (value: unknown, item: Usuario) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {getInitials(item.nome)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {item.nome}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      render: (value: unknown) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {String(value)}
        </div>
      ),
    },
    {
      header: "Empresa",
      key: "empresa",
      render: (value: unknown) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {String(value)}
        </div>
      ),
    },
    {
      header: "Função",
      key: "role",
      render: (value: unknown) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
            String(value)
          )}`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (value: unknown) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            String(value) === "Ativo"
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      header: "Ações",
      key: "actions",
      render: () => (
        <div className="text-sm font-medium space-x-2">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Editar
          </button>
          <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
            Excluir
          </button>
        </div>
      ),
    },
  ];

  const handleNovoUsuario = () => {
    // Implementar lógica para novo usuário
    console.log("Criar novo usuário");
  };

  return (
    <DashboardLayout
      currentPage="usuarios"
      title="Usuários"
      subtitle="Gerencie os usuários cadastrados no sistema"
      actionButton={{
        label: "+ Novo Usuário",
        onClick: handleNovoUsuario,
      }}
    >
      <DataTable<Usuario>
        title="Lista de Usuários"
        columns={columns}
        data={usuarios}
        searchPlaceholder="Buscar usuários..."
      />
    </DashboardLayout>
  );
}
