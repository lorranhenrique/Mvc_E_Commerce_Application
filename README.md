# 🎮 Loja Gamer - Full Stack E-Commerce

Sistema completo de e-commerce para venda de chaves de jogos digitais. A aplicação conta com fluxo automatizado de pagamento, baixa de estoque e entrega de produtos via e-mail.

## 🚀 Tecnologias Utilizadas
* **Backend:** Node.js & Express
* **Frontend:** EJS (View Engine), CSS3 & JavaScript (Vanilla)
* **Banco de Dados:** MongoDB Atlas & Mongoose
* **Segurança:** JWT (JSON Web Tokens) & Bcrypt (Hash de senhas)
* **Pagamentos:** Mercado Pago SDK (Produção)
* **E-mail:** Nodemailer (Integração com Gmail)

---

## 🛠️ Configuração Inicial

### 1. Banco de Dados (MongoDB Atlas)
1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/).
2. Crie um Cluster gratuito e configure o acesso de IP (Network Access).
3. No banco de dados, garanta a estrutura de coleções baseada nos models:
   - **Users**: `nome`, `email`, `senha`.
   - **Products**: `nome`, `quantidade`, `preco`, `imgUrl`, `key` (Chave real do jogo).

### 2. Instalação do Projeto
```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)

# Entre na pasta
cd seu-repositorio

# Instale as dependências
npm install
```

### 3. Configuração do .env
accessToken=SEU_ACCESS_TOKEN_MERCADO_PAGO
publicKey=SUA_PUBLIC_KEY_MERCADO_PAGO
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-chave-de-aplicacao-google
DB_URI=sua-string-de-conexao-mongodb-atlas
JWT_SECRET=sua-chave-secreta-jwt

### 4. Segurança e Webhooks
