# BUGS.md — Relatório de Bugs · Portal de Inscrições

> **Aplicação:** https://developer.grupoa.education/subscription/
> **Data da análise:** Abril de 2026
> **Analista:** Andreza
> **Método:** Análise exploratória manual com inspeção via DevTools

---

## Sumário

| ID      | Componente                  | Severidade | Status |
|---------|-----------------------------|------------|--------|
| BUG-001 | Seleção de Curso            | Alta       | Aberto |
| BUG-002 | Campo Telefone              | Média      | Aberto |
| BUG-003 | Campo CEP / Endereço        | Média      | Aberto |
| BUG-004 | Campo E-mail                | Baixa      | Aberto |
| BUG-005 | Dropdown de Nível           | Média      | Aberto |
| BUG-006 | Botão Avançar               | Alta       | Aberto |
| BUG-007 | Autopreenchimento CEP       | Baixa      | Aberto |
| BUG-008 | Página Financeiro           | Alta       | Aberto |
| BUG-009 | Botão Tema                  | Baixa      | Aberto |
| BUG-010 | Tela de Autenticação        | Alta       | Aberto |
| BUG-011 | Redefinição de Senha        | Alta       | Aberto |
| BUG-012 | Minhas Inscrições           | Alta       | Aberto |
| BUG-013 | Validação do Campo CEP      | Média      | Aberto |

---

## Detalhamento dos Bugs

---

### BUG-001 · Cursos de Pós-Graduação exibidos em Graduação

**Componente:** Etapa 1 — Seleção de Curso
**Severidade:** Alta

**Descrição:**
Ao selecionar o nível "Graduação" e abrir o combo de cursos a lista exibe opções que pertencem exclusivamente à Pós-Graduação: "Mestrado em Ciência da Computação", "Mestrado em Engenharia de Software", "Mestrado em Inteligência Artificial", "Doutorado em Ciência da Computação", "Especialização em Segurança da Informação" entre outros

**Passos para Reproduzir:**
1. Acessar o portal de inscrições
2. Selecionar o nível "Graduação"
3. Clicar no combo de cursos
4. Observar que os primeiros itens da lista são de Mestrado/Doutorado/Especialização

**Resultado Obtido:**
A lista de cursos de Graduação exibe cursos de Pós-Graduação no início da seleção

**Resultado Esperado:**
A lista deve conter apenas cursos de Graduação

**Impacto:**
Candidato pode se inscrever no nível errado gerando inscrições inválidas

---

### BUG-002 · Campo Telefone aceita sequência inválida de zeros

**Componente:** Etapa 2 — Formulário de Dados Pessoais
**Severidade:** Média

**Descrição:**
O campo de telefone aceita valores como "00000000000" (onze zeros) sem exibir mensagem de erro permitindo que o formulário avance com um número inválido

**Passos para Reproduzir:**
1. Avançar para a etapa de dados pessoais
2. Inserir "00000000000" no campo Telefone
3. Clicar fora do campo
4. Observar ausência de validação

**Resultado Obtido:**
Nenhuma mensagem de erro e o formulário permite avançar

**Resultado Esperado:**
Exibir mensagem de erro indicando número de telefone inválido

**Impacto:**
Dados inválidos persistem no banco impossibilitando contato com o candidato

---

### BUG-003 · Campos de endereço não são limpos ao alterar o CEP

**Componente:** Etapa 2 — Seção de Endereço
**Severidade:** Média

**Descrição:**
Após o autopreenchimento do endereço via CEP válido ao apagar ou substituir o CEP os campos de logradouro e complemento são esvaziados mas os campos de cidade e estado permanecem com os dados do CEP anterior. Com um CEP inválido como "99999-999" digitado os campos Cidade e Estado mantiveram os valores "Salvador" e "BA" da busca anterior

**Passos para Reproduzir:**
1. Digitar CEP válido "41204-029" e aguardar autopreenchimento
2. Apagar o CEP e digitar "99999-999"
3. Observar os campos Cidade e Estado

**Resultado Obtido:**
Logradouro fica vazio mas Cidade ("Salvador") e Estado ("BA") permanecem com dados do CEP anterior

**Resultado Esperado:**
Ao alterar o CEP todos os campos de endereço dependentes devem ser limpos

**Impacto:**
Candidato pode submeter endereço inconsistente com o CEP informado

---

### BUG-004 · Validação de e-mail disparada durante a digitação

**Componente:** Etapa 2 — Campo E-mail
**Severidade:** Baixa

