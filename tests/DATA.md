# DATA.md — Estratégia de Dados de Teste

> **Aplicação:** Portal de Inscrições – https://developer.grupoa.education/subscription/  
> **Data:** Abril de 2026  
> **Analista:** Breno Oliveira

---

## 1. Visão Geral

Esta estratégia define como os dados de teste são criados, reutilizados, isolados e descartados no projeto de automação do Portal de Inscrições. O objetivo é garantir independência entre testes, reprodutibilidade e facilidade de manutenção.

---

## 2. Criação da Massa de Dados

### 2.1 Dados Gerados Dinamicamente

Utilizamos a biblioteca `@faker-js/faker` com a locale `pt_BR` para gerar dados realistas e únicos a cada execução. Isso garante que campos como nome, e-mail e celular nunca se repitam entre execuções paralelas.

**Localização:** `fixtures/testData.ts`

```ts
import { faker } from '@faker-js/faker/locale/pt_BR';

export const dadosValidos = {
  nome:       faker.person.firstName(),
  sobrenome:  faker.person.lastName(),
  nomeSocial: faker.person.firstName(),
  email:      `candidato+${Date.now()}@teste.com`,  // único por timestamp
  celular:    '11' + faker.string.numeric(9),
  // ...
};
```

**Campos gerados dinamicamente:**
- Nome, Sobrenome, Nome Social
- E-mail (com sufixo de timestamp para garantir unicidade)
- Celular e Telefone
- Complemento de endereço

### 2.2 Dados Estáticos Pré-Definidos

Alguns dados requerem validade lógica específica (como CPF e CEP), por isso são pré-validados e fixos:

| Campo | Valor             | Justificativa                          |
|-------|-------------------|----------------------------------------|
| CPF   | `93359024036`     | CPF matematicamente válido             |
| CEP   | `01310100`        | CEP real (Av. Paulista, SP)            |
| País  | `Brasil`          | Valor padrão esperado pelo formulário  |

**CPFs de reserva** (para uso em testes paralelos ou quando o CPF principal conflitar):

```ts
const cpfsValidos = [
  '07719718500',
  '52998224725',
  '27508453708',
  '06087760079',
];
```

### 2.3 Dados de Cenários Negativos

Definidos em `fixtures/testData.ts` sob o namespace `dadosInvalidos`:

| Campo             | Valor           | Cenário coberto                         |
|-------------------|-----------------|-----------------------------------------|
| E-mail inválido   | `joao@`         | Validação de formato de e-mail          |
| Telefone inválido | `00000000000`   | Validação de sequência de zeros (BUG-002)|
| CPF inválido      | `111.111.111-11`| Validação de dígito verificador CPF     |
| CEP inexistente   | `00000000`      | Validação de CEP na API                 |
| CEP curto         | `1234`          | Validação de comprimento de CEP         |

---

## 3. Reutilização e Isolamento de Dados

### 3.1 Princípio de Isolamento

Cada cenário de teste deve ser **completamente independente**. Nenhum teste pode depender do estado criado por outro teste anterior.

**Regras de isolamento:**
- E-mails gerados com `Date.now()` garantem unicidade por execução
- Cada cenário de autenticação gera um novo usuário via `registrationHelper.ts`
- Dados compartilhados entre steps do mesmo cenário usam variáveis de escopo local (ex: `credenciaisValidas` em `autenticacao.steps.ts`)

### 3.2 Compartilhamento de Lógica (Sem Duplicação)

Para evitar duplicação do fluxo de registro entre os arquivos de steps, criamos o helper:

```
support/registrationHelper.ts
  └── navegarAteTelaDeAutenticacao(page: Page)
         Navega pelo formulário completo e retorna { usuario, senha }
```

Esse helper é importado por `autenticacao.steps.ts` e pode ser reutilizado em futuros arquivos de steps.

### 3.3 Estado de Browser (storageState)

Para cenários que precisam de login pré-existente sem repetir o cadastro a cada execução (otimização futura), recomenda-se usar o recurso `storageState` do Playwright:

```ts
// playwright.config.ts — uso futuro
export default defineConfig({
  use: {
    storageState: 'fixtures/auth.json', // sessão salva após 1º login
  },
});
```

O arquivo `auth.json` pode ser gerado em um `globalSetup` que executa o cadastro + login uma única vez e salva os cookies/localStorage.

---

## 4. Estratégia para Testes de Validação

### 4.1 Testes de Campos Obrigatórios

Usam `dadosInvalidos` para submeter valores inválidos e verificar mensagens de erro. O padrão é:

