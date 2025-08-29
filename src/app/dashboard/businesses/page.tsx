"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import {
  BuildingOfficeIcon,
  PencilIcon,
  StatusIcon,
  TrashIcon,
} from "@/components/icons";
import ChangeStatusModal from "@/components/modals/ChangeStatusModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import api from "@/config/axios";
import { resolveColumnLabel } from "@/config/columnTranslations";
import {
  formatCNPJ,
  formatDateToBrazilian,
  formatPhone,
} from "@/utils/formatters";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Empresa extends Record<string, unknown> {
  id: string;
  code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  disabled: boolean;
  name: string;
  responsible: string;
  email: string;
  phone: string;
  cnpj: string;
  notes: string | null;
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
  // Backend agora retorna as colunas dinâmicas
  columns?: { key: string; label: string }[];
}

export default function BusinessesPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [businesses, setBusinesses] = useState<Empresa[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  // Default de itens por página atualizado para 10 conforme requisito
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Ordenação
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // Colunas dinâmicas vindas do backend (sem a coluna de ações, adicionada no fim)
  const [dynamicColumns, setDynamicColumns] = useState<
    { key: string; label: string }[]
  >([]);
  const STORAGE_KEY = "businesses_table_prefs";

  // Função para buscar empresas da API
  const fetchBusinesses = useCallback(
    async (page: number = 1, search: string = "", force: boolean = false) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: itemsPerPage.toString(),
        });

        if (search.trim()) {
          params.append("search", search);
        }

        // Adiciona filtro de status se não for "all"
        if (statusFilter !== "all") {
          const isDisabled = statusFilter === "inactive";
          params.append("disabled", isDisabled.toString());
        }

        if (sortKey) {
          params.append("sort_by", sortKey);
          params.append("order", sortDirection);
        }

        // Evita cache 304 adicionando timestamp; se force true adiciona 'force' extra
        params.append("_", Date.now().toString());
        if (force) params.append("force", Date.now().toString());
        const response = await api.get<ApiResponse>(
          `/business?${params.toString()}`,
          {
            headers: {
              "Cache-Control": force ? "no-store" : "no-cache",
              Pragma: force ? "no-store" : "no-cache",
            },
          }
        );
        if (response.status === 304) {
          // Mantém dados atuais; nada mudou
          return;
        }
        const { data, total, last_page, columns } = response.data || {};
        if (!data) return; // segurança caso resposta vazia

        setBusinesses(data);
        setTotalPages(last_page);
        setTotalItems(total);
        // Normalização das colunas retornadas:
        // 1) Array de objetos [{ key, label }]
        // 2) Array de strings ["name", "code", ...]
        // 3) Objeto chave->label { name: "Nome", code: "Código" }
        if (columns) {
          let normalized: { key: string; label: string }[] = [];
          if (Array.isArray(columns)) {
            if (columns.length && typeof columns[0] === "string") {
              normalized = (columns as unknown as string[]).map((c) => ({
                key: c,
                label: resolveColumnLabel(c),
              }));
            } else {
              normalized = (columns as { key: string; label: string }[]).map(
                (c) => ({
                  key: c.key,
                  label: resolveColumnLabel(c.key, c.label),
                })
              );
            }
          } else if (typeof columns === "object") {
            normalized = Object.entries(columns as Record<string, string>).map(
              ([k, v]) => ({ key: k, label: resolveColumnLabel(k, v) })
            );
          }
          if (normalized.length) {
            setDynamicColumns(normalized);
          }
        }
        // Fallback: se API não trouxe colunas, derivar do primeiro item (exceto campos internos)
        if ((!columns || dynamicColumns.length === 0) && data && data.length) {
          const keys = Object.keys(data[0]).filter(
            (k) => !["id", "deleted_at"].includes(k)
          );
          setDynamicColumns(
            keys.map((k) => ({ key: k, label: resolveColumnLabel(k) }))
          );
        }
      } catch (error) {
        toast.error("Erro ao carregar empresas");
        console.error("Erro ao buscar empresas:", error);
      }
    },
    // dynamicColumns.length usado apenas para fallback; evita loop incluindo o array completo
    [itemsPerPage, sortKey, sortDirection, dynamicColumns.length, statusFilter]
  );

  useEffect(() => {
    fetchBusinesses(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchBusinesses]);

  // Restaura preferências salvas (sort e ordem) ao montar
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        order?: string[];
        sort_by?: string;
        order_dir?: "asc" | "desc";
      };
      if (saved.sort_by) setSortKey(saved.sort_by);
      if (saved.order_dir) setSortDirection(saved.order_dir);
      // Ordem aplicada depois que colunas forem carregadas
      if (saved.order && saved.order.length) {
        // guardamos ordem para aplicar posteriormente
        setDynamicColumns((prev) => {
          if (!prev.length) return prev; // vai aplicar em efeito posterior quando prev tiver dados
          const map = new Map(prev.map((c) => [c.key, c] as const));
          const reordered: { key: string; label: string }[] = [];
          saved.order!.forEach((k) => {
            const c = map.get(k);
            if (c) reordered.push(c);
          });
          // adiciona novas colunas não presentes
          prev.forEach((c) => {
            if (!reordered.find((r) => r.key === c.key)) reordered.push(c);
          });
          return reordered;
        });
      }
    } catch {}
  }, []);

  // Aplica ordem salva assim que dynamicColumns for populado inicialmente
  useEffect(() => {
    try {
      if (typeof window === "undefined" || !dynamicColumns.length) return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { order?: string[] };
      if (saved.order && saved.order.length) {
        const map = new Map(dynamicColumns.map((c) => [c.key, c] as const));
        const reordered: { key: string; label: string }[] = [];
        saved.order.forEach((k) => {
          const c = map.get(k);
          if (c) reordered.push(c);
        });
        dynamicColumns.forEach((c) => {
          if (!reordered.find((r) => r.key === c.key)) reordered.push(c);
        });
        if (reordered.length) setDynamicColumns(reordered);
      }
    } catch {}
  }, [dynamicColumns]);

  const persistPrefs = (
    cols = dynamicColumns,
    sKey = sortKey,
    dir = sortDirection
  ) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          order: cols.map((c) => c.key),
          sort_by: sKey,
          order_dir: dir,
        })
      );
    } catch {}
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset para primeira página ao buscar
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset para primeira página ao filtrar
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

  // Monta colunas dinamicamente (exceto ações)
  const columns = [
    ...dynamicColumns.map((col) => {
      if (col.key === "created_at") {
        return {
          header: col.label,
          key: col.key,
          sortable: true,
          render: (_: unknown, item: Empresa) => (
            <div className="text-sm text-gray-900 dark:text-white">
              {formatDateToBrazilian(item.created_at)}
            </div>
          ),
        };
      }
      if (col.key === "updated_at") {
        return {
          header: col.label,
          key: col.key,
          sortable: true,
          render: (_: unknown, item: Empresa) => (
            <div className="text-sm text-gray-900 dark:text-white">
              {formatDateToBrazilian(item.updated_at)}
            </div>
          ),
        };
      }
      if (col.key === "disabled") {
        return {
          header: col.label,
          key: col.key,
          sortable: true,
          render: (_: unknown, item: Empresa) => (
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
        };
      }
      if (col.key === "phone") {
        return {
          header: col.label,
          key: col.key,
          sortable: true,
          render: (_: unknown, item: Empresa) => (
            <div className="text-sm text-gray-900 dark:text-white">
              {formatPhone(item.phone)}
            </div>
          ),
        };
      }
      if (col.key === "cnpj") {
        return {
          header: col.label,
          key: col.key,
          sortable: true,
          render: (_: unknown, item: Empresa) => (
            <div className="text-sm text-gray-900 dark:text-white font-mono">
              {formatCNPJ(item.cnpj)}
            </div>
          ),
        };
      }
      if (col.key === "name") {
        return {
          header: col.label,
          key: col.key,
          sortable: true,
          render: (_: unknown, item: Empresa) => (
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
        };
      }
      if (col.key === "notes") {
        return {
          header: col.label,
          key: col.key,
          sortable: true,
          render: (_: unknown, item: Empresa) => {
            const text = (item.notes ?? "").trim();
            const max = 60;
            const truncated =
              text.length > max ? text.slice(0, max) + "…" : text;
            return (
              <span
                title={text}
                className="text-sm text-gray-900 dark:text-white inline-block max-w-[240px] truncate align-top"
              >
                {truncated}
              </span>
            );
          },
        };
      }
      // Default genérico
      return {
        header: col.label,
        key: col.key,
        sortable: true,
      };
    }),
    {
      header: "Ações",
      key: "actions",
      sortable: false,
      render: (_: unknown, item: Empresa) => (
        <div className="text-sm font-medium space-x-4 flex items-center">
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            onClick={() => handleEditEmpresa(item)}
            title="Editar"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            onClick={() => handleChangeStatus(item)}
            title="Alterar Status"
          >
            <StatusIcon className="h-4 w-4" />
          </button>
          <button
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={() => handleDeleteEmpresa(item)}
            title="Excluir"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleSortChange = (key: string) => {
    if (sortKey === key) {
      // alterna direção
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      persistPrefs(
        dynamicColumns,
        key,
        sortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
      persistPrefs(dynamicColumns, key, "asc");
    }
    setCurrentPage(1);
  };

  const handleColumnOrderChange = (newOrderKeys: string[]) => {
    const map = new Map(dynamicColumns.map((c) => [c.key, c] as const));
    const reordered: { key: string; label: string }[] = [];
    newOrderKeys.forEach((k) => {
      const c = map.get(k);
      if (c) reordered.push(c);
    });
    // adiciona colunas novas que não estavam salvas
    dynamicColumns.forEach((c) => {
      if (!reordered.find((r) => r.key === c.key)) reordered.push(c);
    });
    setDynamicColumns(reordered);
    persistPrefs(reordered);
  };

  const handleNovaEmpresa = () => {
    router.push("/dashboard/businesses/new");
  };

  const [isReloading, setIsReloading] = useState(false);
  const handleManualReload = async () => {
    try {
      setIsReloading(true);
      await fetchBusinesses(currentPage, searchTerm, true);
    } catch {
      toast.error("Falha ao recarregar.");
    } finally {
      setIsReloading(false);
    }
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
        <div className="flex justify-end mb-3">
          <button
            onClick={handleManualReload}
            disabled={isReloading}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReloading ? "Recarregando..." : "Recarregar"}
          </button>
        </div>
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
          pageSizeOptions={[10, 20, 50, 100]}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1); // reset para primeira página ao mudar tamanho
          }}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          reorderable
          onColumnOrderChange={handleColumnOrderChange}
          showStatusFilter={true}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
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