**Descrição:**
A mensagem "Email inválido" aparece enquanto o candidato ainda está digitando o endereço antes de sair do campo. A validação deveria ocorrer apenas após o evento de perda de foco (`onBlur`)

**Passos para Reproduzir:**
1. Clicar no campo de e-mail
2. Digitar parcialmente um e-mail (ex: "joao@em")
3. Observar a exibição antecipada da mensagem de erro

**Resultado Obtido:**
Mensagem "Email inválido" aparece durante a digitação

**Resultado Esperado:**
A mensagem deve aparecer somente após o candidato sair do campo

**Impacto:**
Experiência do usuário degradada; pode confundir o candidato durante o preenchimento

---

### BUG-005 · Dropdown fecha ao rolar a lista de opções

**Componente:** Etapa 1 — Dropdown de Seleção de Curso
**Severidade:** Média

**Descrição:**
Ao tentar rolar a lista de cursos dentro do dropdown o componente fecha inesperadamente impedindo que o candidato visualize e selecione opções que estão fora da área inicial visível

**Passos para Reproduzir:**
1. Clicar no combo de seleção de cursos
2. Tentar rolar a lista com o scroll do mouse
3. Observar que o dropdown fecha

**Resultado Obtido:**
O dropdown é fechado ao rolar exigindo que o candidato abra novamente

**Resultado Esperado:**
O scroll deve funcionar dentro do dropdown sem fechá-lo

**Impacto:**
Candidatos com cursos que não aparecem na visão inicial têm dificuldade em selecionar o desejado

---

### BUG-006 · Botão Avançar habilitado sem curso selecionado

**Componente:** Etapa 1 — Botão Avançar
**Severidade:** Alta

**Descrição:**
Ao acessar a página de seleção de curso de Graduação o botão "Avançar" permanece habilitado e clicável mesmo com o combo exibindo "Selecione um curso..." sem nenhum curso escolhido

**Passos para Reproduzir:**
1. Selecionar o nível "Graduação" na tela inicial
2. Clicar em Avançar para ir à seleção de cursos
3. Observar o botão "Avançar" sem selecionar nenhum curso

**Resultado Obtido:**
O botão "Avançar" está habilitado (ativo) mesmo sem curso selecionado

**Resultado Esperado:**
O botão deve estar desabilitado até que um curso seja selecionado

**Impacto:**
Candidato pode avançar sem selecionar curso gerando inscrição inválida ou incompleta

---

### BUG-007 · Autopreenchimento de CEP sem indicador de carregamento

**Componente:** Etapa 2 — Campo CEP
**Severidade:** Baixa

**Descrição:**
Ao digitar um CEP válido a consulta à API dos Correios ocorre em background sem nenhum feedback visual (spinner ou mensagem "Buscando..."). O candidato não tem como saber se o sistema está processando a requisição

**Passos para Reproduzir:**
1. Acessar a etapa de endereço
2. Digitar um CEP válido
3. Observar os campos durante a busca

**Resultado Obtido:**
Os campos permanecem em branco sem indicador visual enquanto a API processa

**Resultado Esperado:**
Exibir indicador de carregamento durante a consulta ao CEP

**Impacto:**
Candidato pode achar que o sistema não respondeu e tentar digitar novamente

---

### BUG-008 · Página Financeiro sem conteúdo real e sem botão de voltar

**Componente:** Área do Candidato — Página Financeiro
**Severidade:** Alta

**Descrição:**
A página Financeiro exibe apenas o texto "Financeiro" como título e "Content" como corpo indicando que a página está com conteúdo placeholder de desenvolvimento. Além disso a página não possui nenhum botão de voltar ou navegação para retornar à área do candidato

**Passos para Reproduzir:**
1. Concluir o fluxo de inscrição e fazer login
2. Clicar em "Financeiro" no menu lateral
3. Observar o conteúdo e a ausência de botão de voltar

**Resultado Obtido:**
Conteúdo da página: título "Financeiro" e texto "Content" (placeholder) sem botão de retorno

**Resultado Esperado:**
Conteúdo financeiro real do candidato com botão de voltar à área do candidato

**Impacto:**
O candidato fica preso na página sem possibilidade de navegar pela interface e a funcionalidade financeira não está implementada

---

### BUG-009 · Botão "Tema" sem aria-label acessível

**Componente:** Área do Candidato — Header
**Severidade:** Baixa

**Descrição:**
O botão de alternância de tema (ícone no canto superior direito) pode não possuir atributo `aria-label` tornando-o inacessível por leitores de tela e potencialmente não localizável por `getByRole('button', { name: 'Tema' })` em testes automatizados

