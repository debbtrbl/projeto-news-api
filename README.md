# 📰 API de Notícias - Projeto News

Uma API simples para gerenciamento de notícias com sistema de usuários e favoritos, desenvolvida em Node.js + Express + SQLite.

## 🚀 Tecnologias

- Node.js
- Express.js
- SQLite (banco de dados embutido)
- JWT (autenticação)
- bcryptjs (criptografia de senhas)

## 📦 Instalação

```bash
# Clone o projeto
git clone https://github.com/debbtrbl/projeto-news-api.git

# Instale as dependências
npm install

# Execute o servidor
npm start

# Para desenvolvimento (com nodemon)
npm run dev
```

## 🌟 Funcionalidades

### 👥 Autenticação
- Registro de usuários
- Login com JWT
- Perfil de usuário

### 📰 Notícias
- Listar todas as notícias (público)
- Criar notícias (apenas admin)
- Editar notícias (apenas admin)
- Deletar notícias (apenas admin)

### ❤️ Favoritos
- Adicionar notícias aos favoritos
- Remover dos favoritos
- Listar notícias favoritadas

## 👤 Usuário Administrador Padrão

**Email:** admin@gmail.com  
**Senha:** admin123  
**Permissões:** Total (criar, editar, deletar notícias)

## 📋 Endpoints Principais

### Autenticação
```
POST /api/auth/registrar
POST /api/auth/login
```

### Notícias
```
GET    /api/noticias          # Listar todas
POST   /api/noticias          # Criar (admin)
PUT    /api/noticias/:id      # Editar (admin)
DELETE /api/noticias/:id      # Deletar (admin)
```

### Usuários
```
GET    /api/usuarios/perfil           # Ver perfil
PUT    /api/usuarios/perfil           # Editar perfil
GET    /api/usuarios/favoritos        # Ver favoritos
POST   /api/usuarios/favoritos/:id    # Adicionar favorito
DELETE /api/usuarios/favoritos/:id    # Remover favorito
```

## 🔐 Permissões

- **Usuários normais:** Ver notícias, favoritar, gerenciar perfil
- **Administradores:** Todas as operações + gerenciamento de notícias

## 🗄️ Estrutura do Banco

### Tabelas:
- **usuarios** (id, nome, email, senha, isAdmin)
- **noticias** (id, titulo, autor, categoria, link, imagemUrl, descricao, dataPublicacao)
- **favoritos** (id, idUsuario, idNoticia)

### Exemplo de criação de notícia:
```json
{
  "titulo": "Minha Notícia",
  "autor": "João Silva",
  "categoria": "Tecnologia",
  "link": "https://exemplo.com/noticia",
  "imagemUrl": "https://exemplo.com/imagem.jpg",
  "descricao": "primeira noticia"
}
```
### Exemplo de criação de usuário:
```json
{
  "nome": "Fulano da Silva",
  "email": "fulano@email.com", 
  "senha": "senha123"
}
```


## 📝 Notas

- O banco SQLite é criado automaticamente (`news.db`)
- Não precisa instalar banco de dados externo



