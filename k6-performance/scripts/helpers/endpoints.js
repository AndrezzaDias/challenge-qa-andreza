// =============================================================
// helpers/endpoints.js
// Constantes e funções auxiliares compartilhadas entre cenários
// Base URL: https://quickpizza.grafana.com
// =============================================================

import { check } from 'k6';

export const BASE_URL = 'https://quickpizza.grafana.com';

export const ENDPOINTS = {
  // Equivalente ao /flip_coin.php — GET autenticado
  pizza:      `${BASE_URL}/api/pizza`,

  // Equivalente ao /my_messages.php — requer autenticação
  ratings:    `${BASE_URL}/api/ratings`,

  // Autenticação
  login:      `${BASE_URL}/api/users/token/login`,
  createUser: `${BASE_URL}/api/users`,
};

// Cabeçalhos JSON sem autenticação
export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Accept':       'application/json',
};

// Cabeçalhos com token de autenticação
export function authHeaders(token) {
  return {
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'Authorization': `Token ${token}`,
  };
}

// Think-time aleatório entre min e max segundos
export function thinkTime(min = 1, max = 3) {
  return Math.random() * (max - min) + min;
}

// Valida resposta HTTP e emite checks nomeados
export function validateResponse(res, tag = '', expectedStatus = 200) {
  return check(res, {
    [`${tag} status ${expectedStatus}`]: (r) => r.status === expectedStatus,
    [`${tag} duration < 3s`]:            (r) => r.timings.duration < 3000,
    [`${tag} body not empty`]:           (r) => r.body && r.body.length > 0,
  });
}
