"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from "@/components/icons";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EmpresaDetalhes {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  status: string;
  funcionarios: number;
  dataFundacao: string;
  responsavel: string;
  observacoes: string;
}

export default function EmpresaDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const empresaId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [empresa, setEmpresa] = useState<EmpresaDetalhes | null>(null);

  // Simular carregamento dos dados da empresa
  useEffect(() => {
    const mockEmpresa: EmpresaDetalhes = {
      id: parseInt(empresaId) || 1,
      nome: "Tech Solutions Ltd.",
      email: "contato@techsolutions.com",
      telefone: "(11) 99999-9999",
      cnpj: "12.345.678/0001-90",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      status: "Ativa",
      funcionarios: 45,
      dataFundacao: "2015-03-15",
      responsavel: "João Silva",
      observacoes:
        "Empresa focada em desenvolvimento de software e soluções tecnológicas.",
    };

    setEmpresa(mockEmpresa);
  }, [empresaId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular salvamento
      console.log("Salvando empresa:", empresa);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof EmpresaDetalhes,
    value: string | number
  ) => {
    if (!empresa) return;
    setEmpresa((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Inativa":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Suspensa":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (!empresa) {
    return (
      <DashboardLayout
        currentPage="empresas"
        title="Carregando..."
        subtitle="Carregando detalhes da empresa"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      currentPage="empresas"
      title={empresa.nome}
      subtitle="Detalhes da empresa"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard/empresas")}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar para Empresas
            </button>

            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {isLoading ? "Salvando..." : "Salvar"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Editar Empresa
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar com informações principais */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  <BuildingOfficeIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {empresa.nome}
                </h3>

                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    empresa.status
                  )}`}
                >
                  {empresa.status}
                </span>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Funcionários:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {empresa.funcionarios}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Fundação:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {new Date(empresa.dataFundacao).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Responsável:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {empresa.responsavel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Informações de Contato */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Informações de Contato
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome da Empresa
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={empresa.nome}
                        onChange={(e) =>
                          handleInputChange("nome", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {empresa.nome}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={empresa.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {empresa.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={empresa.telefone}
                        onChange={(e) =>
                          handleInputChange("telefone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {empresa.telefone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CNPJ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={empresa.cnpj}
                        onChange={(e) =>
                          handleInputChange("cnpj", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {empresa.cnpj}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Endereço
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Endereço
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={empresa.endereco}
                        onChange={(e) =>
                          handleInputChange("endereco", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {empresa.endereco}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cidade
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={empresa.cidade}
                        onChange={(e) =>
                          handleInputChange("cidade", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {empresa.cidade}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={empresa.estado}
                        onChange={(e) =>
                          handleInputChange("estado", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {empresa.estado}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CEP
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={empresa.cep}
                        onChange={(e) =>
                          handleInputChange("cep", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {empresa.cep}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={empresa.status}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                      >
                        <option value="Ativa">Ativa</option>
                        <option value="Inativa">Inativa</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Suspensa">Suspensa</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          empresa.status
                        )}`}
                      >
                        {empresa.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Informações Adicionais
                </h4>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Observações
                    </label>
                    {isEditing ? (
                      <textarea
                        value={empresa.observacoes}
                        onChange={(e) =>
                          handleInputChange("observacoes", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none cursor-text"
                        placeholder="Adicione observações sobre a empresa..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2 whitespace-pre-wrap">
                        {empresa.observacoes ||
                          "Nenhuma observação cadastrada."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
