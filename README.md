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
```bash
accessToken=SEU_ACCESS_TOKEN_MERCADO_PAGO
publicKey=SUA_PUBLIC_KEY_MERCADO_PAGO
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-chave-de-aplicacao-google
DB_URI=sua-string-de-conexao-mongodb-atlas
JWT_SECRET=sua-chave-secreta-jwt
```
### 4. Segurança e Webhooks
SSL Local (mkcert):

    Instale o mkcert.

    Na raiz do projeto, execute: mkcert localhost.

    Isso permitirá rodar a aplicação em https://localhost:3000.

Túnel Externo (Ngrok):

    O Mercado Pago precisa de uma URL pública para te avisar sobre os pagamentos.

    Na pasta onde instalou o Ngrok, execute:
    Bash

    ngrok http https://localhost:3000

    Copie a URL https gerada pelo Ngrok.

Configuração no Mercado Pago:

    Acesse seu Painel de Desenvolvedor no Mercado Pago.

    Em Notificações > Webhooks, cole a URL do Ngrok seguida de /pagamento/webhook.

    Exemplo: https://xxxx-xxx.ngrok-free.app/pagamento/webhook.

    Selecione o evento Pagamentos (payments) e salve.

## 🚀 Inicializando a aplicação
 
```bash
# Rode: nodemon start
##isso iniciará a aplicação
```
### Criação do primeiro usuário do sistema
```bash
Criar Primeiro Usuário (via Postman/Insomnia)

Como as rotas de compra são protegidas, você precisa criar um usuário e logar. Utilize uma ferramenta como o Postman:

    Método: POST

    URL: https://localhost:3000/cadastro

    Body (JSON):

JSON

{
    "nome": "Test",
    "email": "Test@gmail.com",
    "senha": "123"
}
```

## 🕹️ Funcionamento do sistema

    Carrinho: O usuário adiciona os produtos desejados.

    Checkout: O Mercado Pago processa o pagamento (Pix, Boleto ou Cartão).

    Webhook: Assim que aprovado, o servidor recebe a notificação, reduz a quantidade do produto no banco de dados e busca a key correspondente.

    Entrega: O sistema envia automaticamente um e-mail para o usuário logado contendo a chave do jogo.

    Finalização: Ao retornar para a página de produtos, o carrinho é esvaziado automaticamente e um alerta de sucesso é exibido por 3 segundos.


