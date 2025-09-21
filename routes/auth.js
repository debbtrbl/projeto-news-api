const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// registrar novo usuario
router.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // verifica se o email ja foi cadastratdo
        db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, row) => {
            if (err) return res.status(500).json({ error: err.message});
            if (row) return res.status(400).json({ error: 'Email já cadastrado!'});

            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash], 
                function(err) {
                    if (err) return res.status(500).json({ error: err.message});
                    res.json({
                        message: 'Usuário cadastrado com sucesso!',
                        id: this.lastID
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor!' });
    }
});

// login
router.post('/login', (req, res) => {
    const { email, senha} = req.body;

    db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, usuario) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!usuario) return res.status(400).json({ error: 'Usuário não encontrado!'});

        // verificar senjha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(400).json({ error: 'Senha inválida!'});

        // criar tokne
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email, isAdmin: usuario.isAdmin},
            JWT_SECRET, 
            { expiresIn: '1h'}
        );
        res.json({
            message: 'Login realizado com sucesso!',
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, isAdmin: usuario.isAdmin }
        });

    });
});

module.exports = router;