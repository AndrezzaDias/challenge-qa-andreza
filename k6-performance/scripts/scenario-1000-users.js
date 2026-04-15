// =============================================================
// scenario-1000-users.js — 1000 Usuários (Stress Test)
// Base: https://quickpizza.grafana.com
//
// Execução:
//   k6 run scripts/scenario-1000-users.js
// Com dashboard: k6 run --out web-dashboard scripts/scenario-1000-users.js
// =============================================================

import http from 'k6/http';
import { sleep, group, check } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const BASE_URL     = 'https://quickpizza.grafana.com';
const CREATE_URL   = `${BASE_URL}/api/users`;
const LOGIN_URL    = `${BASE_URL}/api/users/token/login?set_cookie=true`;
const PIZZA_URL    = `${BASE_URL}/api/pizza`;
const RATINGS_URL  = `${BASE_URL}/api/ratings`;
const JSON_HEADERS = { 'Content-Type': 'application/json' };

const USERS = Array.from({ length: 20 }, (_, i) => ({
  username: `qpload${String(i + 1).padStart(2, '0')}`,
  password: 'Test@1234',
}));

const pizzaDuration   = new Trend('pizza_duration',   true);
const ratingsDuration = new Trend('ratings_duration', true);
const pizzaErrors     = new Rate('pizza_errors');
const ratingsErrors   = new Rate('ratings_errors');
const totalRequests   = new Counter('total_requests');

export const options = {
  scenarios: {
    stress_1000: {
      executor:         'ramping-vus',
      startVUs:         0,
      stages: [
        { duration: '2m',  target: 200  },
        { duration: '2m',  target: 500  },
        { duration: '2m',  target: 1000 },
        { duration: '5m',  target: 1000 },
        { duration: '2m',  target: 0    },
      ],
      gracefulRampDown: '60s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<6000', 'p(99)<10000'],
    http_req_failed:   ['rate<0.10'],
    pizza_duration:    ['p(95)<5000'],
    ratings_duration:  ['p(95)<6000'],
    pizza_errors:      ['rate<0.10'],
    ratings_errors:    ['rate<0.10'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export function setup() {
  console.log(`\nSetup: criando ${USERS.length} usuários e autenticando...\n`);
  const tokens = [];

  USERS.forEach((u) => {
    const createRes = http.post(CREATE_URL,
      JSON.stringify({ username: u.username, password: u.password }),
      { headers: JSON_HEADERS }
    );
    const criado   = createRes.status === 201;
    const jaExiste = createRes.status === 400 || createRes.status === 409;
    if (!criado && !jaExiste) {
      console.error(`  ✗ Criar ${u.username}: HTTP ${createRes.status}`);
    }
    sleep(0.15);

    const loginRes = http.post(LOGIN_URL,
      JSON.stringify({ username: u.username, password: u.password }),
      { headers: JSON_HEADERS }
    );
    if (loginRes.status === 200) {
      try {
        const token = JSON.parse(loginRes.body).token;
        if (token) { tokens.push(token); console.log(`  ✓ ${u.username}`); }
      } catch (e) {}
    } else {
      console.error(`  ✗ Login ${u.username}: HTTP ${loginRes.status} — ${loginRes.body}`);
    }
    sleep(0.15);
  });

  console.log(`\n✅ Setup: ${tokens.length}/${USERS.length} tokens prontos.\n`);
  if (tokens.length === 0) throw new Error('Nenhum token obtido!');
  return tokens;
}

export default function (tokens) {
  if (!tokens || tokens.length === 0) { sleep(1); return; }
  const token = tokens[(__VU - 1) % tokens.length];
  const authH = { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` };

  group('pizza_endpoint', function () {
    const res = http.post(PIZZA_URL, JSON.stringify({}), { headers: authH, tags: { name: 'POST_pizza' } });
    pizzaDuration.add(res.timings.duration);
    const ok = check(res, {
      'pizza status 2xx':     (r) => r.status >= 200 && r.status < 300,
      'pizza duration < 3s':  (r) => r.timings.duration < 3000,
      'pizza body not empty': (r) => r.body && r.body.length > 0,
    });
    pizzaErrors.add(!ok); totalRequests.add(1);
  });

  sleep(Math.random() * 0.7 + 0.3);

  group('ratings_endpoint', function () {
    const res = http.get(RATINGS_URL, { headers: authH, tags: { name: 'GET_ratings' } });
    ratingsDuration.add(res.timings.duration);
    const ok = check(res, {
      'ratings status 2xx':     (r) => r.status >= 200 && r.status < 300,
      'ratings duration < 3s':  (r) => r.timings.duration < 3000,
      'ratings body not empty': (r) => r.body && r.body.length > 0,
    });
    ratingsErrors.add(!ok); totalRequests.add(1);
  });

  sleep(Math.random() * 1 + 0.5);
}

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  return {
    'reports/report-1000-users.html': htmlReport(data, { title: 'Cenário 1000 Usuários (Stress) — quickpizza.grafana.com' }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
