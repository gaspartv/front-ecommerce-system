"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import { BuildingOfficeIcon } from "@/components/icons";
import ChangeStatusModal from "@/components/modals/ChangeStatusModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import api from "@/config/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Empresa extends Record<string, unknown> {
  id: string;
  code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  disabled: boolean;
  name: string;
}

interface ApiResponse {
  page: number;
  size: number;
  total: number;
  sort?: string;
  order?: string;
  has_more: boolean;
  prev_page: number;
  next_page: number;
  last_page: number;
  column?: string;
  data: Empresa[];
}

export default function BusinessesPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState<Empresa[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  // Função para formatar data para padrão brasileiro
  const formatDateToBrazilian = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Função para buscar empresas da API
  const fetchBusinesses = async (page: number = 1, search: string = "") => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: itemsPerPage.toString(),
      });

      if (search.trim()) {
        params.append("search", search);
      }

      const response = await api.get<ApiResponse>(`/business?${params}`);
      const { data, total, last_page } = response.data;

      console.log("Empresas carregadas:", data);

      setBusinesses(data);
      setTotalPages(last_page);
      setTotalItems(total);
    } catch (error) {
      toast.error("Erro ao carregar empresas");
      console.error("Erro ao buscar empresas:", error);
    }
  };

  useEffect(() => {
    fetchBusinesses(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset para primeira página ao buscar
  };

  const handleEditEmpresa = (empresa: Empresa) => {
    router.push(`/dashboard/businesses/${empresa.id}`);
  };

  const handleDeleteEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowDeleteModal(true);
  };

  const handleChangeStatus = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowStatusModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEmpresa) {
      console.log("Excluindo empresa:", selectedEmpresa.name);
      // Aqui você implementaria a lógica de exclusão
      setShowDeleteModal(false);
      setSelectedEmpresa(null);
    }
  };

  const handleConfirmStatusChange = (newStatus: string) => {
    if (selectedEmpresa) {
      console.log(
        "Alterando status da empresa:",
        selectedEmpresa.name,
        "para:",
        newStatus
      );
      // Aqui você implementaria a lógica de alteração de status
      setShowStatusModal(false);
      setSelectedEmpresa(null);
    }
  };

  const columns = [
    {
      header: "Empresa",
      key: "name",
      render: (value: unknown, item: Empresa) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <BuildingOfficeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {item.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Código: {item.code}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Data de Criação",
      key: "created_at",
      render: (value: unknown, item: Empresa) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {formatDateToBrazilian(item.created_at)}
        </div>
      ),
    },
    {
      header: "Última Atualização",
      key: "updated_at",
      render: (value: unknown, item: Empresa) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {formatDateToBrazilian(item.updated_at)}
        </div>
      ),
    },
    {
      header: "Status",
      key: "disabled",
      render: (value: unknown, item: Empresa) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            !item.disabled
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {!item.disabled ? "Ativa" : "Inativa"}
        </span>
      ),
    },
    {
      header: "Ações",
      key: "actions",
      render: (value: unknown, item: Empresa) => (
        <div className="text-sm font-medium space-x-2">
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
            onClick={() => handleEditEmpresa(item)}
          >
            Editar
          </button>
          <button
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer"
            onClick={() => handleChangeStatus(item)}
          >
            Status
          </button>
          <button
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
            onClick={() => handleDeleteEmpresa(item)}
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  const handleNovaEmpresa = () => {
    router.push("/dashboard/businesses/new");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout
        currentPage="businesses"
        title="Empresas"
        subtitle="Gerencie as empresas cadastradas no sistema"
        actionButton={{
          label: "+ Nova Empresa",
          onClick: handleNovaEmpresa,
        }}
      >
        <DataTable<Empresa>
          title="Lista de Empresas"
          columns={columns}
          data={businesses}
          searchPlaceholder="Buscar empresas..."
          onSearch={handleSearchChange}
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={selectedEmpresa?.name || ""}
        />

        <ChangeStatusModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleConfirmStatusChange}
          currentStatus={selectedEmpresa?.disabled ? "Inativa" : "Ativa"}
          itemName={selectedEmpresa?.name || ""}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
