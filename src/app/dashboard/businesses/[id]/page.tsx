"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from "@/components/icons";
import axios from "@/config/axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Endereco {
  id: string;
  code: string;
  name: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  disabled: boolean;
}

interface EmpresaDetalhes {
  id: string;
  code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  disabled: boolean;
  name: string;
  responsible: string | null;
  email: string | null;
  phone: string | null;
  cnpj: string | null;
  addresses: Endereco[];
  notes: string | null;
}

export default function EmpresaDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const empresaId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [empresa, setEmpresa] = useState<EmpresaDetalhes | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setErro(null);
    setEmpresa(null);
    if (!empresaId) return;
    setIsLoading(true);
    axios
      .get(`/business?id=${empresaId}`)
      .then((res) => {
        // Adaptar para múltiplos endereços com novos campos
        const data = res.data;
        setEmpresa({
          ...data,
          addresses: Array.isArray(data.addresses)
            ? data.addresses.map((end: Endereco) => ({
                id: end.id || "",
                code: end.code || "",
                name: end.name || "",
                address: end.address || "",
                number: end.number || "",
                complement: end.complement || "",
                neighborhood: end.neighborhood || "",
                city: end.city || "",
                state: end.state || "",
                country: end.country || "",
                zip_code: end.zip_code || "",
                disabled: end.disabled || false,
              }))
            : [],
        });
      })
      .catch(() => setErro("Erro ao carregar empresa."))
      .finally(() => setIsLoading(false));
  }, [empresaId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEditing(false);
    } catch {
      setErro("Erro ao salvar empresa.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof EmpresaDetalhes,
    value: string | boolean
  ) => {
    if (!empresa) return;
    setEmpresa((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleEnderecoChange = (
    idx: number,
    field: keyof Endereco,
    value: string | boolean
  ) => {
    if (!empresa) return;
    setEmpresa((prev) => {
      if (!prev) return null;
      const addresses = prev.addresses.map((end, i) =>
        i === idx ? { ...end, [field]: value } : end
      );
      return { ...prev, addresses };
    });
  };

  const handleAddEndereco = () => {
    if (!empresa) return;
    setEmpresa((prev) =>
      prev
        ? {
            ...prev,
            addresses: [
              ...prev.addresses,
              {
                id: "",
                code: "",
                name: "",
                address: "",
                number: "",
                complement: "",
                neighborhood: "",
                city: "",
                state: "",
                country: "",
                zip_code: "",
                disabled: false,
              },
            ],
          }
        : null
    );
  };

  const handleRemoveEndereco = (idx: number) => {
    if (!empresa) return;
    setEmpresa((prev) =>
      prev
        ? {
            ...prev,
            addresses: prev.addresses.filter((_, i) => i !== idx),
          }
        : null
    );
  };

  // Cores para status (usando disabled)
  const getStatusColor = (disabled: boolean) => {
    return disabled
      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  };

  return (
    <ProtectedRoute>
      <DashboardLayout
        currentPage="businesses"
        title={empresa ? empresa.name : "Empresa"}
        subtitle="Detalhes da empresa"
      >
        <div className="flex flex-col min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-0">
          <div className="flex-1 flex flex-col w-full h-full">
            {/* Header Navigation */}
            <div className="mb-6 pt-4 px-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <button
                  onClick={() => router.push("/dashboard/businesses")}
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

            {erro && (
              <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 mb-4 mx-4">
                {erro}
              </div>
            )}

            {isLoading || !empresa ? (
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8 flex-1 w-full px-4 pb-8">
                {/* Sidebar com informações principais */}
                <div className="w-full lg:w-1/3 min-w-[320px] max-w-lg mx-auto lg:mx-0">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center h-full">
                    <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-6 shadow-md">
                      <BuildingOfficeIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                      {empresa.name}
                    </h3>
                    <span
                      className={`inline-flex px-4 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        empresa.disabled
                      )}`}
                    >
                      {empresa.disabled ? "Inativa" : "Ativa"}
                    </span>
                    <div className="mt-8 space-y-4 w-full">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Código:
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {empresa.code}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          CNPJ:
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {empresa.cnpj}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Responsável:
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {empresa.responsible}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Criada em:
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {new Date(empresa.created_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulário principal */}
                <div className="w-full lg:w-2/3 flex-1">
                  <form
                    onSubmit={handleSave}
                    className="space-y-8 h-full flex flex-col justify-between"
                  >
                    {/* Informações de Contato */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
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
                              value={empresa.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white py-2">
                              {empresa.name}
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
                              value={empresa.email || ""}
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
                              value={empresa.phone || ""}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white py-2">
                              {empresa.phone}
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
                              value={empresa.cnpj || ""}
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
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          Endereços
                        </h4>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={handleAddEndereco}
                            className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
                          >
                            + Adicionar Endereço
                          </button>
                        )}
                      </div>
                      <div className="space-y-8">
                        {empresa.addresses.map((end, idx) => (
                          <div
                            key={end.id || idx}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0"
                          >
                            <div className="md:col-span-2 flex items-center justify-between">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Endereço #{idx + 1}{" "}
                                {end.name && `- ${end.name}`}
                              </label>
                              {isEditing && empresa.addresses.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEndereco(idx)}
                                  className="text-red-500 hover:underline text-xs"
                                >
                                  Remover
                                </button>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome do Local
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={end.name}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.name}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Código do Endereço
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={end.code}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "code",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.code}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Endereço
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={end.address}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "address",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.address}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Número
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={end.number}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "number",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.number}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Complemento
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={end.complement}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "complement",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.complement}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bairro
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={end.neighborhood}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "neighborhood",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.neighborhood}
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
                                  value={end.city}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "city",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.city}
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
                                  value={end.state}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "state",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.state}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                País
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={end.country}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "country",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.country}
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
                                  value={end.zip_code}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "zip_code",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-text"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-white py-2">
                                  {end.zip_code}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                              </label>
                              {isEditing ? (
                                <select
                                  value={end.disabled ? "Inativo" : "Ativo"}
                                  onChange={(e) =>
                                    handleEnderecoChange(
                                      idx,
                                      "disabled",
                                      e.target.value === "Inativo"
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                                >
                                  <option value="Ativo">Ativo</option>
                                  <option value="Inativo">Inativo</option>
                                </select>
                              ) : (
                                <span
                                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                                    end.disabled
                                  )}`}
                                >
                                  {end.disabled ? "Inativo" : "Ativo"}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Observações
                      </h4>
                      <div>
                        {isEditing ? (
                          <textarea
                            value={empresa.notes || ""}
                            onChange={(e) =>
                              handleInputChange("notes", e.target.value)
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none cursor-text"
                            placeholder="Adicione observações sobre a empresa..."
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white py-2 whitespace-pre-wrap">
                            {empresa.notes || "Nenhuma observação cadastrada."}
                          </p>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
