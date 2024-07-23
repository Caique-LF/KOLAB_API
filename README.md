# PROJETO API KOLAB BACKEND

![Logo Kolab](./images/kolab-logo.png)

Esse projeto é um api desenvolvida para meios de avaliação em processo seletivo, nele você encotrará funcionalidades para autenticação de usuários e acesso a endpoints protegidos.

### REQUISITOS

Antes de rodar a API, certifique-se de que você tem os seguintes requisitos instalados

• Node.js (versão 14.x ou superior, preferencialmente a LTS)

• NPM ou gerenciador de pacotes de sua escolha.

• Banco de dados (Por exemplo MYSQL ou POSTGRESQL)

## Configuração do ambiente

#### 1. Clone o repositório

```bash
git clone https://github.com/Caique-LF/KOLAB_API.git
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure as variaveis de ambiente em um arquivo .env na raiz do projeto

```bash
DB_HOST=
DB_PORT=
DB_USER=
DB_NAME=
DB_PASSWORD=

JWT_SECRET=
```

## RODAR O PROJETO

#### 1. Inicie o servidor

```bash
npm run start
```

ou para desenvolvimento com automatic reload

```bash
npm run start:dev
```

## AUTENTICAÇÃO

### Registro de Usuário

Para registrar um novo usuário, envie um POST para o endpoin `/auth/register` com o corpo da requisição como objeto json com o seguinte formato:

```json
{
  "username": "João silva",
  "password": "jao1234"
}
```

Você também pode informar o idenitificador do superior(pai) caso tenha interesse de obter a arvore hierarquica.

```json
{
  "username": "João silva",
  "password": "joa01234",
  "parentUserId": "id do superior aqui"
}
```

### Login de Usuário

Para autenticar o usuário e obter um token JWT, envie um POST para o endpoint `/auth/login` com o corpo da requisição como objeto json no seguinte formato:

```json
{
  "username": "João silva",
  "password": "joao1234"
}
```

![Exemplo de login](./images/exemplo-login.png)

Caso a autenticação seja bem sucedida você receberá um token no corpo da requisição que você pode informar como bearer token.

![Exemplo de Retorno](./images/exemplo-response-login.png)

obs: o token ainda não está sendo persistido como cookie (considere o projeto em andamento).

### Utilização dos endpoint protegidos

Supondo que você logou com sucesso e obteve o token no corpor da requisição, você poderá acessar o endpoints protgidos.

Para isso é nescessário que inclua o token no cabeçalho `Authorization` da sua requisição com o prefixo `Bearer`.

```bash
curl -X GET http://localhost:3000/users/tree\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

```

Caso esteja usando o swagger clique em `Authorize`

![Authorize](./images/Authorize.png)

Logo em seguida cole o token no campo `bearer`

![campo bearer](./images/bearer.png)

## Como os diretorios estão estruturados

• `src/`: Código fonte da aplicação.

• `src/auth/`: Módulo responsável pela autenticação de usuários.

• `src/users/`: Módulo para gerenciamento de usuários.

• `src/migrations`: Scripts de migration do banco de dados.(Implementação futura)

## Links úteis

## Links Úteis

- [Documentação do NestJS](https://docs.nestjs.com/)
- [Documentação do TypeORM](https://typeorm.io/)
- [Documentação do JWT](https://jwt.io/)
