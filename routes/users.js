const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// get perfil do usuario
router.get('/perfil', verificarToken, (req, res) => {
    db.get('SELECT id, nome, email, isAdmin FROM usuarios WHERE id = ?', [req.usuario.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// put atualizar perfil 
router.put('/perfil', verificarToken, async (req, res) => {
    const { nome, email, senha } = req.body;

    try{
        let updateQuery = 'UPDATE usuarios SET nome = ?, email = ?';
        let params = [nome, email];

        if (senha) {
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);
            updateQuery += ', senha = ?';
            params.push(senhaHash);  
        }

        updateQuery += ' WHERE id = ?';
        params.push(req.usuario.id);
        db.run(updateQuery, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Perfil atualizado com sucesso!' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor!' });
    }
});

// get favoritos do usuario
router.get('/favoritos', verificarToken, (req, res) => {
    db.all('SELECT n.* FROM noticias n JOIN favoritos f ON n.id = f.idNoticia WHERE f.idUsuario = ?',
         [req.usuario.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// post adicionar favotito
router.post('/favoritos/:idNoticia', verificarToken, (req, res) => {
    const { idNoticia } = req.params;

    // verifica se a noticia existe
    db.get('SELECT * FROM noticias WHERE id = ?', [idNoticia], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Notícia não encontrada!' });

        // verifica se ja ta nos favoritos
        db.get('SELECT * FROM favoritos WHERE idUsuario = ? AND idNoticia = ?',
             [req.usuario.id, idNoticia], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) return res.status(400).json({ error: 'Notícia já está nos favoritos!' });

            // adicionar aos favoritos
            db.run('INSERT INTO favoritos (idUsuario, idNoticia) VALUES (?, ?)',
                    [req.usuario.id, idNoticia], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Notícia adicionada aos favoritos!' });
            });
        });
    });
});

// delete remover favorito
router.delete('/favoritos/:idNoticia', verificarToken, (req, res) => {
    const { idNoticia } = req.params;

    db.run('DELETE FROM favoritos WHERE idUsuario = ? AND idNoticia = ?',
         [req.usuario.id, idNoticia], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Notícia não encontrada nos favoritos!' });
        res.json({ message: 'Notícia removida dos favoritos!' });
    });
});

module.exports = router;
