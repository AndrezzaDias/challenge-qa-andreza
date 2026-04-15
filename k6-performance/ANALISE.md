# Análise de Desempenho — Testes de Performance k6

**Ambiente:** https://quickpizza.grafana.com  
**Endpoints testados:** `POST /api/pizza` | `GET /api/ratings`  
**Equivalência:** `/flip_coin.php` (pizza) | `/my_messages.php` (ratings)  
**Ferramenta:** k6 v1.7.1  
**Data:** 2026-04-15  

> **Nota:** O ambiente original `test.k6.io` foi descontinuado pela Grafana em 2024. Os testes foram executados contra o substituto oficial `quickpizza.grafana.com`. Detalhes em `COMMENTS.md`.

---

## 1. Resumo Comparativo dos Cenários

| Cenário | VUs | Duração | Total Req | Taxa de Erros | p95 (ms) | p99 (ms) | Throughput | Resultado |
|---------|-----|---------|-----------|---------------|----------|----------|------------|-----------|
| **100 VUs** | 100 | 4m 45s | 16.194 | 0,12 % | **223 ms** | 234 ms | 56,7 req/s | ✅ PASSOU |
| **500 VUs** | 500 | 10m 15s | 156.120 | 0,01 % | **236 ms** | 267 ms | 253,6 req/s | ✅ PASSOU |
| **1000 VUs** | 1000 | 13m 16s | 512.202 | **0,00 %** | **247 ms** | 300 ms | 644,1 req/s | ✅ PASSOU |

**Todos os 3 cenários aprovaram todos os thresholds com margem expressiva.**

---

## 2. Análise Detalhada — Cenário 100 VUs

Execução realizada em **15/04/2026**.

### 2.1 Métricas Globais

| Métrica | Valor |
|---|---|
| Total de iterações | 8.077 |
| Total de requisições | 16.194 |
| Throughput | 56,7 req/s |
| Duração real | 4m 45s |
| VUs máximos atingidos | 100 |

### 2.2 Latência (http_req_duration)

| Percentil | Valor |
|---|---|
| Média | 149,7 ms |
| Mínimo | 109,5 ms |
| Mediana (p50) | 130,6 ms |
| p90 | 213,7 ms |
| **p95** | **223,4 ms** |
| **p99** | **233,6 ms** |
| Máximo | 532,7 ms |

### 2.3 Por Endpoint

| Endpoint | Média | p95 | Erros | Threshold | Status |
|---|---|---|---|---|---|
| `POST /api/pizza` | 183,7 ms | 228,8 ms | 0,00 % | p95 < 2.000 ms | ✅ |
| `GET /api/ratings` | 115,6 ms | 122,1 ms | 0,00 % | p95 < 2.500 ms | ✅ |

### 2.4 Thresholds — 7/7 aprovados

| Threshold | Obtido | Limite | Status |
|---|---|---|---|
| `http_req_duration p(95)` | 223 ms | < 3.000 ms | ✅ |
| `http_req_duration p(99)` | 234 ms | < 5.000 ms | ✅ |
| `http_req_failed` | 0,12 % | < 5 % | ✅ |
| `pizza_duration p(95)` | 229 ms | < 2.000 ms | ✅ |
| `ratings_duration p(95)` | 122 ms | < 2.500 ms | ✅ |
| `pizza_errors` | 0,00 % | < 5 % | ✅ |
| `ratings_errors` | 0,00 % | < 5 % | ✅ |

---

## 3. Análise Detalhada — Cenário 500 VUs

Execução realizada em **15/04/2026**.

### 3.1 Métricas Globais

| Métrica | Valor |
|---|---|
| Total de iterações | 78.040 |
| Total de requisições | 156.120 |
| Throughput | 253,6 req/s |
| Duração real | 10m 15s |
| VUs máximos atingidos | 500 |

### 3.2 Latência (http_req_duration)

| Percentil | Valor |
|---|---|
| Média | 156,4 ms |
| Mínimo | 108,8 ms |
| Mediana (p50) | 138,9 ms |
| p90 | 223,9 ms |
| **p95** | **236,2 ms** |
| **p99** | **267,3 ms** |
| Máximo | 1.140 ms |

