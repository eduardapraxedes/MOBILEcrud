// Importar as bibliotecas necessárias
const express = require('express');
const bcrypt = require('bcryptjs'); // Protege senhas
const jwt = require('jsonwebtoken'); // Cria tokens JWT
const sqlite3 = require("sqlite3").verbose(); // Banco SQLite

const app = express();
app.use(express.json()); // Para interpretar JSON no corpo da requisição

// Conecta ao banco de dados SQLite
const db = new sqlite3.Database('./tarefas.db', (err) => {
    if (err) {
        console.log("Erro ao conectar ao SQLite:", err);
    } else {
        console.log("Conectado ao SQLite3");
    }
});

const router = express.Router();
const JWT_SECRET = 'chave-secreta-super-segura';

// Rota de registro de usuários
router.post('/registro', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
//verifica se o email ja existe
    db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor ao verificar e-mail' });
        }

        if (row) {
            return res.status(500).json({ message: 'Este e-mail já está cadastrado' });
        }

        // Criptografar a senha
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Inserir usuário
        db.run('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, hashedPassword], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Erro no servidor ao inserir usuário' });
            }

            return res.status(201).json({ message: 'Cadastrado com sucesso!' });
        });
    });
});

// Rota de login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
        if (err) {
            return res.status(500).json({ message: 'Erro no servidor' });
        }

        if (!usuario || !bcrypt.compareSync(password, usuario.senha)) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Gerar token JWT
        const token = jwt.sign({ userid }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login bem-sucedido', token, userid: usuarios.id });
    });
});
