### Challenge QA 

#### Estrutura do Projeto

```
challenge-qa-grupoa/
├── features/
│   ├── subscription.feature     # Fluxo principal de inscrição
│   ├── autenticacao.feature     # Autenticação e recuperação de acesso
│   └── validation.feature       # Validação de campos do formulário
├── steps/
│   ├── subscription.steps.ts
│   ├── autenticacao.steps.ts
│   └── validation.steps.ts
├── support/
│   └── registrationHelper.ts    # Helper compartilhado de registro
├── fixtures/
│   └── testData.ts              # Massa de dados (faker + estáticos)
├── BUGS.md
├── DATA.md
├── COMMENTS.md
├── Dockerfile
├── docker-compose.yml
└── playwright.config.ts
```

---

## Como rodar

```bash
# Instalar dependências
npm install

# Instalar browsers (primeira vez)
npx playwright install --with-deps

# Gerar specs BDD + executar todos os testes
npm run test:all

# Ver relatório HTML
npx playwright show-report
```

### Filtrar por tag

```bash
npx bddgen && npx playwright test --grep @smoke
npx bddgen && npx playwright test --grep @autenticacao
npx bddgen && npx playwright test --grep @bug
```

### Múltiplos browsers

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Docker

```bash
docker compose up --build
docker compose run tests-chromium
docker compose run tests-smoke
```

### CI/CD — GitHub Actions

Executa automaticamente em cada push com 4 jobs paralelos: Chromium, Firefox, WebKit e Smoke. Relatórios disponíveis em **Actions → Artifacts**.

---

## Bugs Encontrados

Ver [BUGS.md](./BUGS.md) para o relatório completo.

| ID | Severidade | Descrição |
|---|---|---|
| BUG-001 | Alta | Cursos de Pós-Graduação exibidos no nível Graduação |
| BUG-002 | Média | Telefone aceita sequência de zeros inválida |
| BUG-003 | Média | Campos de endereço não limpos ao alterar o CEP |
| BUG-004 | Baixa | Validação de e-mail dispara durante digitação |
| BUG-005 | Média | Dropdown fecha ao rolar a lista |
| BUG-006 | Alta | Botão Avançar habilitado sem curso selecionado |
| BUG-007 | Baixa | Sem indicador de carregamento no CEP |
| BUG-008 | Alta | Página Financeiro sem conteúdo e sem botão de voltar |
| BUG-009 | Baixa | Botão Tema sem aria-label acessível |
| BUG-010 | Alta | Senha incorreta exibe mensagem dupla |
| BUG-011 | Alta | "Redefinir senha" redireciona para sucesso sem coletar dados |
| BUG-012 | Alta | "Minhas inscrições" vazia após inscrição concluída |
| BUG-013 | Média | Campo CEP rejeita formato com hífen (máximo 8 caracteres) |

---

## Estratégia de Dados

Ver [DATA.md](./DATA.md).