**Resultado Esperado:**
```html
<button aria-label="Tema">...</button>
```

**Impacto:**
Acessibilidade comprometida e falha potencial em testes de automação por seletor semântico

---

### BUG-010 · Senha incorreta exibe mensagem dupla

**Componente:** Tela de Autenticação
**Severidade:** Alta

**Descrição:**
Ao informar o usuário correto com senha incorreta o sistema exibe simultaneamente a mensagem "Senha inválida" (correta) e uma segunda mensagem "Senha*" (indevida) que imita o padrão visual de erro de usuário inválido confundindo o candidato

**Passos para Reproduzir:**
1. Acessar a tela de autenticação
2. Preencher o usuário correto e uma senha errada
3. Clicar em Login
4. Observar as mensagens exibidas

**Resultado Obtido:**
Duas mensagens exibidas: "Senha inválida" + "Senha*"

**Resultado Esperado:**
Apenas "Senha inválida" deve ser exibida quando somente a senha está errada

**Impacto:**
Candidato é induzido a acreditar que seu usuário também está incorreto podendo tentar recuperação desnecessária

---

### BUG-011 · "Redefinir senha" redireciona para sucesso sem coletar dados

**Componente:** Tela de Autenticação — Link "Redefinir senha"
**Severidade:** Alta

**Descrição:**
Ao clicar no link "Redefinir senha" o sistema redireciona diretamente para a página `/subscription/authentication/reset-password` exibindo a mensagem "Senha redefinida / Verifique seu email!" sem solicitar nenhuma informação ao candidato (e-mail usuário CPF ou confirmação de identidade). O fluxo de redefinição de senha está completamente ausente

**Passos para Reproduzir:**
1. Acessar a tela de autenticação
2. Clicar no link "Redefinir senha"
3. Observar o comportamento

**Resultado Obtido:**
Redirecionamento imediato para página de sucesso "Senha redefinida" sem nenhuma etapa de verificação

**Resultado Esperado:**
O sistema deve solicitar e-mail ou usuário validar a identidade e só então enviar o link de redefinição

**Impacto:**
O fluxo de redefinição de senha é não funcional e representa falha de segurança pois aciona redefinição sem validação de identidade

---

### BUG-012 · "Minhas Inscrições" não exibe a inscrição recém-concluída

**Componente:** Área do Candidato — Minhas Inscrições
**Severidade:** Alta

**Descrição:**
Após concluir todo o fluxo de inscrição ao acessar "Minhas inscrições" a página exibe apenas "Verifique abaixo a lista de inscrições" sem nenhum registro. A inscrição recém-criada não aparece na listagem

**Passos para Reproduzir:**
1. Completar o fluxo de inscrição com sucesso
2. Fazer login na área do candidato
3. Clicar em "Minhas inscrições" no menu lateral
4. Observar a listagem

**Resultado Obtido:**
Página exibida sem nenhuma inscrição listada mesmo após inscrição concluída

**Resultado Esperado:**
A inscrição recém-criada deve aparecer na lista com dados do curso nível de ensino e status

**Impacto:**
O candidato não tem visibilidade das suas inscrições impossibilitando acompanhamento do processo seletivo

---

### BUG-013 · Campo CEP exibe erro de "máximo 8 caracteres" para CEP formatado

**Componente:** Etapa 2 — Campo CEP
**Severidade:** Média

**Descrição:**
Ao digitar um CEP no formato padrão com hífen (ex: "41204-029") o campo exibe a mensagem "Devem ser informados no máximo 8 caracteres". O sistema conta o hífen como um caractere totalizando 9 e rejeita o CEP formatado como inválido

**Passos para Reproduzir:**
1. Acessar a etapa de endereço
2. Digitar o CEP no formato "41204-029" (com hífen)
3. Observar a mensagem de validação abaixo do campo

**Resultado Obtido:**
Mensagem "Devem ser informados no máximo 8 caracteres" exibida com CEP válido formatado

**Resultado Esperado:**
O campo deve aceitar CEP nos formatos "41204029" e "41204-029" tratando o hífen como separador e não como caractere do limite

**Impacto:**
Candidatos que digitam o CEP no formato padrão recebem erro de validação indevido gerando confusão no preenchimento

---

## Matriz de Severidade

| Severidade | Critério |
|------------|----------|
| Alta       | Impede fluxo principal gera dados inválidos ou falha de segurança |
| Média      | Afeta experiência significativamente mas existe workaround |
| Baixa      | Problema de UX/acessibilidade não impede o uso |
