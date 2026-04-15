# Testes de Performance — k6

Projeto de testes de carga com k6 para a Etapa 3 do desafio.

> **Nota:** O ambiente `test.k6.io` indicado no desafio foi descontinuado pela Grafana em 2024 e está fora do ar. Os testes foram desenvolvidos no substituto oficial: `quickpizza.grafana.com`, mantendo os mesmos tipos de endpoint — um leve (sem estado) e um autenticado.

---

## Estrutura

```
k6-performance/
├── scripts/
│   ├── scenario-100-users.js    # 100 VUs — Load Test
│   ├── scenario-500-users.js    # 500 VUs — Load Test
│   └── scenario-1000-users.js  # 1000 VUs — Stress Test
├── data/
│   └── users.json               # Usuários de teste
├── reports/
│   ├── report-100-users.html
│   ├── report-500-users.html
│   └── report-1000-users.html
├── k6-data.md                   # Estratégia de massa de dados
├── ANALISE.md                   # Análise de desempenho
└── COMMENTS.md                  # Decisões e observações
```

---

## Endpoints testados

| Endpoint original (test.k6.io) | Equivalente utilizado | Tipo |
|---|---|---|
| `GET /flip_coin.php` | `POST /api/pizza` | Leve, sem estado |
| `GET /my_messages.php` | `GET /api/ratings` | Autenticado |

---

## Como executar

**Pré-requisito:** k6 instalado. [Download aqui](https://grafana.com/docs/k6/latest/set-up/install-k6/)

```bash
# Cenário 100 VUs (~5 min)
k6 run scripts/scenario-100-users.js

# Cenário 500 VUs (~10 min)
k6 run scripts/scenario-500-users.js

# Cenário 1000 VUs — stress (~13 min)
k6 run scripts/scenario-1000-users.js
```

Para ver o dashboard em tempo real, adicione `--out web-dashboard` e acesse `http://localhost:5665`.

Os relatórios HTML são gerados automaticamente em `reports/` ao final de cada execução.

---

## Resultados

| Cenário | p95 | Taxa de Erros | Throughput | Resultado |
|---|---|---|---|---|
| 100 VUs | 223 ms | 0,00 % | 56,7 req/s | ✅ |
| 500 VUs | 236 ms | 0,00 % | 253,6 req/s | ✅ |
| 1000 VUs | 247 ms | 0,00 % | 644,1 req/s | ✅ |

Todos os thresholds aprovados nos 3 cenários. Análise completa em `ANALISE.md`.
