/**
 * autenticacao.steps.ts
 *
 * Step definitions para features/autenticacao.feature.
 * Cobre:
 *   - Senha incorreta → getByText('Senha inválida')
 *   - Usuário incorreto → getByText('Usuário inválido')
 *   - Campos em branco → mensagens de obrigatoriedade
 *   - Recuperação de usuário → getByRole('heading', { name: 'Usuário recuperado' })
 *   - Recuperação de senha → heading de sucesso
 *   - Login bem-sucedido → 'Bem-vindo, Candidato!'
 *   - BUG-010 → senha inválida não deve exibir mensagem de usuário inválido
 */

import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'
import { navegarAteTelaDeAutenticacao } from '../support/registrationHelper'

const { Given, When, Then } = createBdd()

// Armazena as credenciais válidas lidas durante o Background
const credenciaisValidas = { usuario: '', senha: '' }

// ── CONTEXTO / BACKGROUND ─────────────────────────────────────────────

Given(
  'que o candidato completou o cadastro e está na tela de autenticação',
  async ({ page }) => {
    const credenciais = await navegarAteTelaDeAutenticacao(page)
    credenciaisValidas.usuario = credenciais.usuario
    credenciaisValidas.senha   = credenciais.senha
  }
)

// ── AÇÕES: PREENCHIMENTO DE CREDENCIAIS ───────────────────────────────

/** Usuário válido do Background + senha ERRADA passada no step */
When(
  'informa o usuário válido com a senha incorreta {string}',
  async ({ page }, senhaErrada: string) => {
    await page.getByTestId('username-input').fill(credenciaisValidas.usuario)
    await page.getByTestId('password-input').fill(senhaErrada)
  }
)

/** Usuário e senha arbitrários (inexistente) */
When(
  'informa o usuário {string} e a senha {string}',
  async ({ page }, usuario: string, senha: string) => {
    await page.getByTestId('username-input').fill(usuario)
    await page.getByTestId('password-input').fill(senha)
  }
)

/** Credenciais válidas geradas no Background */
When('informa as credenciais exibidas no cadastro', async ({ page }) => {
  await page.getByTestId('username-input').fill(credenciaisValidas.usuario)
  await page.getByTestId('password-input').fill(credenciaisValidas.senha)
})

/** Preenche apenas a senha sem informar o usuário */
When('preenche apenas a senha {string} sem informar o usuário', async ({ page }, senha: string) => {
  await page.getByTestId('username-input').fill('')
  await page.getByTestId('password-input').fill(senha)
})

/** Preenche apenas o usuário válido sem informar a senha */
When('preenche apenas o usuário válido sem informar a senha', async ({ page }) => {
  await page.getByTestId('username-input').fill(credenciaisValidas.usuario)
  await page.getByTestId('password-input').fill('')
})

/** Campos completamente em branco antes de clicar em entrar */
When('tenta entrar sem preencher usuário e senha', async ({ page }) => {
  await page.getByTestId('username-input').fill('')
  await page.getByTestId('password-input').fill('')
  await page.getByTestId('login-button').click()
})

// ── AÇÕES: SUBMISSÃO ─────────────────────────────────────────────────

When('clica no botão de entrar', async ({ page }) => {
  await page.getByTestId('login-button').click()
})

// ── AÇÕES: RECUPERAÇÃO ────────────────────────────────────────────────

// steps de recuperação de usuário e senha foram unificados em:
// When('clica no link {string}') — usa getByRole('link', { name: nomeLink })
// Os links exatos na tela de autenticação são:
//   • "Recuperar usuário"  (ao lado do campo Usuário)
//   • "Redefinir senha"    (ao lado do campo Senha)

// ── VERIFICAÇÕES — MENSAGENS DE ERRO ESPECÍFICAS ──────────────────────

/**
 * RN-AUTH-02: senha errada → exibe exatamente "Senha inválida"
 */
Then('a mensagem {string} é exibida', async ({ page }, mensagem: string) => {
  await expect(page.getByText(mensagem)).toBeVisible({ timeout: 5000 })
})

/**
 * BUG-010: ao errar somente a senha, NÃO deve aparecer "Usuário inválido"
 */
