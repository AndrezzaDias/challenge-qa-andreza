# language: pt

@validacao
Funcionalidade: Validação dos campos do formulário de inscrição
  Como um candidato no portal de inscrições
  Quero receber mensagens claras ao preencher dados incorretos
  Para corrigir os erros antes de avançar no formulário

  # ─────────────────────────────────────────────────────────────────────
  # REGRAS DE NEGÓCIO AUTOMATIZADAS:
  #   RN-VAL-01: CPF inválido exibe mensagem e impede avanço
  #   RN-VAL-02: E-mail inválido exibe mensagem "Email inválido"
  #   RN-VAL-05: Campos obrigatórios em branco bloqueiam o avanço
  #
  # BUGS IDENTIFICADOS (não automatizados — registrados em BUGS.md):
  #   BUG-001: Cursos de Pós-Graduação exibidos no nível Graduação (não reproduzido)
  #   BUG-002: Telefone aceita sequência de zeros sem validar
  #   BUG-003: Apagar CEP não limpa os campos de endereço automaticamente
  #   BUG-004: Mensagem de e-mail inválido aparece durante digitação (antes do blur)
  #   BUG-005: Dropdown fecha ao rolar a lista de opções
  #   BUG-006: Botão Avançar permanece habilitado ao trocar nível de ensino
  # ─────────────────────────────────────────────────────────────────────

  Contexto:
    Dado que o candidato acessa o portal de inscrições

  # ══════════════════════════════════════════════════════════════════════
  # CPF INVÁLIDO — mensagem e bloqueio de avanço
  # ══════════════════════════════════════════════════════════════════════

  @cpf @rn-val-01
  Esquema do Cenário: CPF inválido exibe "CPF inválido" e impede avanço
    Quando avança para a etapa de dados pessoais
    E preenche o campo CPF com "<cpf_invalido>"
    E sai do campo CPF
    Então a mensagem "CPF inválido" é exibida no formulário
    E o candidato não consegue avançar para a próxima etapa

    Exemplos:
      | cpf_invalido   | motivo                           |
      | 111.111.111-11 | Todos os dígitos iguais          |
      | 000.000.000-00 | CPF zerado                       |
      | 123.456.789-00 | Dígito verificador incorreto     |
      | 1234           | CPF incompleto (menos de 11 dig) |
      | abcdefghijk    | CPF com letras                   |

  # ══════════════════════════════════════════════════════════════════════
  # E-MAIL INVÁLIDO — mensagem de erro
  # ══════════════════════════════════════════════════════════════════════

  @email @rn-val-02
  Esquema do Cenário: E-mail inválido exibe a mensagem "Email inválido"
    Quando avança para a etapa de dados pessoais
    E preenche o campo e-mail com "<email_invalido>"
    E sai do campo e-mail
    Então a mensagem "Email inválido" é exibida no formulário

    Exemplos:
      | email_invalido    | motivo                  |
      | joao@             | Sem domínio             |
      | @dominio.com      | Sem usuário             |
      | joaodominio.com   | Sem arroba              |
      | joao@dominio      | Sem extensão de domínio |
      | joao @dominio.com | Espaço no meio          |

  # ══════════════════════════════════════════════════════════════════════
  # CAMPOS OBRIGATÓRIOS — bloqueiam o avanço do formulário
  # ══════════════════════════════════════════════════════════════════════

  @campos-obrigatorios @rn-val-05
  Esquema do Cenário: Campo obrigatório em branco bloqueia o avanço do formulário
    Quando avança para a etapa de dados pessoais
    E deixa o campo "<campo>" em branco
    E tenta avançar para a próxima etapa
    Então o campo "<campo>" exibe sinalização de obrigatório
    E o formulário não avança para a etapa seguinte

    Exemplos:
      | campo     |
      | Nome      |
      | Sobrenome |
      | E-mail    |
      | CPF       |
      | Celular   |
