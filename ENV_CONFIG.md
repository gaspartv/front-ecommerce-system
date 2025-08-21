# 🌐 Configuração de Variáveis de Ambiente

## 📋 Arquivos Criados

### ✅ `.env.local`

Arquivo principal com as configurações de desenvolvimento (não commitado):

```bash
# Configurações da API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Configurações de desenvolvimento
NODE_ENV=development
```

### ✅ `.env.example`

Arquivo template para outros desenvolvedores:

```bash
# Copie este arquivo para .env.local e configure as variáveis

# URL base da API do backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Ambiente de desenvolvimento
NODE_ENV=development
```

## 🔧 Alterações Implementadas

### **1. Configuração do Axios** (`src/config/axios.ts`)

```typescript
// Base URL da API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Configuração base do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  // ...outras configurações
});
```

### **2. Interceptor de Refresh Token**

```typescript
// Usa a mesma constante para requisições de refresh
const response = await axios.post(`${API_BASE_URL}/refresh`, {
  refreshToken,
});
```

## 📁 Estrutura de Arquivos Atualizada

```
projeto/
├── .env.example          # Template de variáveis de ambiente
├── .env.local            # Configurações locais (git ignored)
├── .gitignore            # Já configurado para ignorar .env*
├── src/
│   └── config/
│       └── axios.ts      # Configuração usando env vars
└── ...
```

## 🎯 Benefícios da Implementação

### **1. Flexibilidade de Ambiente**

- ✅ Fácil mudança entre dev/staging/production
- ✅ URL do backend configurável por ambiente
- ✅ Não há mais URLs hardcoded no código

### **2. Segurança**

- ✅ Variáveis sensíveis não commitadas
- ✅ Template `.env.example` para onboarding
- ✅ Configuração centralizada

### **3. Manutenibilidade**

- ✅ Uma única constante `API_BASE_URL`
- ✅ Fácil alteração de configurações
- ✅ Código mais limpo e organizad

## 🚀 Como Usar

### **Para Desenvolvedores Novos:**

```bash
# 1. Copiar o arquivo de exemplo
cp .env.example .env.local

# 2. Editar as variáveis conforme necessário
# 3. Rodar o projeto
npm run dev
```

### **Para Diferentes Ambientes:**

#### **Desenvolvimento:**

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

#### **Staging:**

```bash
NEXT_PUBLIC_API_BASE_URL=https://api-staging.minhaempresa.com
```

#### **Produção:**

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.minhaempresa.com
```

## ✅ Validação

- ✅ **Build funcionando**: Next.js detecta `.env.local`
- ✅ **Sem URLs hardcoded**: Todas as chamadas usam a variável
- ✅ **Fallback configurado**: Se a env não existir, usa localhost:3000
- ✅ **TypeScript válido**: Sem erros de compilação
- ✅ **Gitignore atualizado**: Arquivos .env\* são ignorados

## 🔍 Verificação das Mudanças

Todas as URLs do backend foram centralizadas na variável `API_BASE_URL`:

1. **Configuração base do axios**: ✅ Usando variável de ambiente
2. **Interceptor de refresh token**: ✅ Usando mesma variável
3. **Sem URLs hardcoded restantes**: ✅ Confirmado via busca no código
4. **Build sem erros**: ✅ Compilação bem-sucedida

A implementação está completa e pronta para uso em diferentes ambientes!
