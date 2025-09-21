const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = 'minha_chave_muito_secreta';

function verificarToken(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Token necessário!'});
    }
    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token inválido!'});
    }
    }

    function verificarAdmin(req, res, next) {
        if (!req.usuario.isAdmin) {
            return res.status(403).json({ error: 'Acesso negado! Requer permissão de administrador!'});
        }
        next();
    }

module.exports = { verificarToken, verificarAdmin, JWT_SECRET };
