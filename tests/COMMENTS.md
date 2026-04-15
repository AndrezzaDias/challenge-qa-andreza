# COMMENTS.md

## Decisões de arquitetura

- **playwright-bdd** para reutilizar os mesmos arquivos `.feature` da Etapa 1 na automação sem duplicar cenários
- Separação em três features por responsabilidade: fluxo principal, autenticação e validação de campos
- Helper compartilhado (`registrationHelper.ts`) para o Background que exige cadastro completo antes de autenticar
- Bugs automatizados com tag `@bug` como regression guards — falham enquanto o bug existe

## Bibliotecas e ferramentas utilizadas

- **Playwright** — automação E2E multi-browser
- **playwright-bdd** — integração BDD com Gherkin
- **TypeScript** — tipagem nos step definitions
- **faker-js (pt_BR)** — geração de dados dinâmicos
- **GitHub Actions** — CI/CD alternativa ao Docker Desktop incompatível com o ambiente local
- **Docker + docker-compose** — execução isolada em ambientes compatíveis

## O que eu melhoraria se tivesse mais tempo

- Implementar Page Object Model para centralizar seletores
- Adicionar limpeza automática dos dados criados a cada execução
- Integrar `@axe-core/playwright` para validação de acessibilidade automatizada
- Publicar relatórios HTML no GitHub Pages para histórico de execuções

## Requisitos obrigatórios não entregues

Todos os requisitos obrigatórios foram entregues
