# ─────────────────────────────────────────────────────────────────────
# Dockerfile — Challenge QA +A Educação
#
# Usa a imagem oficial do Playwright que já inclui:
#   • Node.js (versão LTS)
#   • Chromium, Firefox e WebKit + todas as dependências do SO
#
# Isso elimina a necessidade de instalar browsers manualmente.
# ─────────────────────────────────────────────────────────────────────

FROM mcr.microsoft.com/playwright:v1.49.0-jammy

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (cache layer)
COPY package.json package-lock.json ./

# Instala dependências do Node (sem devDependencies em produção,
# mas aqui precisamos de todas pois são ferramentas de teste)
RUN npm ci

# Copia o restante do código do projeto
COPY . .

# Variável de ambiente para indicar que está rodando em CI/container
ENV CI=true

# Comando padrão: gera os specs BDD e executa os testes nos 3 browsers
CMD ["sh", "-c", "npx bddgen && npx playwright test --reporter=list,html,junit"]
