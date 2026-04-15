# language: pt

@inscricao
Funcionalidade: Inscrição completa no portal
  Como um candidato no portal de inscrições
  Quero preencher o formulário de inscrição com meus dados
  Para concluir minha inscrição no curso desejado

  # ─────────────────────────────────────────────────────────────────────
  # REGRAS DE NEGÓCIO:
  #   RN-01: Nível de ensino deve ser selecionado antes do curso
  #   RN-02: Botão "Avançar" só é habilitado após selecionar um curso
  #   RN-03: Todos os campos obrigatórios devem ser preenchidos
  #   RN-04: CPF, e-mail e telefone devem ser válidos
  #   RN-05: Área do candidato deve exibir botão de alternância de Tema
  #   RN-06: [BUG-008] Página Financeiro não possui botão de voltar
  #   RN-07: A confirmação de inscrição ocorre no primeiro login, não após navegação
  # ─────────────────────────────────────────────────────────────────────

  Contexto:
    Dado que o candidato acessa o portal de inscrições

  # ── CENÁRIO PRINCIPAL: FLUXO COMPLETO ─────────────────────────────────

  @smoke
  Cenário: Inscrição concluída com sucesso ao fazer login pela primeira vez
    Quando seleciona o nível de ensino "Graduação"
    E seleciona o curso "Administração"
    E clica em avançar na etapa de curso
    E preenche os dados pessoais com dados válidos
    E clica em avançar na etapa de dados pessoais
    E confirma a página de login do candidato
    Então a inscrição é concluída com sucesso
    E valida o botão de Tema na área do candidato
    E acessa minhas inscrições
    E acessa a área financeira

  # ── CENÁRIO: TEMA ─────────────────────────────────────────────────────

  @tema
  Cenário: Botão de Tema abre menu e permite alternar entre Claro, Escuro e Sistema
    Quando seleciona o nível de ensino "Graduação"
    E seleciona o curso "Administração"
    E clica em avançar na etapa de curso
    E preenche os dados pessoais com dados válidos
    E clica em avançar na etapa de dados pessoais
    E confirma a página de login do candidato
    Então a inscrição é concluída com sucesso
    E o menu de Tema exibe as opções Claro, Escuro e Sistema
    E é possível selecionar o tema "Claro"
    E é possível selecionar o tema "Escuro"
    E é possível selecionar o tema "Sistema"

  # ── CENÁRIO: BUG-008 — FINANCEIRO SEM BOTÃO VOLTAR ───────────────────

  @bug @bug-008
  Cenário: Página Financeiro não exibe botão de voltar — BUG-008
    Quando seleciona o nível de ensino "Graduação"
    E seleciona o curso "Administração"
    E clica em avançar na etapa de curso
    E preenche os dados pessoais com dados válidos
    E clica em avançar na etapa de dados pessoais
    E confirma a página de login do candidato
    Então a inscrição é concluída com sucesso
    E acessa a área financeira sem botão de voltar
    Então a navegação de volta é feita via browser por ausência do botão
