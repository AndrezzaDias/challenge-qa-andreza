# +A Educação - Time de Qualidade
[![N|Solid](https://maisaedu.com.br/hubfs/site-grupo-a/logo-mais-a-educacao.svg)](https://maisaedu.com.br/)  

# Challenge-QA  

O objetivo deste desafio é avaliar principalmente as competências de **análise e escrita de cenários de testes**, mas também será **muito valorizado** demonstrar conhecimento prático em automação e performance.  

---

## Etapa 1 – Documentação (Obrigatória)  
1.1. Crie um Projeto .Net para a **documentação dos cenários de testes**.  

**Especificações Técnicas (para documentação e escrita):**  
- Projeto em .Net8.0  
- Reqnroll  
- Nunit  

1.2. Explore os fluxos presentes na aplicação Subscriptions e identifique regras e requisitos.  
   - Acesse a aplicação [aqui](https://developer.grupoa.education/subscription).  
   - Caso encontre algo que considere bug, reporte em um arquivo chamado `BUGS.md`.  

1.3. Utilizando todos os elementos do Gherkin, descreva em cenários as regras e requisitos identificados no item 1.2.  
   - Os cenários devem ser versionados no projeto .Net criado no item 1.1, seguindo os padrões do Reqnroll.  

1.4. Inclua um arquivo chamado `DATA.md` descrevendo a estratégia que você utilizaria em relação à criação e uso da massa de dados de testes (considerando futura persistência em PostgreSQL).  

👉 **Entrega obrigatória mínima:** análise, escrita, documentação e report de bugs.  

---

## Etapa 2 – Automação (Muito valorizado)  
Para se destacar, demonstre conhecimento em automação dos cenários:  

2.1. Utilizando os cenários descritos na Etapa 1, implemente a automação dos mesmos com:  
- Reqnroll  
- Selenium  
- NUnit  

2.2. Diferencial:  
- Componentizar os elementos das páginas com Selenium e reutilizar estes componentes na automação.  
- Execução dos testes em paralelo utilizando 3 diferentes navegadores.  
- Utilizar Selenium Grid com Docker Compose.  

---

## Etapa 3 – Performance (Muito valorizado)  
Demonstre conhecimento em testes de carga e performance:  

3.1. Criar ao menos 3 cenários de teste de performance simulando cargas de 100, 500 e 1000 usuários simultâneos.  
   - Teste, no mínimo, os seguintes endpoints:  
     - `/flip_coin.php`  
     - `/my_messages.php`  

3.2. Criar um projeto de teste de carga usando k6 para avaliar as APIs disponíveis [aqui](https://test.k6.io/).  

   - 3.2.1. Crie scripts de teste com k6 para os cenários criados no item 3.1.  
   - 3.2.2. Descreva em um arquivo chamado `k6-data.md` a estratégia de massa de dados de testes com o K6.  
   - 3.2.3. Gere os resultados em HTML e envie junto com relatório de análise de desempenho.  

---

# Critérios de avaliação  
- **Obrigatório (Etapa 1):**  
  - Cenários identificados  
  - Bugs identificados  
  - Qualidade da escrita e uso adequado da sintaxe Gherkin  
  - Aplicação da técnica BRIEF  
  - Boas práticas de escrita de cenários  
  - Organização do projeto  
  - Validações realizadas  
  - Qualidade no report de bugs  

- **Diferencial (Etapas 2 e 3):**  
  - Uso de recursos do Reqnroll e Selenium para automação  
  - Componentização dos elementos das páginas com Selenium  
  - Execução dos testes em paralelo em diferentes navegadores  
  - Testes de performance com k6 
  - Utilizar Selenium Grid com Docker Compose  
  - Entregar todas as atividades propostas da Etapa 3  

---

# Instruções de entrega  
1. Crie um fork do repositório no seu GitHub, deixando a visibilidade do projeto como pública.  
2. Faça o push do código/documentação desenvolvidos no seu GitHub.  
3. Inclua um arquivo chamado `COMMENTS.md` explicando:  
   - Decisões da arquitetura utilizada  
   - Lista de bibliotecas de terceiros utilizadas  
   - O que você melhoraria se tivesse mais tempo  
   - Quais requisitos obrigatórios não foram entregues  
4. Você tem 7 dias para entregar o desafio. Informe ao recrutador quando concluí-lo, enviando junto o link do repositório.  
5. Após revisão do projeto junto com a equipe técnica, deixe seu repositório privado.  
