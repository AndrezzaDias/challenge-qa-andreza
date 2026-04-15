# language: pt

@autenticacao
Funcionalidade: Autenticação no portal de inscrições
  Como um candidato que já realizou o cadastro
  Quero me autenticar no portal com minhas credenciais
  Para acessar minha área do candidato de forma segura

  # ─────────────────────────────────────────────────────────────────────
  # REGRAS DE NEGÓCIO:
  #   RN-AUTH-01: Credenciais incorretas devem bloquear o acesso
  #   RN-AUTH-02: Mensagem "Senha inválida" deve aparecer somente para senha errada
  #   RN-AUTH-03: Mensagem "Usuário inválido" deve aparecer para usuário inexistente
  #   RN-AUTH-04: Campos de usuário e senha são obrigatórios
  #   RN-AUTH-05: O sistema deve oferecer recuperação de usuário e de senha
  #   RN-AUTH-06: Após recuperação bem-sucedida exibir heading "Usuário recuperado"
  #   [BUG-010]: Senha inválida exibe mensagem dupla ("Senha inválida" + "Senha*")
  # ─────────────────────────────────────────────────────────────────────

  Contexto:
    Dado que o candidato completou o cadastro e está na tela de autenticação

  # ── CENÁRIO 1: Senha incorreta ────────────────────────────────────────

  @senha-incorreta
  Cenário: Login com senha incorreta exibe somente a mensagem "Senha inválida"
    Quando informa o usuário válido com a senha incorreta "senhaErrada123"
    E clica no botão de entrar
    Então a mensagem "Senha inválida" é exibida
    E o candidato permanece na tela de autenticação

  # ── CENÁRIO 2: Usuário incorreto ─────────────────────────────────────

  @usuario-incorreto
  Cenário: Login com usuário inexistente exibe a mensagem "Usuário inválido"
    Quando informa o usuário "usuario_inexistente_9999" e a senha "qualquerSenha"
    E clica no botão de entrar
    Então a mensagem "Usuário inválido" é exibida
    E o candidato permanece na tela de autenticação

  # ── CENÁRIO 3: Campos em branco ───────────────────────────────────────

  @campos-vazios
  Cenário: Tentativa de login com campos em branco exibe mensagens de obrigatoriedade
    Quando tenta entrar sem preencher usuário e senha
    Então a mensagem de campo obrigatório do usuário é exibida
    E a mensagem de campo obrigatório da senha é exibida
    E o candidato permanece na tela de autenticação

  @campo-usuario-vazio
  Cenário: Tentativa de login somente com senha — campo usuário em branco
    Quando preenche apenas a senha "subscription" sem informar o usuário
    E clica no botão de entrar
    Então a mensagem de campo obrigatório do usuário é exibida
    E o candidato permanece na tela de autenticação

  @campo-senha-vazia
  Cenário: Tentativa de login somente com usuário — campo senha em branco
    Quando preenche apenas o usuário válido sem informar a senha
    E clica no botão de entrar
    Então a mensagem de campo obrigatório da senha é exibida
    E o candidato permanece na tela de autenticação

  # ── CENÁRIO 4: Recuperação de usuário ────────────────────────────────

  @recuperar-usuario
  Cenário: Candidato clica em "Recuperar usuário" e é levado à página de confirmação
    Quando clica no link "Recuperar usuário"
    Então o heading "Usuário recuperado" é exibido na página

  # ── CENÁRIO 5: Recuperação de senha ──────────────────────────────────

  @recuperar-senha @bug
  Cenário: Candidato clica em "Redefinir senha" e encontra comportamento inesperado
    Quando clica no link "Redefinir senha"
    Então a página de redefinição de senha apresenta erro ou comportamento inesperado

  # ── CENÁRIO 6: Login com credenciais válidas ──────────────────────────

  @login-sucesso
  Cenário: Login com credenciais válidas redireciona para área do candidato
    Quando informa as credenciais exibidas no cadastro
    E clica no botão de entrar
    Então é redirecionado para a área do candidato
    E a mensagem de boas-vindas é exibida

  # ── CENÁRIO 7: Mensagem dupla ao errar somente a senha ──────────────

  @bug @bug-010
  Cenário: Senha incorreta não deve exibir mensagem de usuário inválido
    Quando informa o usuário válido com a senha incorreta "senhaErrada123"
    E clica no botão de entrar
    Então a mensagem "Senha inválida" é exibida
    Mas a mensagem "Usuário inválido" não deve aparecer junto