```gherkin
Esquema do Cenário: Validação do campo <campo>
  Quando preenche o campo <campo> com "<valor_invalido>"
  Então a mensagem "<mensagem_esperada>" é exibida
  Exemplos:
    | campo   | valor_invalido | mensagem_esperada           |
    | E-mail  | joao@          | E-mail inválido             |
    | Telefone| 00000000000    | Informe um telefone válido  |
```

### 4.2 Testes de Autenticação

Para testes de autenticação com credenciais inválidas, o `registrationHelper` completa o registro e retorna as credenciais geradas. Os cenários negativos usam:
- Senha errada: credencial válida + senha arbitrária incorreta
- Usuário inexistente: string aleatória que não é um usuário real

---

## 5. Considerações para Persistência em PostgreSQL

### 5.1 Modelo de Dados Sugerido

Para persistir e controlar os dados de teste em um banco PostgreSQL:

```sql
-- Tabela de usuários de teste
CREATE TABLE test_users (
  id           SERIAL PRIMARY KEY,
  cpf          VARCHAR(14)   NOT NULL UNIQUE,
  nome         VARCHAR(100)  NOT NULL,
  email        VARCHAR(200)  NOT NULL UNIQUE,
  usuario      VARCHAR(50),
  senha        VARCHAR(50),
  criado_em    TIMESTAMP DEFAULT NOW(),
  descartado   BOOLEAN   DEFAULT FALSE
);

-- Tabela de execuções de teste
CREATE TABLE test_runs (
  id         SERIAL PRIMARY KEY,
  cenario    VARCHAR(200),
  user_id    INTEGER REFERENCES test_users(id),
  status     VARCHAR(20), -- PASS | FAIL | SKIP
  executado_em TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Geração de CPFs Únicos via Banco

Para evitar conflito de CPFs em execuções paralelas, implementar uma fila de CPFs pré-validados:

```sql
CREATE TABLE cpf_pool (
  cpf       VARCHAR(14) PRIMARY KEY,
  em_uso    BOOLEAN DEFAULT FALSE,
  reservado_em TIMESTAMP
);
```

O teste reserva um CPF antes de executar e libera após (`em_uso = FALSE`).

### 5.3 Integração com Playwright

```ts
// support/dbHelper.ts (uso futuro)
export async function reservarCpf(): Promise<string> {
  // SELECT cpf FROM cpf_pool WHERE em_uso = FALSE LIMIT 1 FOR UPDATE
  // UPDATE cpf_pool SET em_uso = TRUE WHERE cpf = ?
}

export async function liberarCpf(cpf: string): Promise<void> {
  // UPDATE cpf_pool SET em_uso = FALSE WHERE cpf = ?
}
```

---

## 6. Exclusão da Massa de Dados

### 6.1 Limpeza por Cenário (Teardown)

Após cada teste, dados criados devem ser limpos para evitar acúmulo. Se a API oferecer endpoints de deleção:

```ts
// support/hooks.ts — uso futuro
After(async ({ page }) => {
  // Chama API de limpeza, se disponível
  // await deleteTestUser(credenciaisGeradas.usuario);
});
```

### 6.2 Limpeza em Batch (PostgreSQL)

Script SQL para limpar dados de teste mais antigos que X dias:

```sql
-- Descarta usuários de teste criados há mais de 7 dias
UPDATE test_users
SET descartado = TRUE
WHERE criado_em < NOW() - INTERVAL '7 days'
  AND email LIKE '%@teste.com';

-- Ou deleção física:
DELETE FROM test_users
WHERE criado_em < NOW() - INTERVAL '7 days'
  AND email LIKE '%@teste.com';
```

### 6.3 Limpeza de Fixtures Locais

Para o projeto atual (sem banco de dados), a limpeza é feita via:
- Os dados são efêmeros (gerados com `faker` + timestamp), sem persistência local
- O `Date.now()` nos e-mails garante que registros antigos não interfiram
- CPFs do `cpf_pool` em `testData.ts` podem ser rodados manualmente se houver conflito no ambiente

### 6.4 Script de Limpeza Manual

```bash
# Gera nova execução bddgen e limpa artefatos antigos
npm run bddgen
rm -rf test-results/
```

---

## 7. Resumo da Estrutura de Dados

```
fixtures/
  testData.ts          → Dados válidos e inválidos (faker + estáticos)

support/
  registrationHelper.ts → Helper de fluxo de registro (reutilizável)
  hooks.ts              → Before/After hooks (teardown futuro)

features/
  subscription.feature  → Cenários do fluxo principal
  autenticacao.feature  → Cenários de autenticação

steps/
  subscription.steps.ts → Steps do fluxo principal
  autenticacao.steps.ts → Steps de autenticação
```
