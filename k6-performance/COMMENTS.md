# COMMENTS.md — Decisões e Observações do Projeto

## 1. Decisões de Arquitetura

### 1.1 Migração de test.k6.io → quickpizza.grafana.com

O enunciado do desafio referencia a URL `https://test.k6.io` e os endpoints `/flip_coin.php` e `/my_messages.php`. Porém, **o ambiente test.k6.io foi descontinuado pela Grafana em 2024** e está completamente fora do ar (retorna `ERR_NAME_NOT_RESOLVED`). A própria Grafana disponibilizou um ambiente substituto oficial: `https://quickpizza.grafana.com`.

Mapeamento de equivalência aplicado:

| Endpoint original (test.k6.io) | Endpoint utilizado (quickpizza.grafana.com) | Finalidade |
|---|---|---|
| `GET /flip_coin.php` | `POST /api/pizza` | Endpoint leve, resposta rápida (sem estado) |
| `GET /my_messages.php` | `GET /api/ratings` | Endpoint autenticado, retorna dados do usuário |

Todos os scripts, relatórios e análises foram desenvolvidos contra o ambiente quickpizza.grafana.com, mantendo fidelidade ao propósito original do desafio: testar endpoints com e sem autenticação sob carga crescente.

### 1.2 Estratégia de autenticação com setup()

A autenticação foi centralizada na função `setup()` do k6, que executa uma única vez antes do início do teste. Essa função:

1. Cria 20 usuários (`qpload01` a `qpload20`) via `POST /api/users` — ignora se já existirem
2. Autentica cada usuário via `POST /api/users/token/login?set_cookie=true`
3. Coleta os 20 tokens e os passa como parâmetro para todos os VUs

Os VUs distribuem os tokens em round-robin com `tokens[(__VU - 1) % tokens.length]`, garantindo que cada VU use um token válido sem precisar autenticar durante o teste.

**Por que esta abordagem:** tentativas de autenticar durante a execução do teste causaram rate-limiting (429) com 100+ VUs simultâneos. Centralizar no setup() elimina esse problema.

### 1.3 Estrutura de cenários progressivos

Foram criados 3 cenários com complexidade crescente:

- **100 VUs — Load Test:** valida que a aplicação se comporta adequadamente sob carga normal. Thresholds conservadores (p95 < 3 s).
- **500 VUs — Load Test elevado:** verifica degradação aceitável sob carga média-alta. Thresholds moderados (p95 < 4 s).
- **1000 VUs — Stress Test:** encontra o ponto de saturação da aplicação. Thresholds permissivos (p95 < 6 s, erros < 10%) pois o objetivo é observar o comportamento, não forçar aprovação.

### 1.4 Métricas customizadas

Cada script define 5 métricas customizadas além das métricas nativas do k6:

- `pizza_duration` (Trend) — latência exclusiva do POST /api/pizza
- `ratings_duration` (Trend) — latência exclusiva do GET /api/ratings
- `pizza_errors` (Rate) — taxa de falha do endpoint de pizza
- `ratings_errors` (Rate) — taxa de falha do endpoint de ratings
- `total_requests` (Counter) — total acumulado de requisições realizadas

Isso permite análise granular por endpoint, em vez de depender apenas das métricas globais do k6.

### 1.5 Geração de relatórios HTML

Os relatórios HTML são gerados automaticamente via `handleSummary()` utilizando a biblioteca `k6-reporter` (benc-uk). A função é chamada pelo k6 ao final de cada execução e escreve o arquivo em `reports/report-{N}-users.html`.

---

## 2. Bibliotecas e Ferramentas Utilizadas

| Ferramenta / Biblioteca | Versão | Finalidade |
|---|---|---|
| **k6** | v1.7.1 | Motor de testes de carga |
| **k6-reporter** | v3.0.4 | Geração de relatórios HTML a partir dos dados do k6 |
| **k6-summary** | v0.0.1 (jslib.k6.io) | Formatação do resumo no terminal com cores |
| **quickpizza.grafana.com** | — | Ambiente de teste substituto ao test.k6.io (descontinuado) |

**Por que k6-reporter:** é a biblioteca mais adotada para geração de relatórios HTML no ecossistema k6, mantida ativamente e compatível com a API `handleSummary`. Produz relatórios visuais claros sem necessidade de infraestrutura adicional (Grafana, InfluxDB, etc.).

---

## 3. O que eu melhoraria com mais tempo

### 3.1 Testes adicionais

- **Soak test (endurance):** manter 200–300 VUs por 30–60 minutos para detectar memory leaks e degradação gradual de performance.
- **Spike test:** aumentar de 0 para 1000 VUs em 30 segundos e medir a velocidade de recuperação da aplicação.
- **Breakpoint test:** aumentar VUs continuamente até a aplicação falhar, para descobrir o limite real de capacidade.

### 3.2 Gestão de dados

- Usar arquivo CSV com `papaparse` para gerenciar usuários de forma mais escalável e sem hardcode no script.
- Implementar teardown() para limpar usuários criados após cada execução.
- Separar ambientes com variáveis de ambiente (`__ENV.BASE_URL`, `__ENV.PASSWORD`) para facilitar execução em staging e produção.

### 3.3 Infraestrutura de observabilidade

- Integrar k6 com **Grafana + InfluxDB** para dashboards persistentes e histórico de execuções.
- Configurar alertas automáticos quando thresholds falharem em execuções de CI/CD.
- Adicionar **k6 Cloud** para execução distribuída e relatórios centralizados.

### 3.4 Cobertura de endpoints

- Adicionar o endpoint de criação de pizzas com parâmetros (`maxCaloriesPerSlice`, `mustBeVegetarian`, etc.) para cobrir mais variações de carga.
- Testar a API de ratings com POST (submissão de avaliações) além do GET.

### 3.5 Qualidade dos scripts

- Extrair a lógica de setup (criação de usuários + autenticação) para um helper reutilizável.
- Adicionar validação do corpo da resposta (verificar campos obrigatórios no JSON, não apenas status HTTP).
- Implementar correlação de dados — usar o `id` da pizza recebida no POST para fazer um GET subsequente.

---

## 4. Requisitos Obrigatórios Não Entregues

### 4.1 Ambiente original (test.k6.io)

O enunciado especifica `https://test.k6.io` com os endpoints `/flip_coin.php` e `/my_messages.php`. Esses endpoints **não estão disponíveis** pois o ambiente foi descontinuado pela Grafana (verificado em abril de 2026). Os scripts foram desenvolvidos contra o ambiente substituto oficial (`quickpizza.grafana.com`), mantendo a mesma lógica de teste: um endpoint sem autenticação e um endpoint autenticado.

Todos os demais requisitos da Etapa 3 foram entregues:

| Requisito | Status |
|---|---|
| 3 cenários de carga (100 / 500 / 1000 VUs) | ✅ Entregue |
| Scripts k6 para os cenários | ✅ Entregue |
| `k6-data.md` com estratégia de massa de dados | ✅ Entregue |
| Relatórios HTML por cenário | ✅ Entregue |
| Análise de desempenho (`ANALISE.md`) | ✅ Entregue |
| `COMMENTS.md` | ✅ Este arquivo |

---

*Etapa 3 — Performance (Obrigatória)*
