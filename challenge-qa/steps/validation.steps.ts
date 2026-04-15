/**
 * validation.steps.ts
 *
 * Step definitions para features/validation.feature.
 *
 * Cenários automatizados:
 *   - CPF inválido → getByText('CPF inválido') + candidato não consegue avançar
 *   - E-mail inválido → getByText('Email inválido')
 *   - Campos obrigatórios em branco bloqueiam o avanço
 */

import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { When, Then } = createBdd()

// ── HELPER ────────────────────────────────────────────────────────────

/** Passa pela etapa 1 (seleção de curso) para chegar nos dados pessoais */
async function irParaDadosPessoais(page: any) {
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Graduação', exact: true }).click()
  await page.getByTestId('graduation-combo').click()
  await page.getByRole('option', { name: 'Administração' }).click()
  await page.getByTestId('next-button').click()
}

// ── NAVEGAÇÃO ─────────────────────────────────────────────────────────

When('avança para a etapa de dados pessoais', async ({ page }) => {
  await irParaDadosPessoais(page)
})

// ── CPF ───────────────────────────────────────────────────────────────

When('preenche o campo CPF com {string}', async ({ page }, cpf: string) => {
  await page.getByTestId('cpf-input').fill(cpf)
})

When('sai do campo CPF', async ({ page }) => {
  await page.getByTestId('cpf-input').blur()
})

/**
 * Valida a mensagem exata: getByText('CPF inválido')
 * Também usado para "Email inválido" via o mesmo step parametrizado.
 */
Then('a mensagem {string} é exibida no formulário', async ({ page }, mensagem: string) => {
  await expect(page.getByText(mensagem)).toBeVisible({ timeout: 3000 })
})

/**
 * Valida que o candidato não consegue avançar após CPF inválido.
 * Clica no botão de avançar e verifica que o formulário não mudou de etapa
 * (o campo CPF ainda está visível na tela).
 */
Then('o candidato não consegue avançar para a próxima etapa', async ({ page }) => {
  await page.getByTestId('next-button').click()

  // O campo CPF ainda visível confirma que permanecemos na etapa de dados pessoais
  await expect(page.getByTestId('cpf-input')).toBeVisible()
})

// ── E-MAIL ────────────────────────────────────────────────────────────

When('preenche o campo e-mail com {string}', async ({ page }, email: string) => {
  await page.getByTestId('email-input').fill(email)
})

When('sai do campo e-mail', async ({ page }) => {
  await page.getByTestId('email-input').blur()
})

// ── CAMPOS OBRIGATÓRIOS ───────────────────────────────────────────────

const mapeamentoCampos: Record<string, string> = {
  'Nome':      'name-input',
  'Sobrenome': 'surname-input',
  'E-mail':    'email-input',
  'CPF':       'cpf-input',
  'Celular':   'cellphone-input',
}

When('deixa o campo {string} em branco', async ({ page }, campo: string) => {
  const testId = mapeamentoCampos[campo]
  if (testId) {
    await page.getByTestId(testId).fill('')
    await page.getByTestId(testId).blur()
  }
})

When('tenta avançar para a próxima etapa', async ({ page }) => {
  await page.getByTestId('next-button').click()
})

Then('o campo {string} exibe sinalização de obrigatório', async ({ page }, campo: string) => {
  const testId = mapeamentoCampos[campo]

  const indicador = page
    .getByText(/obrigatório|required|campo.*vazio|preencha/i)
    .or(page.locator(`[data-testid="${testId}"] ~ [role="alert"]`))
    .or(page.locator(`[data-testid="${testId}-error"]`))
    .first()

  await expect(indicador).toBeVisible({ timeout: 3000 })
})

Then('o formulário não avança para a etapa seguinte', async ({ page }) => {
  // Campo CPF ainda visível confirma que permanecemos na etapa de dados pessoais
  await expect(page.getByTestId('cpf-input')).toBeVisible()
})
