# k6-data.md — Estratégia de Massa de Dados

## 1. Visão Geral

Este documento descreve a estratégia de massa de dados adotada nos testes de performance com k6.

**Ambiente:** `https://quickpizza.grafana.com` (substituto oficial do test.k6.io, descontinuado em 2024)  
**Endpoints testados:**  
- `POST /api/pizza` — equivalente ao `/flip_coin.php` (endpoint leve, sem estado)  
- `GET /api/ratings` — equivalente ao `/my_messages.php` (endpoint autenticado, retorna dados do usuário)

---

## 2. Endpoint `POST /api/pizza` (equivalente ao /flip_coin.php)

### Características
- Método: `POST`
- Autenticação: requerida via `Authorization: Token <token>`
- Corpo da requisição: `{}` (objeto vazio — o servidor gera uma pizza aleatória)
- Resposta: JSON com dados de uma pizza gerada aleatoriamente

### Estratégia de Dados
O endpoint não exige parâmetros variáveis. O corpo é sempre `{}` e a variação ocorre no servidor (pizza aleatória). A única variação de dados nos testes é o **token de autenticação**, distribuído em round-robin entre os VUs.

---

## 3. Endpoint `GET /api/ratings` (equivalente ao /my_messages.php)

### Características
- Método: `GET`
- Autenticação: requerida via `Authorization: Token <token>`
- Parâmetros: nenhum
- Resposta: JSON com avaliações de pizza associadas ao usuário autenticado

### Estratégia de Dados
A variação de dados ocorre pelo token de autenticação. Cada token representa um usuário diferente, resultando em respostas potencialmente distintas (avaliações de cada usuário).

---

## 4. Criação e Gerenciamento de Usuários

### 4.1 Usuários de teste
São utilizados **20 usuários de teste** criados especificamente para os cenários de carga:

```
qpload01 / Test@1234
qpload02 / Test@1234
...
qpload20 / Test@1234
```

### 4.2 Ciclo de vida dos usuários

O ciclo é gerenciado pela função `setup()` do k6, que executa **uma única vez** antes do início do teste:

```js
export function setup() {
  const tokens = [];

  USERS.forEach((u) => {
    // Passo 1: Criar usuário (ignora se já existir — status 400/409)
    http.post(CREATE_URL,
      JSON.stringify({ username: u.username, password: u.password }),
      { headers: JSON_HEADERS }
    );

    // Passo 2: Autenticar e coletar token
    const loginRes = http.post(LOGIN_URL,
      JSON.stringify({ username: u.username, password: u.password }),
      { headers: JSON_HEADERS }
    );

    if (loginRes.status === 200) {
      const token = JSON.parse(loginRes.body).token;
      if (token) tokens.push(token);
    }
  });

  return tokens; // passado para todos os VUs
}
```

---

## 5. Distribuição dos Tokens entre VUs

Cada VU recebe um token de acordo com a fórmula de round-robin:

```js
export default function (tokens) {
  const token = tokens[(__VU - 1) % tokens.length];
  const authH = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  };
  // ... resto do fluxo do VU
}
```

Com 20 tokens e até 1000 VUs:
- VU 1 → token[0]
- VU 2 → token[1]
- ...
- VU 20 → token[19]
- VU 21 → token[0] (cicla)
- ...

Isso garante que os tokens sejam **distribuídos uniformemente** entre todos os VUs, sem que um único token seja sobrecarregado.

---

## 6. Por que setup() e não SharedArray?

A estratégia inicial previa o uso de `SharedArray` para carregar usuários de um arquivo JSON:

```js
// ❌ Abordagem descartada
import { SharedArray } from 'k6/data';
const users = new SharedArray('users', function () {
  return JSON.parse(open('../data/users.json'));
});
```

Essa abordagem foi descartada por dois motivos:

1. **Restrição do ciclo de vida do k6:** `open()` só é válido no estágio de inicialização (init stage — escopo global). Ao tentar usá-lo dentro de `setup()`, o k6 lança `GoError: open() can only be called from the init context`.

2. **Rate limiting durante login:** quando os VUs tentavam autenticar individualmente durante o teste (em vez de no setup), o servidor retornava `429 Too Many Requests` para os logins concorrentes, invalidando os resultados.

A solução com `setup()` resolve ambos os problemas: autenticação centralizada, sem restrições de ciclo de vida e sem concorrência no login.

---

## 7. Política de Isolamento de Dados

| Aspecto | Decisão |
|---|---|
| Quantidade de usuários | 20 — suficientes para 1000 VUs via round-robin |
| Senha | `Test@1234` — senha única e controlada para todos os usuários de teste |
| Tokens | Gerados no setup(), válidos para toda a duração do teste |
| Estado entre iterações | Nenhum — cada iteração do VU é independente |
| Dados sensíveis | Nenhum dado real — todos os usuários são fictícios e criados para os testes |

---

## 8. Arquivo de Dados Complementar

O arquivo `data/users.json` contém o registro dos usuários utilizados nos testes para referência e documentação:

```json
[
  { "username": "qpload01", "password": "Test@1234" },
  { "username": "qpload02", "password": "Test@1234" },
  ...
  { "username": "qpload20", "password": "Test@1234" }
]
```

> **Nota:** este arquivo é utilizado para documentação. A criação e autenticação dos usuários ocorre dinamicamente na função `setup()` de cada script.

---

## 9. Limitações e Considerações

- O quickpizza.grafana.com é um **ambiente público e compartilhado**. Os tokens podem expirar entre execuções, mas o setup() os renova automaticamente a cada nova execução.
- Em um ambiente de produção real, recomenda-se:
  - Gerenciar credenciais via variáveis de ambiente (`__ENV.PASSWORD`)
  - Usar arquivos CSV separados por ambiente
  - Implementar `teardown()` para limpar usuários criados após os testes

---

*Documento gerado como parte da Etapa 3 — Performance (Obrigatória)*
