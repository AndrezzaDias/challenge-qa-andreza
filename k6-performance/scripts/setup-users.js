// =============================================================
// setup-users.js
// Cria os usuários de teste no quickpizza.grafana.com
// RODE ESTE SCRIPT PRIMEIRO, antes dos testes de carga!
//
// Execução:
//   k6 run scripts/setup-users.js
// =============================================================

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL    = 'https://quickpizza.grafana.com';
const LOGIN_URL   = `${BASE_URL}/api/users/token/login?set_cookie=true`;
const CREATE_URL  = `${BASE_URL}/api/users`;
const HEADERS     = { 'Content-Type': 'application/json' };

// Mesmos usuários do data/users.json
const USERS = Array.from({ length: 20 }, (_, i) => ({
  username: `andreza${String(i + 1).padStart(2, '0')}`,
  password: 'Senha@123',
  id: i + 1,
}));

export const options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  console.log('=== Criando usuários de teste no quickpizza.grafana.com ===\n');

  let criados = 0;
  let jaExistem = 0;
  let erros = 0;

  USERS.forEach((u) => {
    // Payload conforme documentação do quickpizza:
    // chaves: user, username, password, id
    const payload = JSON.stringify({
      user:     u.username,
      username: u.username,
      password: u.password,
      id:       u.id,
    });

    const res = http.post(CREATE_URL, payload, { headers: HEADERS });

    if (res.status === 200 || res.status === 201) {
      console.log(`✓ Criado: ${u.username}`);
      criados++;
    } else if (res.status === 409 || res.status === 400) {
      // Usuário já existe — tenta logar para confirmar
      const loginRes = http.post(
        LOGIN_URL,
        JSON.stringify({ username: u.username, password: u.password }),
        { headers: HEADERS }
      );
      if (loginRes.status === 200) {
        console.log(`~ Já existe e login OK: ${u.username}`);
        jaExistem++;
      } else {
        console.error(`✗ Conflito e login falhou: ${u.username} (${res.status})`);
        erros++;
      }
    } else {
      console.error(`✗ Erro ao criar ${u.username}: HTTP ${res.status} — ${res.body}`);
      erros++;
    }

    sleep(0.3);
  });

  console.log(`\n=== Resultado ===`);
  console.log(`✓ Criados agora : ${criados}`);
  console.log(`~ Já existiam   : ${jaExistem}`);
  console.log(`✗ Erros         : ${erros}`);
  console.log(`\nTotal prontos para teste: ${criados + jaExistem} / ${USERS.length}`);

  if (criados + jaExistem === USERS.length) {
    console.log('\n✅ Todos os usuários prontos! Pode rodar os cenários de teste.');
  } else {
    console.log('\n⚠️  Alguns usuários falharam. Verifique os erros acima antes de rodar os testes.');
  }
}