### 3.3 Por Endpoint

| Endpoint | Média | p95 | Erros | Threshold | Status |
|---|---|---|---|---|---|
| `POST /api/pizza` | 193,7 ms | 248,9 ms | 0,00 % | p95 < 3.000 ms | ✅ |
| `GET /api/ratings` | 119,2 ms | 137,1 ms | 0,00 % | p95 < 4.000 ms | ✅ |

### 3.4 Thresholds — 7/7 aprovados

| Threshold | Obtido | Limite | Status |
|---|---|---|---|
| `http_req_duration p(95)` | 236 ms | < 4.000 ms | ✅ |
| `http_req_duration p(99)` | 267 ms | < 7.000 ms | ✅ |
| `http_req_failed` | 0,01 % | < 5 % | ✅ |
| `pizza_duration p(95)` | 249 ms | < 3.000 ms | ✅ |
| `ratings_duration p(95)` | 137 ms | < 4.000 ms | ✅ |
| `pizza_errors` | 0,00 % | < 5 % | ✅ |
| `ratings_errors` | 0,00 % | < 5 % | ✅ |

---

## 4. Análise Detalhada — Cenário 1000 VUs (Stress Test)

Execução realizada em **15/04/2026**.

### 4.1 Métricas Globais

| Métrica | Valor |
|---|---|
| Total de iterações | 256.081 |
| Total de requisições | 512.202 |
| Throughput | **644,1 req/s** |
| Duração real | 13m 16s |
| VUs máximos atingidos | 1.000 |

### 4.2 Latência (http_req_duration)

| Percentil | Valor |
|---|---|
| Média | 159,7 ms |
| Mínimo | 108,4 ms |
| Mediana (p50) | 141,3 ms |
| p90 | 229,1 ms |
| **p95** | **247,4 ms** |
| **p99** | **299,8 ms** |
| Máximo | 1.170 ms |

### 4.3 Por Endpoint

| Endpoint | Média | p95 | Erros | Threshold | Status |
|---|---|---|---|---|---|
| `POST /api/pizza` | 198,8 ms | 267,9 ms | **0,00 %** | p95 < 5.000 ms | ✅ |
| `GET /api/ratings` | 120,7 ms | 144,0 ms | **0,00 %** | p95 < 6.000 ms | ✅ |

### 4.4 Thresholds — 7/7 aprovados

| Threshold | Obtido | Limite | Status |
|---|---|---|---|
| `http_req_duration p(95)` | 247 ms | < 6.000 ms | ✅ |
| `http_req_duration p(99)` | 300 ms | < 10.000 ms | ✅ |
| `http_req_failed` | **0,00 %** | < 10 % | ✅ |
| `pizza_duration p(95)` | 268 ms | < 5.000 ms | ✅ |
| `ratings_duration p(95)` | 144 ms | < 6.000 ms | ✅ |
| `pizza_errors` | **0,00 %** | < 10 % | ✅ |
| `ratings_errors` | **0,00 %** | < 10 % | ✅ |

**Resultado: 7/7 thresholds aprovados. 0% de erros em 512.202 requisições.**

---

## 5. Comparativo Consolidado por Endpoint

### 5.1 `POST /api/pizza` — evolução com carga

| Cenário | Média | p95 | p99 | Erros |
|---|---|---|---|---|
| 100 VUs | 183,7 ms | 228,8 ms | — | 0,00 % |
| 500 VUs | 193,7 ms | 248,9 ms | — | 0,00 % |
| 1000 VUs | 198,8 ms | 267,9 ms | 325,4 ms | 0,00 % |

Aumento total do p95 de 100 para 1000 VUs: **+39 ms** (17%). Crescimento praticamente linear e controlado.

### 5.2 `GET /api/ratings` — evolução com carga

| Cenário | Média | p95 | p99 | Erros |
|---|---|---|---|---|
| 100 VUs | 115,6 ms | 122,1 ms | — | 0,00 % |
| 500 VUs | 119,2 ms | 137,1 ms | — | 0,00 % |
| 1000 VUs | 120,7 ms | 144,0 ms | 173,4 ms | 0,00 % |

