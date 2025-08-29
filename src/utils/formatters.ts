/**
 * Utilitários de formatação para dados
 */

/**
 * Formata um número de telefone brasileiro
 * @param phone - Número de telefone (com ou sem formatação)
 * @returns Telefone formatado ou valor original se não conseguir formatar
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    // Celular: (11) 99999-9999
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    // Fixo: (11) 9999-9999
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone; // Retorna original se não conseguir formatar
};

/**
 * Formata um CNPJ brasileiro
 * @param cnpj - CNPJ (com ou sem formatação)
 * @returns CNPJ formatado ou valor original se não conseguir formatar
 */
export const formatCNPJ = (cnpj: string): string => {
  if (!cnpj) return "";
  const cleaned = cnpj.replace(/\D/g, "");

  if (cleaned.length === 14) {
    // CNPJ: 11.111.111/0001-11
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return cnpj; // Retorna original se não conseguir formatar
};

/**
 * Formata um CPF brasileiro
 * @param cpf - CPF (com ou sem formatação)
 * @returns CPF formatado ou valor original se não conseguir formatar
 */
export const formatCPF = (cpf: string): string => {
  if (!cpf) return "";
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length === 11) {
    // CPF: 111.111.111-11
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return cpf; // Retorna original se não conseguir formatar
};

/**
 * Formata um CEP brasileiro
 * @param cep - CEP (com ou sem formatação)
 * @returns CEP formatado ou valor original se não conseguir formatar
 */
export const formatCEP = (cep: string): string => {
  if (!cep) return "";
  const cleaned = cep.replace(/\D/g, "");

  if (cleaned.length === 8) {
    // CEP: 12345-678
    return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
  }
  return cep; // Retorna original se não conseguir formatar
};

/**
 * Formata uma data para o padrão brasileiro
 * @param dateString - String de data ISO ou similar
 * @returns Data formatada no padrão brasileiro
 */
export const formatDateToBrazilian = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formata um valor monetário para Real brasileiro
 * @param value - Valor numérico
 * @returns Valor formatado em R$
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Formata um número com separadores de milhares
 * @param value - Valor numérico
 * @returns Número formatado com separadores
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

/**
 * Remove caracteres especiais deixando apenas números
 * @param value - Valor com ou sem formatação
 * @returns String contendo apenas números
 */
export const sanitizePhoneForAPI = (value: string): string => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};

/**
 * Remove caracteres especiais do CNPJ deixando apenas números
 * @param value - CNPJ com ou sem formatação
 * @returns String contendo apenas números
 */
export const sanitizeCNPJForAPI = (value: string): string => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};

/**
 * Remove caracteres especiais do CPF deixando apenas números
 * @param value - CPF com ou sem formatação
 * @returns String contendo apenas números
 */
export const sanitizeCPFForAPI = (value: string): string => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};

/**
 * Remove caracteres especiais do CEP deixando apenas números
 * @param value - CEP com ou sem formatação
 * @returns String contendo apenas números
 */
export const sanitizeCEPForAPI = (value: string): string => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};

/**
 * Valida se um CEP é válido (8 dígitos)
 * @param cep - CEP com ou sem formatação
 * @returns Boolean indicando se o CEP é válido
 */
export const isValidCEP = (cep: string): boolean => {
  if (!cep) return false;
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.length === 8;
};

/**
 * Busca dados de endereço via CEP usando a API do ViaCEP
 * @param cep - CEP com ou sem formatação
 * @returns Promise com os dados do endereço ou null em caso de erro
 */
export const fetchAddressByCEP = async (
  cep: string
): Promise<{
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
} | null> => {
  const cleanCEP = sanitizeCEPForAPI(cep);

  if (!isValidCEP(cleanCEP)) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};
