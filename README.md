# +A Educação - Time de Qualidade
[![N|Solid](https://maisaedu.com.br/hubfs/site-grupo-a/logo-mais-a-educacao.svg)](https://maisaedu.com.br/)  

# Challenge QA – +A Educação

Este repositório contém o desafio técnico de QA do time de Qualidade da +A Educação.
O objetivo deste challenge é avaliar principalmente as competências de análise, identificação de regras de negócio e escrita de cenários de testes, utilizando Gherkin como linguagem padrão.
Também serão valorizados conhecimentos práticos em automação de testes e testes de performance, desde que os cenários documentados em Gherkin sejam reutilizados nessas etapas.

## 🎯 Objetivo Geral
Avaliar a capacidade do(a) candidato(a) de:

Analisar uma aplicação real
Identificar regras, requisitos e validações
Documentar cenários de testes ocm o comportamento do sistema de forma clara e objetiva
Reportar bugs com qualidade
Reutilizar os cenários Gherkin em automação
Demonstrar conhecimentos em testes de carga e performance

## 🧩 Estrutura do Desafio
O desafio está dividido em 3 etapas:

Etapa 1 – Documentação (Obrigatória)
Etapa 2 – Automação (Obrigatória)
Etapa 3 – Performance (Obrigatória)


### ✅ Etapa 1 – Documentação (Obrigatória)
1.1 Projeto de documentação de cenários
Crie um projeto dedicado à documentação dos cenários de testes, utilizando Gherkin como linguagem de especificação.
Requisitos obrigatórios:

Todos os cenários devem ser escritos em Gherkin (usando corretamente todos os elementos do Gherkin) e considerando todas as boas práticas de escrita de cenários.
Aplicar a técnica BRIEF na escrita de cenários

1.2 Análise da aplicação
Analise os fluxos da aplicação Subscriptions, disponível em:
🔗 https://developer.grupoa.education/subscription
Durante a análise, identifique:

Regras de negócio
Requisitos funcionais e não funcionais
Validações explícitas e implícitas
Fluxos principais e alternativos

Caso identifique comportamentos inesperados ou inconsistências, registre-os conforme descrito no item 1.5.

1.3 Escrita dos cenários
Com base na análise realizada:

Descreva os cenários de teste utilizando Gherkin
Os cenários devem representar as regras e requisitos identificados
A escrita deve ser clara, objetiva e focada em comportamento
Os arquivos devem seguir o padrão de projetos com Gherkin

1.4 Estratégia de dados de teste
Crie um arquivo chamado DATA.md, descrevendo a estratégia para:

Criação da massa de dados de testes
Reutilização e isolamento de dados
Considerações para futura persistência em PostgreSQL
Exclusão da massa de dados

1.5 Report de Bugs
Crie um arquivo chamado BUGS.md para documentar todos os bugs encontrados durante a análise.

✅ Entrega mínima obrigatória da Etapa 1

Análise dos fluxos
Cenários documentados em Gherkin
Estratégia de dados de teste (DATA.md)
Report de bugs (BUGS.md)


### 🤖 Etapa 2 – Automação (Obrigatória)
O objetivo desta etapa é demonstrar que os cenários escritos em Gherkin podem ser automatizados e reutilizados como contrato de comportamento.

2.1 Automação dos cenários

Utilize os mesmos arquivos Gherkin criados na Etapa 1
Implemente a automação respeitando fielmente o comportamento descrito
A escolha da stack de automação é livre (Selenium, Playwright, etc.)

2.2 Diferenciais técnicos (opcional, mas valorizado)

- Componentização e reutilização de elementos de página
- Execução de testes em paralelo
- Execução em múltiplos navegadores (mínimo de 3)
- Uso de Docker para orquestração do ambiente de testes
- Caso utilize Selenium, configuração de Selenium Grid com Docker Compose


### ⚡ Etapa 3 – Performance (Obrigatória)
3.1 Cenários de carga
Crie ao menos 3 cenários de teste de performance, simulando:

100 usuários simultâneos
500 usuários simultâneos
1000 usuários simultâneos

Escreva para, no mínimo, os seguintes endpoints:

/flip_coin.php
/my_messages.php


3.2 Testes de performance com k6
Crie um projeto de testes de carga utilizando k6, com base nas APIs disponíveis em:
🔗 https://test.k6.io/

3.2.1 Scripts

Desenvolva scripts de teste para os cenários definidos no item 3.1

3.2.2 Massa de dados

Crie um arquivo chamado k6-data.md, descrevendo a estratégia de massa de dados utilizada nos testes de performance

3.2.3 Resultados e análise

Gere relatórios em HTML
Inclua uma análise de desempenho destacando tempos de resposta, erros e comportamento sob carga


## 📊 Critérios de Avaliação
Obrigatórios (Etapa 1)

Identificação correta de regras e cenários
Qualidade da escrita dos cenários em Gherkin
Uso adequado da sintaxe Gherkin
Aplicação da técnica BRIEF
Organização do projeto
Qualidade do report de bugs

Diferenciais (Etapas 2 e 3)

Reutilização dos cenários Gherkin na automação
Boas práticas de automação
Execução paralela e cross-browser
Testes de performance bem estruturados com k6


## 📦 Instruções de Entrega
Crie um fork deste repositório em seu GitHub (repositório público).
Desenvolva o desafio conforme as etapas descritas.
Faça o push de todo o código e documentação.
Crie um arquivo chamado COMMENTS.md, contendo:

Decisões de arquitetura
Bibliotecas e ferramentas utilizadas
O que você melhoraria se tivesse mais tempo
Requisitos obrigatórios não entregues (se houver)


Você terá 7 dias para concluir o desafio.
Ao finalizar, informe o recrutador enviando o link do repositório.
Após a avaliação técnica, o repositório deverá ser tornado privado.
