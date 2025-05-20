// Importar as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const app = express();

app.use(cors());
app.use(bodyParser.json()); 

// Definir rota de teste
app.get('/api/teste', (req, res) => {
    res.json({ message: 'Backend funcionando' }); 
});

// Definir a porta do servidor
const PORT = 3001;

// Iniciar o servidor
app.listen(PORT, () => {
    console.log('Servidor rodando na porta 3001, acesse http://localhost:3001');
});
