/**
 * registrationHelper.ts
 *
 * Helper compartilhado para navegar pelo fluxo completo de registro até
 * a tela de autenticação. Reutilizado tanto em subscription.steps.ts
 * quanto em autenticacao.steps.ts para evitar duplicação de código.
 */

import { Page, expect } from '@playwright/test'
import { dadosValidos } from '../fixtures/testData'

export interface CredenciaisCandidato {
  usuario: string
  senha: string
}

/**
 * Navega pelo formulário de inscrição até a tela de autenticação.
 * Retorna as credenciais exibidas na página de confirmação de cadastro.
 *
 * Fluxo coberto:
 *   1. Acessa o portal
 *   2. Seleciona nível de ensino e curso
 *   3. Preenche dados pessoais e endereço
 *   4. Lê as credenciais geradas pelo sistema ("Sua jornada começa aqui!")
 *   5. Clica em avançar → chega na tela de Autenticação
 */
export async function navegarAteTelaDeAutenticacao(page: Page): Promise<CredenciaisCandidato> {
  // ── PASSO 1: Acessar o portal ─────────────────────────────────────────
  await page.goto('https://developer.grupoa.education/subscription/')

  // ── PASSO 2: Seleção de curso ─────────────────────────────────────────
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Graduação', exact: true }).click()

  await page.getByTestId('graduation-combo').click()
  await page.getByRole('option', { name: 'Administração' }).click()

  await page.getByTestId('next-button').click()

  // ── PASSO 3: Dados pessoais ───────────────────────────────────────────
  const d = dadosValidos

  await page.getByTestId('cpf-input').fill(d.cpf)
  await page.getByTestId('name-input').fill(d.nome)
  await page.getByTestId('surname-input').fill(d.sobrenome)
  await page.getByTestId('social-name-input').fill(d.nomeSocial)
  await page.getByTestId('email-input').fill(d.email)
  await page.getByTestId('cellphone-input').fill(d.celular)
  await page.getByTestId('phone-input').fill(d.telefone)

  // Endereço com autopreenchimento via CEP
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

  await page.getByTestId('next-button').click()

  // ── PASSO 4: Leitura das credenciais geradas ──────────────────────────
  await expect(page.getByRole('heading', { name: 'Sua jornada começa aqui!' })).toBeVisible()

  const usuarioEl = page.getByText('candidato', { exact: true })
  const senhaEl   = page.getByText('subscription', { exact: true })

  const usuario = (await usuarioEl.textContent())?.trim() ?? 'candidato'
  const senha   = (await senhaEl.textContent())?.trim()   ?? 'subscription'

  // ── PASSO 5: Avança para a tela de Autenticação ───────────────────────
  await page.getByTestId('next-button').click()
  await expect(page.getByRole('heading', { name: 'Autenticação' })).toBeVisible()
  await expect(page.getByTestId('username-input')).toBeVisible()
  await expect(page.getByTestId('password-input')).toBeVisible()

  return { usuario, senha }
}
