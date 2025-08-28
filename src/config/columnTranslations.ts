// Mapeamento de traduções de chaves de colunas -> rótulos exibidos
// Adicione novas entradas conforme necessário.
export const COLUMN_TRANSLATIONS: Record<string, string> = {
  name: "Nome",
  code: "Código",
  created_at: "Criado em",
  updated_at: "Atualizado em",
  disabled: "Status",
  notes: "Notas",
};

/**
 * Retorna a tradução da coluna, ou undefined se não existir.
 */
export function getColumnTranslation(key: string): string | undefined {
  return COLUMN_TRANSLATIONS[key];
}

/**
 * Gera um label humanizado caso não haja tradução explícita.
 */
export function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/**
 * Função utilitária que prioriza a tradução e cai para backendLabel > humanize.
 */
export function resolveColumnLabel(key: string, backendLabel?: string): string {
  return getColumnTranslation(key) || backendLabel || humanizeKey(key);
}
