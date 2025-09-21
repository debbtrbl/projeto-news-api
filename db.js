const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./news.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de daados SQLite");
    criarTabelas();
  }
});

function criarTabelas() {
  db.run(
    "CREATE TABLE IF NOT EXISTS usuarios ( id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE, senha TEXT NOT NULL, isAdmin BOOLEAN DEFAULT false )"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS noticias (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, autor TEXT NOT NULL, descricao TEXT NOT NULL, categoria TEXT NOT NULL, link TEXT NOT NULL, imagemURL TEXT, dataPublicacao TEXT NOT NULL )"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS favoritos (id INTEGER PRIMARY KEY AUTOINCREMENT, idUsuario INTEGER, idNoticia INTEGER, FOREIGN KEY (idUsuario) REFERENCES usuarios(id), FOREIGN KEY (idNoticia) REFERENCES noticias(id) )"
  );

  // criando um admin padrao
  db.get(
    "SELECT * FROM usuarios WHERE email = ?",
    ["admin@gmail.com"],
    async (err, row) => {
      if (err) console.error("Erro ao verificar admin:", err);
      if (!row) {
        try {
          const senhaCriptografada = await bcrypt.hash("admin123", 10);
          db.run(
            "INSERT INTO usuarios (nome, email, senha, isAdmin) VALUES (?, ?, ?, ?)",
            ["Administrador", "admin@gmail.com", senhaCriptografada, 1],
            function (err) {
              if (err) console.error("Erro ao criar admin:", err);
              else
                console.log(
                  "Admin criado com senha criptografada: admin@gmail.com / admin123"
                );
            }
          );
        } catch (error) {
          console.error("Erro ao criptografar senha:", error);
        }
      }
    }
  );
}

module.exports = db;
