const express = require('express');
const cors = require('cors');
const db = require('./db');

// importando rotass
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const newsRoutes = require('./routes/news');    

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors()); 
app.use(express.json());

// rotas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/noticias', newsRoutes);

// rota inicial
app.get('/', (req, res) => {
    res.send('News está funcionando!');
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});