Aumento total do p95 de 100 para 1000 VUs: **+22 ms** (18%). O endpoint mais estável e previsível do teste.

---

## 6. Evolução do Throughput

```
Requisições/segundo por cenário:

100 VUs:    56,7 req/s   ████
500 VUs:   253,6 req/s   ██████████████████
1000 VUs:  644,1 req/s   ████████████████████████████████████████████
```

O throughput escalou de forma superlinear: 10× mais VUs resultou em 11,4× mais requisições por segundo, evidenciando que o servidor utiliza conexões persistentes (keep-alive) de forma eficiente.

---

## 7. Taxa de Erros

```
Taxa de erros global (%) por cenário:

100 VUs:   ░░░░░░░░░░░░░░░░░░░░   0,12 %  (20 erros no setup)
500 VUs:   ░░░░░░░░░░░░░░░░░░░░   0,01 %  (20 erros no setup)
1000 VUs:  ░░░░░░░░░░░░░░░░░░░░   0,00 %  ← zero erros em 512.202 req
```

Os 20 erros nos cenários de 100 e 500 VUs ocorreram no `setup()` (criação de usuários), antes do início do teste. Durante toda a carga sustentada, a taxa de erros foi **0%** nos três cenários.

---

## 8. Ausência de Ponto de Saturação

Contrariamente à expectativa inicial, o servidor `quickpizza.grafana.com` **não atingiu saturação** em nenhum dos três cenários testados. O comportamento foi:

- Latência controlada e crescimento quase linear com o aumento de VUs
- 0% de erros nos endpoints em todos os cenários
- Throughput escalando proporcionalmente aos VUs
- Sem evidências de esgotamento de conexões, rate limiting ou timeouts

Este resultado é consistente com um servidor bem dimensionado, possivelmente com auto-scaling, servindo de trás de uma CDN ou balanceador de carga robusto.

Para identificar o ponto real de saturação, seria necessário um **breakpoint test** — aumentar VUs continuamente além de 1.000 até a aplicação começar a falhar.

---

## 9. Recomendações Técnicas

**Com base nos resultados:**

1. O servidor suporta confortavelmente 1.000 VUs com excelente desempenho. Para ambientes de produção equivalentes, o limite real está bem além de 1.000 usuários simultâneos.
2. O endpoint `/api/ratings` é mais rápido e estável que o `/api/pizza` — se performance for crítica, otimizar o pipeline de geração de pizzas (mais lógica de negócio).
3. A diferença entre p95 e p99 é pequena (menos de 55 ms em todos os cenários), indicando distribuição de latência muito uniforme.

**Próximos passos recomendados:**

1. **Breakpoint test:** aumentar VUs além de 1.000 para descobrir o limite real.
2. **Soak test:** manter 500 VUs por 60 minutos para detectar degradação gradual ou memory leaks.
3. **Spike test:** subir de 0 para 1.000 VUs em 10 segundos para testar elasticidade.

---

## 10. Conclusão

Os **três cenários de carga foram aprovados com 100% de sucesso**, com desempenho muito acima do esperado:

| Resultado esperado | Resultado real |
|---|---|
| 100 VUs: p95 < 3.000 ms | p95 = **223 ms** (13× abaixo do threshold) |
| 500 VUs: p95 < 4.000 ms | p95 = **236 ms** (17× abaixo do threshold) |
| 1000 VUs: p95 < 6.000 ms | p95 = **247 ms** (24× abaixo do threshold) |

O servidor `quickpizza.grafana.com` demonstrou escalabilidade exemplar: de 100 para 1.000 VUs, o p95 aumentou apenas **24 ms** (de 223 para 247 ms), enquanto o throughput cresceu **11,4×** (de 56,7 para 644,1 req/s). Em todos os cenários, os endpoints registraram **0% de erros** durante a carga sustentada.

---

*Análise gerada como parte da Etapa 3 — Performance (Obrigatória)*
