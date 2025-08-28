"use client";

import { ArrowLeftIcon, CheckIcon, CopyIcon } from "@/components/icons";
import Modal from "@/components/ui/Modal";
import axios from "@/config/axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface Address {
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

export interface BusinessDetails {
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
  addresses: Address[];
  notes: string | null;
}

interface StepDefinition {
  key: string;
  title: string;
  description?: string;
  Component: React.FC<{
    business: BusinessDetails;
    onChange: (field: keyof BusinessDetails, value: string | boolean) => void;
    onAddressChange: (
      idx: number,
      field: keyof Address,
      value: string | boolean
    ) => void;
    addAddress: () => void;
    removeAddress: (idx: number) => void;
  }>;
  getPayload: (business: BusinessDetails) => Record<string, unknown>;
}

export interface BusinessWizardProps {
  mode: "edit" | "create";
  businessId?: string; // necessário para modo edit
  onFinished?: () => void; // callback após sucesso final
}

const buildEmptyBusiness = (): BusinessDetails => ({
  id: "",
  code: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  disabled: false,
  name: "",
  responsible: null,
  email: null,
  phone: null,
  cnpj: null,
  addresses: [
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
  notes: null,
});

export default function BusinessWizard({
  mode,
  businessId,
  onFinished,
}: BusinessWizardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [business, setBusiness] = useState<BusinessDetails | null>(
    mode === "edit" ? null : buildEmptyBusiness()
  );
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSavedPayloads, setLastSavedPayloads] = useState<
    Record<string, string>
  >({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Steps components
  const BasicStep: StepDefinition["Component"] = useCallback(
    ({ business, onChange }) => (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Nome da Empresa
          </label>
          <input
            value={business.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={business.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={business.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              CNPJ
            </label>
            <input
              value={business.cnpj || ""}
              onChange={(e) => onChange("cnpj", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Responsável
            </label>
            <input
              value={business.responsible || ""}
              onChange={(e) => onChange("responsible", e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Observações
          </label>
          <textarea
            value={business.notes || ""}
            onChange={(e) => onChange("notes", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Anotações internas..."
          />
        </div>
      </div>
    ),
    []
  );

  const AddressesStep: StepDefinition["Component"] = useCallback(
    ({ business, onAddressChange, addAddress, removeAddress }) => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Endereços
          </h4>
          <button
            type="button"
            onClick={addAddress}
            className="text-xs px-2 py-1 rounded border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            + Adicionar
          </button>
        </div>
        {business.addresses.map((a, idx) => (
          <div
            key={a.id || idx}
            className="p-3 rounded border border-gray-200 dark:border-gray-600 space-y-3 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Endereço #{idx + 1}
              </span>
              {business.addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddress(idx)}
                  className="text-red-500 text-[11px] hover:underline"
                >
                  Remover
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                placeholder="Nome"
                value={a.name}
                onChange={(e) => onAddressChange(idx, "name", e.target.value)}
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                placeholder="Código"
                value={a.code}
                onChange={(e) => onAddressChange(idx, "code", e.target.value)}
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                placeholder="CEP"
                value={a.zip_code}
                onChange={(e) =>
                  onAddressChange(idx, "zip_code", e.target.value)
                }
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                placeholder="Endereço"
                value={a.address}
                onChange={(e) =>
                  onAddressChange(idx, "address", e.target.value)
                }
                className="px-2 py-1.5 text-sm rounded border col-span-2 md:col-span-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                placeholder="Número"
                value={a.number}
                onChange={(e) => onAddressChange(idx, "number", e.target.value)}
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                placeholder="Compl."
                value={a.complement}
                onChange={(e) =>
                  onAddressChange(idx, "complement", e.target.value)
                }
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                placeholder="Bairro"
                value={a.neighborhood}
                onChange={(e) =>
                  onAddressChange(idx, "neighborhood", e.target.value)
                }
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                placeholder="Cidade"
                value={a.city}
                onChange={(e) => onAddressChange(idx, "city", e.target.value)}
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                placeholder="Estado"
                value={a.state}
                onChange={(e) => onAddressChange(idx, "state", e.target.value)}
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                placeholder="País"
                value={a.country}
                onChange={(e) =>
                  onAddressChange(idx, "country", e.target.value)
                }
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <select
                value={a.disabled ? "Inativo" : "Ativo"}
                onChange={(e) =>
                  onAddressChange(idx, "disabled", e.target.value === "Inativo")
                }
                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    ),
    []
  );

  const steps: StepDefinition[] = useMemo(
    () => [
      {
        key: "basic",
        title: "Dados Básicos",
        description: "Identificação, contato e notas",
        Component: BasicStep,
        getPayload: (b) => ({
          id: b.id,
          code: b.code,
          created_at: b.created_at,
          updated_at: b.updated_at,
          deleted: !!b.deleted_at,
          disabled: b.disabled,
          name: b.name,
          responsible: b.responsible,
          email: b.email,
          phone: b.phone,
          cnpj: b.cnpj,
          notes: b.notes,
          addresses: b.addresses,
        }),
      },
      {
        key: "addresses",
        title: "Endereços",
        description: "Locais de operação",
        Component: AddressesStep,
        getPayload: (b) => ({
          business_code: b.code,
          addresses: b.addresses.map((a: Address) => {
            const { id, ...rest } = a;
            return id ? { id, ...rest } : { ...rest };
          }),
        }),
      },
    ],
    [BasicStep, AddressesStep]
  );

  // Carrega dados se modo edição
  useEffect(() => {
    if (mode === "edit" && businessId) {
      setError(null);
      setIsLoading(true);
      axios
        .get(`/business?id=${businessId}`)
        .then((res) => {
          const data = res.data;
          const normalized: BusinessDetails = {
            ...data,
            addresses: Array.isArray(data.addresses)
              ? data.addresses.map((ad: Address) => ({
                  id: ad.id || "",
                  code: ad.code || "",
                  name: ad.name || "",
                  address: ad.address || "",
                  number: ad.number || "",
                  complement: ad.complement || "",
                  neighborhood: ad.neighborhood || "",
                  city: ad.city || "",
                  state: ad.state || "",
                  country: ad.country || "",
                  zip_code: ad.zip_code || "",
                  disabled: ad.disabled || false,
                }))
              : [],
          };
          setBusiness(normalized);
          // baseline
          const map: Record<string, string> = {};
          steps.forEach((s) => {
            try {
              map[s.key] = JSON.stringify(s.getPayload(normalized));
            } catch {}
          });
          setLastSavedPayloads(map);
        })
        .catch(() => setError("Falha ao carregar empresa."))
        .finally(() => setIsLoading(false));
    }
  }, [mode, businessId, steps]);

  const handleFieldChange = (
    field: keyof BusinessDetails,
    value: string | boolean
  ) => {
    if (!business) return;
    setBusiness((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleAddressChange = (
    idx: number,
    field: keyof Address,
    value: string | boolean
  ) => {
    if (!business) return;
    setBusiness((prev) => {
      if (!prev) return null;
      const addresses = prev.addresses.map((a, i) =>
        i === idx ? { ...a, [field]: value } : a
      );
      return { ...prev, addresses };
    });
  };

  const addAddress = () => {
    if (!business) return;
    setBusiness((prev) =>
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

  const removeAddress = (idx: number) => {
    if (!business) return;
    setBusiness((prev) =>
      prev
        ? { ...prev, addresses: prev.addresses.filter((_, i) => i !== idx) }
        : null
    );
  };

  const saveCurrentStep = async () => {
    if (!business) return false;
    const step = steps[currentStep];
    const payload = step.getPayload(business);
    const payloadStr = JSON.stringify(payload);
    if (lastSavedPayloads[step.key] === payloadStr) return true;
    setIsSavingStep(true);
    setError(null);
    try {
      if (step.key === "basic") {
        if (mode === "create" && !business.id) {
          // Assumindo criação via POST /business retornando objeto completo
          const res = await axios.post("/business", payload);
          const created = res.data;
          setBusiness((prev) => (prev ? { ...prev, ...created } : prev));
        } else {
          await axios.put("/business", payload);
        }
      } else if (step.key === "addresses") {
        if (!business.code) return true; // sem código ainda, ignora
        await axios.put("/business-address", payload);
      }
      setLastSavedPayloads((prev) => ({ ...prev, [step.key]: payloadStr }));
      return true;
    } catch {
      setError(`Falha ao salvar passo "${step.title}"`);
      return false;
    } finally {
      setIsSavingStep(false);
    }
  };

  const nextStep = async () => {
    const ok = await saveCurrentStep();
    if (!ok) return;
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => currentStep > 0 && setCurrentStep((s) => s - 1);

  const finalize = async () => {
    const ok = await saveCurrentStep();
    if (ok) setShowSuccess(true);
  };

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false);
    onFinished?.();
  }, [onFinished]);

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => handleSuccessClose(), 1500);
      return () => clearTimeout(t);
    }
  }, [showSuccess, handleSuccessClose]);

  const Stepper = () => (
    <div className="w-full">
      <ol className="flex items-center w-full gap-2">
        {steps.map((s, idx) => {
          const active = idx === currentStep;
          const done = idx < currentStep;
          return (
            <li key={s.key} className="flex-1">
              <button
                type="button"
                onClick={() => idx < currentStep && setCurrentStep(idx)}
                className={`w-full flex flex-col items-center px-2 py-2 rounded border text-xs transition-colors ${
                  active
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                    : done
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600"
                    : "border-gray-300 dark:border-gray-600 text-gray-500"
                }`}
              >
                <span className="flex items-center gap-1 font-medium">
                  {done ? <CheckIcon className="w-3 h-3" /> : idx + 1} {s.title}
                </span>
                {s.description && (
                  <span className="mt-1 text-[10px] opacity-75 truncate w-full text-center">
                    {s.description}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-4 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard/businesses")}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Voltar
        </button>
        {business && business.code && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(business.code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <CopyIcon className="w-3.5 h-3.5" />{" "}
            {copied ? "Copiado" : business.code}
          </button>
        )}
      </div>
      <Stepper />
      {error && (
        <div className="text-sm text-red-600 bg-red-100/60 dark:bg-red-900/30 border border-red-300 dark:border-red-700 px-3 py-2 rounded">
          {error}
        </div>
      )}
      {isLoading || !business ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-200">
              {steps[currentStep].title}
            </h2>
            {(() => {
              const StepComponent = steps[currentStep].Component;
              return (
                <StepComponent
                  business={business}
                  onChange={handleFieldChange}
                  onAddressChange={handleAddressChange}
                  addAddress={addAddress}
                  removeAddress={removeAddress}
                />
              );
            })()}
          </div>
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || isSavingStep}
              className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40"
            >
              Voltar
            </button>
            <button
              onClick={currentStep === steps.length - 1 ? finalize : nextStep}
              disabled={isSavingStep}
              className="px-5 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 flex items-center gap-2"
            >
              {isSavingStep && (
                <span className="inline-block h-4 w-4 border-2 border-white/60 border-b-transparent rounded-full animate-spin" />
              )}
              {currentStep === steps.length - 1
                ? mode === "create"
                  ? "Criar"
                  : "Finalizar"
                : "Próximo"}
            </button>
          </div>
        </div>
      )}
      <Modal isOpen={showSuccess} onClose={handleSuccessClose} title="Sucesso">
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            {mode === "create"
              ? "Empresa criada com sucesso."
              : "Dados salvos com sucesso."}
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleSuccessClose}
              className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