Then('a mensagem {string} não deve aparecer junto', async ({ page }, mensagem: string) => {
  // Aguarda um tempo para garantir que todas as mensagens renderizaram
  await page.waitForTimeout(1000)
  await expect(page.getByText(mensagem)).not.toBeVisible()
})

/** Permanece na tela de autenticação após falha */
Then('o candidato permanece na tela de autenticação', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Autenticação' })).toBeVisible()
  await expect(page.getByTestId('login-button')).toBeVisible()
})

/** Campo usuário sinalizando obrigatoriedade */
Then('a mensagem de campo obrigatório do usuário é exibida', async ({ page }) => {
  // Aceita tanto texto inline quanto aria-invalid no campo
  const indicador = page
    .getByText(/usuário.*obrigatório|informe.*usuário|campo.*obrigatório/i)
    .or(page.locator('[data-testid="username-input"][aria-invalid="true"]'))
    .or(page.locator('[data-testid="username-error"]'))
    .first()

  await expect(indicador).toBeVisible({ timeout: 3000 })
})

/** Campo senha sinalizando obrigatoriedade */
Then('a mensagem de campo obrigatório da senha é exibida', async ({ page }) => {
  const indicador = page
    .getByText(/senha.*obrigatória|informe.*senha|campo.*obrigatório/i)
    .or(page.locator('[data-testid="password-input"][aria-invalid="true"]'))
    .or(page.locator('[data-testid="password-error"]'))
    .first()

  await expect(indicador).toBeVisible({ timeout: 3000 })
})

/**
 * Clica em um link pelo nome exato.
 * Usado para clicar em "Redefinir senha" após ele aparecer na página.
 */
When('clica no link {string}', async ({ page }, nomeLink: string) => {
  const link = page.getByRole('link', { name: nomeLink })
  await expect(link).toBeVisible({ timeout: 5000 })
  await link.click()
})

// ── VERIFICAÇÕES — RECUPERAÇÃO ────────────────────────────────────────

/**
 * RN-AUTH-06: após clicar em recuperar usuário,
 * o heading exato "Usuário recuperado" deve ser exibido na página.
 */
Then('o heading {string} é exibido na página', async ({ page }, heading: string) => {
  await expect(
    page.getByRole('heading', { name: heading })
  ).toBeVisible({ timeout: 8000 })
})

/**
 * Após clicar em recuperar senha, o link "Redefinir senha" deve aparecer na página.
 * Valida com: getByRole('link', { name: 'Redefinir senha' })
 */
Then('o link {string} é exibido na página', async ({ page }, nomeLink: string) => {
  await expect(
    page.getByRole('link', { name: nomeLink })
  ).toBeVisible({ timeout: 8000 })
})

/**
 * BUG: Ao clicar em "Redefinir senha", a página apresenta comportamento inesperado.
 * O formulário de redefinição não é exibido corretamente.
 * Este step documenta o bug — o teste falha quando o bug for corrigido.
 */
Then('a página de redefinição de senha apresenta erro ou comportamento inesperado', async ({ page }) => {
  await page.waitForTimeout(2000)

  const formularioRedefinicao = page.getByRole('heading', { name: /redefinir senha|nova senha|criar senha/i })
  const campoNovaSenha = page
    .getByTestId('new-password-input')
    .or(page.getByRole('textbox', { name: /nova senha/i }))

  const temFormulario = await formularioRedefinicao.isVisible().catch(() => false)
  const temCampo      = await campoNovaSenha.isVisible().catch(() => false)

  if (!temFormulario && !temCampo) {
    console.warn('[BUG] Clique em "Redefinir senha" não levou ao formulário de redefinição.')
  }

  // Falha quando o bug for corrigido (formulário aparecer corretamente)
  expect(temFormulario || temCampo).toBeFalsy()
})

// ── VERIFICAÇÕES — LOGIN BEM-SUCEDIDO ────────────────────────────────

Then('é redirecionado para a área do candidato', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Bem-vindo, Candidato!' })
  ).toBeVisible({ timeout: 8000 })
})

Then('a mensagem de boas-vindas é exibida', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Bem-vindo, Candidato!' })
  ).toBeVisible()
})
