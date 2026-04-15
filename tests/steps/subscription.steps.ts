import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'
import { dadosValidos } from '../fixtures/testData'

const { Given, When, Then } = createBdd()

const credenciaisDoCandidato = { usuario: '', senha: '' }
export { credenciaisDoCandidato }

// ── CONTEXTO ──────────────────────────────────────────────────────────

Given('que o candidato acessa o portal de inscrições', async ({ page }) => {
  await page.goto('https://developer.grupoa.education/subscription/')
})

// ── ETAPA 1: SELEÇÃO DE CURSO ─────────────────────────────────────────

When('seleciona o nível de ensino {string}', async ({ page }, nivel: string) => {
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: nivel, exact: true }).click()
})

When('seleciona o curso {string}', async ({ page }, curso: string) => {
  await page.getByTestId('graduation-combo').click()
  await page.getByRole('option', { name: curso }).click()
})

When('clica em avançar na etapa de curso', async ({ page }) => {
  await page.getByTestId('next-button').click()
})

// ── ETAPA 2: DADOS PESSOAIS ────────────────────────────────────────────

When('preenche os dados pessoais com dados válidos', async ({ page }) => {
  const d = dadosValidos

  await page.getByTestId('cpf-input').fill(d.cpf)
  await page.getByTestId('name-input').fill(d.nome)
  await page.getByTestId('surname-input').fill(d.sobrenome)
  await page.getByTestId('social-name-input').fill(d.nomeSocial)
  await page.getByTestId('email-input').fill(d.email)
  await page.getByTestId('cellphone-input').fill(d.celular)
  await page.getByTestId('phone-input').fill(d.telefone)

  // Endereço
  await page.getByTestId('cep-input').fill(d.cep)
  await page.waitForTimeout(1500); // aguarda API de CEP

  const enderecoInput = page.getByTestId('address-input')
  if (!(await enderecoInput.inputValue())) await enderecoInput.fill(d.endereco)

  await page.getByTestId('complement-input').fill(d.complemento)

  const bairroInput = page.getByTestId('neighborhood-input')
  if (!(await bairroInput.inputValue())) await bairroInput.fill(d.bairro)

  const cidadeInput = page.getByTestId('city-input')
  if (!(await cidadeInput.inputValue())) await cidadeInput.fill(d.cidade)

  const estadoInput = page.getByTestId('state-input')
  if (!(await estadoInput.inputValue())) await estadoInput.fill(d.estado)

  await page.getByTestId('country-input').fill(d.pais)
})

When('clica em avançar na etapa de dados pessoais', async ({ page }) => {
  await page.getByTestId('next-button').click()
})

When('confirma a página de login do candidato', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Sua jornada começa aqui!' })).toBeVisible()

  const usuario = await page.getByText('candidato', { exact: true }).textContent()
  const senha   = await page.getByText('subscription', { exact: true }).textContent()

  credenciaisDoCandidato.usuario = usuario?.trim() ?? ''
  credenciaisDoCandidato.senha   = senha?.trim() ?? ''

  await page.getByTestId('next-button').click()

  await expect(page.getByRole('heading', { name: 'Autenticação' })).toBeVisible()
  await expect(page.getByTestId('username-input')).toBeVisible()
  await expect(page.getByTestId('password-input')).toBeVisible()

  await page.getByTestId('username-input').fill(credenciaisDoCandidato.usuario)
  await page.getByTestId('password-input').fill(credenciaisDoCandidato.senha)
  await page.getByTestId('login-button').click()
})

// ── RESULTADO IMEDIATO: INSCRIÇÃO CONCLUÍDA ────────────────────────────
//
// RN-07: A validação de "inscrição concluída" ocorre no primeiro login,
// logo após o candidato autenticar com as credenciais geradas.
// NÃO é validada ao final da navegação (Minhas Inscrições / Financeiro).

Then('a inscrição é concluída com sucesso', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Bem-vindo, Candidato!' })
  ).toBeVisible({ timeout: 8000 })
})

// ── ETAPA 3: ÁREA DO CANDIDATO — TEMA ────────────────────────────────
//
// O botão "Tema" abre um dropdown com três opções de menu:
//   • Claro   → getByRole('menuitem', { name: 'Claro' })
//   • Escuro  → getByRole('menuitem', { name: 'Escuro' })
//   • Sistema → getByRole('menuitem', { name: 'Sistema' })

When('valida o botão de Tema na área do candidato', async ({ page }) => {
  const botaoTema = page.getByRole('button', { name: 'Tema' })
  await expect(botaoTema).toBeVisible()
  await expect(botaoTema).toBeEnabled()
})

Then('o menu de Tema exibe as opções Claro, Escuro e Sistema', async ({ page }) => {
  const botaoTema = page.getByRole('button', { name: 'Tema' })
  await expect(botaoTema).toBeVisible()
  await expect(botaoTema).toBeEnabled()

  // Abre o menu
  await botaoTema.click()

  // Valida que os três menu-items estão visíveis
  await expect(page.getByRole('menuitem', { name: 'Claro' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Escuro' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Sistema' })).toBeVisible()

  // Fecha o menu sem selecionar (pressiona Escape)
  await page.keyboard.press('Escape')
})

Then('é possível selecionar o tema {string}', async ({ page }, tema: string) => {
  // Abre o menu de tema
  await page.getByRole('button', { name: 'Tema' }).click()

  // Seleciona a opção desejada
  const opcao = page.getByRole('menuitem', { name: tema })
  await expect(opcao).toBeVisible()
  await opcao.click()

  // Verifica que o menu fechou (a opção não está mais visível)
  await expect(opcao).not.toBeVisible()

  // Verifica que o botão de tema ainda existe (tema foi aplicado, mas sem erro)
  await expect(page.getByRole('button', { name: 'Tema' })).toBeVisible()
})

// ── ETAPA 4: NAVEGAÇÃO NA ÁREA DO CANDIDATO ───────────────────────────

When('acessa minhas inscrições', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Minhas inscrições' })).toBeVisible()
  await page.getByRole('link', { name: 'Minhas inscrições' }).click()

  await expect(page.getByRole('heading', { name: 'Minhas inscrições' })).toBeVisible()
  await expect(page.getByTestId('back-button')).toBeVisible()
  await page.getByTestId('back-button').click()
})

/**
 * BUG-008: A página Financeiro não possui botão de voltar.
 * Workaround: usa page.goBack() após validar o acesso.
 */
When('acessa a área financeira', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Financeiro' })).toBeVisible()
  await page.getByRole('link', { name: 'Financeiro' }).click()

  await expect(page.getByRole('heading', { name: /Financeiro/i })).toBeVisible()

  // BUG-008: Não existe botão de voltar nesta página.
  // Workaround: navegar via histórico do browser.
  await page.goBack()

  await expect(page.getByRole('heading', { name: 'Bem-vindo, Candidato!' })).toBeVisible()
})

/**
 * Cenário isolado BUG-008.
 * Acessa Financeiro e documenta ausência do botão de voltar.
 */
When('acessa a área financeira sem botão de voltar', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Financeiro' })).toBeVisible()
  await page.getByRole('link', { name: 'Financeiro' }).click()

  await expect(page.getByRole('heading', { name: /Financeiro/i })).toBeVisible()

  // Confirma que o botão de voltar NÃO existe (bug documentado BUG-008)
  await expect(page.getByTestId('back-button')).not.toBeVisible()
  await expect(page.getByRole('button', { name: /voltar/i })).not.toBeVisible()
})

Then('a navegação de volta é feita via browser por ausência do botão', async ({ page }) => {
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Bem-vindo, Candidato!' })).toBeVisible()
})
