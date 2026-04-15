import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'steps/**/*.ts',
})

export default defineConfig({
  testDir,

  // ── PARALELISMO ────────────────────────────────────────────────────
  // Roda todos os testes em paralelo dentro de cada arquivo
  fullyParallel: true,
  // Número de workers paralelos (ajuste conforme CPU disponível)
  // Em CI/Docker use 2; localmente pode usar mais
  workers: process.env.CI ? 2 : 4,

  // ── CONFIGURAÇÕES GERAIS ──────────────────────────────────────────
  // Falha o build se algum test.only ficou esquecido no código
  forbidOnly: !!process.env.CI,
  // Número de retentativas em caso de falha (útil em CI por flakiness)
  retries: process.env.CI ? 1 : 0,
  // Timeout por teste (ms)
  timeout: 60_000,

  // ── REPORTERS ────────────────────────────────────────────────────
  reporter: [
    // Saída legível no terminal
    ['list'],
    // Relatório HTML interativo (abre com: npx playwright show-report)
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // JUnit XML para integração com CI (GitHub Actions, Jenkins, etc.)
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // ── CONFIGURAÇÕES GLOBAIS DE BROWSER ─────────────────────────────
  use: {
    baseURL: 'https://developer.grupoa.education',
    // Captura screenshot somente em falhas
    screenshot: 'only-on-failure',
    // Grava trace na primeira tentativa que falhar
    trace: 'on-first-retry',
    // Grava vídeo somente em falhas (útil para debug em CI)
    video: 'retain-on-failure',
    // Viewport padrão
    viewport: { width: 1280, height: 720 },
    // Aguarda ações com timeout menor que o global
    actionTimeout: 15_000,
    // Aguarda navegações
    navigationTimeout: 30_000,
  },

  // ── PROJETOS: 3 NAVEGADORES OBRIGATÓRIOS ─────────────────────────
  // Exigência do desafio: execução em no mínimo 3 navegadores
  projects: [
    // 1️⃣ Chromium (Google Chrome / Edge)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // 2️⃣ Firefox
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    // 3️⃣ WebKit (Safari)
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    // ── OPCIONAL: testes em dispositivos móveis ─────────────────────
    // Descomente para incluir mobile na execução
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 13'] },
    // },
  ],

  // ── DIRETÓRIO DE RESULTADOS ───────────────────────────────────────
  outputDir: 'test-results',
})
