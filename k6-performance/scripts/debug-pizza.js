// =============================================================
// debug-pizza.js — Descobre o status exato do /api/pizza
// Execução: k6 run scripts/debug-pizza.js
// =============================================================

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL     = 'https://quickpizza.grafana.com';
const CREATE_URL   = `${BASE_URL}/api/users`;
const LOGIN_URL    = `${BASE_URL}/api/users/token/login?set_cookie=true`;
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const options = { vus: 1, iterations: 1 };

export function setup() {
  // Cria um usuário temporário de debug
  http.post(CREATE_URL,
    JSON.stringify({ username: 'qpdebug99', password: 'Debug@123' }),
    { headers: JSON_HEADERS }
  );
  sleep(0.3);

  const res = http.post(LOGIN_URL,
    JSON.stringify({ username: 'qpdebug99', password: 'Debug@123' }),
    { headers: JSON_HEADERS }
  );

  if (res.status !== 200) {
    throw new Error(`Login falhou: ${res.status} — ${res.body}`);
  }

  const token = JSON.parse(res.body).token;
  console.log(`\nToken obtido: ${token}\n`);
  return token;
}

export default function (token) {
  const authToken  = { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` };
  const authBearer = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  console.log('======== TESTANDO /api/pizza ========\n');

  // 1. GET sem auth
  let r = http.get(`${BASE_URL}/api/pizza`);
  console.log(`[1] GET /api/pizza (sem auth)     → status: ${r.status} | body: ${r.body.substring(0, 200)}`);
  sleep(0.3);

  // 2. GET com Token
  r = http.get(`${BASE_URL}/api/pizza`, { headers: authToken });
  console.log(`[2] GET /api/pizza (Token)        → status: ${r.status} | body: ${r.body.substring(0, 200)}`);
  sleep(0.3);

  // 3. GET com Bearer
  r = http.get(`${BASE_URL}/api/pizza`, { headers: authBearer });
  console.log(`[3] GET /api/pizza (Bearer)       → status: ${r.status} | body: ${r.body.substring(0, 200)}`);
  sleep(0.3);

  // 4. POST com Token
  r = http.post(`${BASE_URL}/api/pizza`, JSON.stringify({}), { headers: authToken });
  console.log(`[4] POST /api/pizza (Token)       → status: ${r.status} | body: ${r.body.substring(0, 200)}`);
  sleep(0.3);

  // 5. GET /api/pizza/ (com barra final)
  r = http.get(`${BASE_URL}/api/pizza/`, { headers: authToken });
  console.log(`[5] GET /api/pizza/ (barra final) → status: ${r.status} | body: ${r.body.substring(0, 200)}`);
  sleep(0.3);

  // 6. GET /api/pizzas (plural)
  r = http.get(`${BASE_URL}/api/pizzas`, { headers: authToken });
  console.log(`[6] GET /api/pizzas (plural)      → status: ${r.status} | body: ${r.body.substring(0, 200)}`);
  sleep(0.3);

  // 7. GET com parâmetros
  r = http.get(`${BASE_URL}/api/pizza?maxCaloriesPerSlice=500`, { headers: authToken });
  console.log(`[7] GET /api/pizza?maxCal=500     → status: ${r.status} | body: ${r.body.substring(0, 200)}`);
  sleep(0.3);

  console.log('\n======== FIM — copie e envie os resultados ========');
}
