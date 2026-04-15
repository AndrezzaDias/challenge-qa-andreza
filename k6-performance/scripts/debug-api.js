// =============================================================
// debug-api.js — Diagnóstico completo do quickpizza
// Testa diferentes endpoints de login, campos e senhas
//
// Execução: k6 run scripts/debug-api.js
// =============================================================

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com';
const H = { 'Content-Type': 'application/json' };

export const options = { vus: 1, iterations: 1 };

function testar(label, method, url, body) {
  const res = method === 'POST'
    ? http.post(url, JSON.stringify(body), { headers: H })
    : http.get(url, { headers: H });
  console.log(`[${label}] ${method} ${url}`);
  console.log(`  Status: ${res.status}`);
  console.log(`  Body  : ${res.body ? res.body.substring(0, 200) : '(vazio)'}`);
  console.log('');
  sleep(0.3);
  return res;
}

export default function () {
  console.log('\n========== TESTE DE ENDPOINTS DE LOGIN ==========\n');

  // --- Diferentes endpoints de login ---
  const endpoints = [
    '/api/users/token/login?set_cookie=true',
    '/api/token',
    '/api/login',
    '/api/users/login',
    '/api/auth/token',
  ];

  // --- Diferentes combinações de campos ---
  const payloads = [
    { username: 'andreza01', password: 'Senha@123' },
    { user: 'andreza01', password: 'Senha@123' },
    { username: 'andreza01', password: 'Test1234' },
    { username: 'andreza01', password: 'test1234' },
    { username: 'andreza01', password: '1234' },
    { username: 'test',      password: '1234' },       // usuário demo clássico
    { user: 'test',          password: '1234' },
  ];

  let token = null;
  let loginOk = false;

  // Tenta cada combinação até encontrar uma que funciona
  for (const ep of endpoints) {
    if (loginOk) break;
    for (const pl of payloads) {
      const res = http.post(`${BASE_URL}${ep}`, JSON.stringify(pl), { headers: H });
      console.log(`[LOGIN] ${ep} | payload: ${JSON.stringify(pl)} | status: ${res.status}`);
      if (res.status === 200) {
        console.log(`  ✅ SUCESSO! Body: ${res.body.substring(0, 300)}`);
        try { token = JSON.parse(res.body).token; } catch(e) {}
        loginOk = true;
        break;
      } else {
        console.log(`  ✗ ${res.body ? res.body.substring(0, 100) : ''}`);
      }
      sleep(0.2);
    }
  }

  if (!token) {
    console.log('\n========== CRIANDO NOVO USUÁRIO ==========\n');

    // Tenta criar um usuário novo com credenciais simples
    const novoUsuario = {
      user:     'k6testuser',
      username: 'k6testuser',
      password: 'Test1234',
      id:       999,
    };

    const criarRes = http.post(`${BASE_URL}/api/users`, JSON.stringify(novoUsuario), { headers: H });
    console.log(`[CRIAR] status: ${criarRes.status} | body: ${criarRes.body.substring(0, 300)}`);
    sleep(0.3);

    // Tenta logar com o novo usuário
    const loginNovo = http.post(
      `${BASE_URL}/api/users/token/login?set_cookie=true`,
      JSON.stringify({ username: 'k6testuser', password: 'Test1234' }),
      { headers: H }
    );
    console.log(`[LOGIN novo] status: ${loginNovo.status} | body: ${loginNovo.body.substring(0, 300)}`);
    if (loginNovo.status === 200) {
      try { token = JSON.parse(loginNovo.body).token; } catch(e) {}
    }
    sleep(0.3);
  }

  if (!token) {
    console.log('\n❌ Nenhum login funcionou. Verifique os resultados acima.');
    return;
  }

  console.log(`\n✅ Token obtido: ${token.substring(0, 30)}...`);
  console.log('\n========== TESTANDO ENDPOINTS COM TOKEN ==========\n');

  const authH = { ...H, 'Authorization': `Token ${token}` };
  const authHBearer = { ...H, 'Authorization': `Bearer ${token}` };

  // Testa pizza com Token
  const p1 = http.get(`${BASE_URL}/api/pizza`, { headers: authH });
  console.log(`[pizza GET Token ] status: ${p1.status} | body: ${p1.body ? p1.body.substring(0, 300) : ''}`);
  sleep(0.2);

  // Testa pizza com Bearer
  const p2 = http.get(`${BASE_URL}/api/pizza`, { headers: authHBearer });
  console.log(`[pizza GET Bearer] status: ${p2.status} | body: ${p2.body ? p2.body.substring(0, 300) : ''}`);
  sleep(0.2);

  // Testa pizza com POST
  const p3 = http.post(`${BASE_URL}/api/pizza`, JSON.stringify({}), { headers: authH });
  console.log(`[pizza POST Token] status: ${p3.status} | body: ${p3.body ? p3.body.substring(0, 300) : ''}`);
  sleep(0.2);

  // Testa ratings
  const r1 = http.get(`${BASE_URL}/api/ratings`, { headers: authH });
  console.log(`[ratings GET Token] status: ${r1.status} | body: ${r1.body ? r1.body.substring(0, 300) : ''}`);
  sleep(0.2);

  console.log('\n========== FIM DO DIAGNÓSTICO ==========');
  console.log('Copie o resultado acima e envie para análise.');
}
