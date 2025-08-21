"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CheckIcon,
  XMarkIcon,
} from "@/components/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NovaEmpresaForm {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  funcionarios: number;
  status: string;
}

export default function NovaEmpresaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<NovaEmpresaForm>({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    funcionarios: 0,
    status: "Ativa",
  });

  const handleInputChange = (
    field: keyof NovaEmpresaForm,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular chamada para API
      console.log("Criando empresa:", form);

      // Aguardar um pouco para simular a requisição
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirecionar para a página de empresas
      router.push("/dashboard/empresas");
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/empresas");
  };

  return (
    <DashboardLayout
      currentPage="empresas"
      title="Nova Empresa"
      subtitle="Cadastre uma nova empresa no sistema"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar para Empresas
            </button>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                form="empresa-form"
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {isLoading ? "Salvando..." : "Criar Empresa"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar com preview da empresa */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  <BuildingOfficeIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {form.nome || "Nova Empresa"}
                </h3>

                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {form.status}
                </span>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Funcionários:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {form.funcionarios || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium text-xs">
                      {form.email || "Não informado"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Cidade:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {form.cidade || "Não informada"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário principal */}
          <div className="lg:col-span-2">
            <form
              id="empresa-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Informações Básicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nome}
                      onChange={(e) =>
                        handleInputChange("nome", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Digite o nome da empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="contato@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={(e) =>
                        handleInputChange("telefone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={form.cnpj}
                      onChange={(e) =>
                        handleInputChange("cnpj", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número de Funcionários
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.funcionarios}
                      onChange={(e) =>
                        handleInputChange(
                          "funcionarios",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Ativa">Ativa</option>
                      <option value="Inativa">Inativa</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Endereço
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={form.endereco}
                      onChange={(e) =>
                        handleInputChange("endereco", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={form.cidade}
                      onChange={(e) =>
                        handleInputChange("cidade", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={form.estado}
                      onChange={(e) =>
                        handleInputChange("estado", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="SP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={form.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="00000-000"
                    />
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
