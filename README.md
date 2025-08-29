This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Funções Utilitárias

### Formatadores (`src/utils/formatters.ts`)

O projeto inclui funções utilitárias para formatação de dados brasileiros:

```typescript
import {
  formatPhone,
  formatCNPJ,
  formatCPF,
  formatCEP,
  formatDateToBrazilian,
  formatCurrency,
  formatNumber,
} from "@/utils/formatters";

// Exemplos de uso:
const phone = formatPhone("11999999999"); // (11) 99999-9999
const cnpj = formatCNPJ("11111111000111"); // 11.111.111/0001-11
const cpf = formatCPF("11111111111"); // 111.111.111-11
const cep = formatCEP("12345678"); // 12345-678
const date = formatDateToBrazilian("2024-01-01"); // 01/01/2024 00:00
const currency = formatCurrency(1234.56); // R$ 1.234,56
const number = formatNumber(1234567); // 1.234.567
```

Todas as funções são seguras e retornam o valor original caso não consigam formatar.

## Funcionalidades do Step de Endereço

### Preenchimento Automático via CEP

O sistema agora utiliza a API do ViaCEP para preencher automaticamente os dados de endereço quando um CEP válido é digitado:

1. **Validação de CEP**: O sistema valida se o CEP possui 8 dígitos
2. **Busca Automática**: Quando um CEP válido é digitado e o campo perde o foco (onBlur), o sistema consulta a API do ViaCEP
3. **Preenchimento Automático**: Os seguintes campos são preenchidos automaticamente:
   - Endereço (logradouro)
   - Bairro
   - Cidade
   - Estado
   - País (definido como "Brasil")

### Bloqueio de Campos

Os campos de endereço (exceto CEP e Nome) são bloqueados até que um CEP válido seja digitado:

- **Campos bloqueados**: Endereço, Número, Complemento, Bairro, Cidade, Estado, País
- **Campos sempre habilitados**: CEP e Nome do endereço
- **Indicação visual**: Campos bloqueados ficam com fundo acinzentado e cursor "not-allowed"

### Novas Funções Utilitárias

Foram adicionadas as seguintes funções ao arquivo `src/utils/formatters.ts`:

```typescript
// Valida se um CEP é válido (8 dígitos)
export const isValidCEP = (cep: string): boolean

// Busca dados de endereço via CEP usando a API do ViaCEP
export const fetchAddressByCEP = async (cep: string): Promise<AddressData | null>
```

### Comportamento

1. **Ao carregar uma empresa existente**: Se já houver CEPs válidos preenchidos, os campos de endereço correspondentes ficam habilitados
2. **Durante a digitação**: Apenas o CEP pode ser editado inicialmente
3. **Após validação do CEP**: Todos os campos do endereço ficam habilitados e os dados são preenchidos automaticamente
4. **CEP inválido**: Os campos permanecem bloqueados e os dados não são preenchidos

### Integração com API

- Os dados são enviados para a API com CEP sanitizado (apenas números)
- A formatação visual é mantida durante a digitação
- O preenchimento automático não sobrescreve dados já existentes nos campos
