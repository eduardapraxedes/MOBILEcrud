// Importar as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const sqlite3 = require("sqlite3").verbose();//banco sqlite
const authRouter = require('.rotas/auth.js');
//configurando o servidor
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./tarefas.db', (err) => {
    if (err) {
        console.log("erro ao conectar sqlite", err);
    } else {
        console.log("conectado ao sqlite3");
    }
}
);
//criando tabela
db.serialize(() => {
    db.run(
        "CREATE TABLE IF NOT EXISTS usuários (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL)"
    );
    db.run(
        "CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, userid INTEGER NOT NULL, FOREIGN KEY (userid) REFERENCES usuarios(id))"

    );
}
);





// Definir rota de teste
app.get('/api/teste', (req, res) => {
    res.json({ message: 'Backend funcionando' });
});
// Ativando o router no app
app.use('/api', router);
// Definir a porta do servidor
const PORT = 3001;

// Iniciar o servidor
app.listen(PORT, () => {
    console.log('Servidor rodando na porta 3001, acesse http://localhost:3001');
});


//fechando o banco
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.log("erro ao fechar o sqlite3", err);
        } else {
            console.log("sqlite3 fechado")
            process.exit(0);
        }
    });
}
);