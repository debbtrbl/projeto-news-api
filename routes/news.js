const express = require('express');
const db = require('../db');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

const router = express.Router();

// get todas as noticiaas
router.get('/', (req, res) => {
    db.all('SELECT * FROM noticias ORDER BY dataPublicacao DESC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// get noticia por id
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM noticias WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Notícia não encontrada!' });
        res.json(row);
    });
    });

// post criar nova noticia (apenas admin)
router.post('/', verificarToken, verificarAdmin, (req, res) => {
    const { titulo, autor, descricao, categoria, link, imagemURL, dataPublicacao } = req.body;

    if (!titulo || !autor || !descricao || !categoria || !link || !dataPublicacao) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos!'});
    }

    db.run('INSERT INTO noticias (titulo, autor, descricao, categoria, link, imagemURL, dataPublicacao) VALUES (?, ?, ?, ?, ?, ?, ?)', [titulo, autor, descricao, categoria, link, imagemURL, dataPublicacao], 
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: 'Notícia criada com sucesso!',
                id: this.lastID
            });
        }
    );
});

// put atualizar noticia por id (apenas admin)
router.put('/:id', verificarToken, verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { titulo, autor, descricao, categoria, link, imagemURL, dataPublicacao } = req.body;

    db.run('UPDATE noticias SET titulo = ?, autor = ?, descricao = ?, categoria = ?, link = ?, imagemURL = ?, dataPublicacao = ? WHERE id = ?', [titulo, autor, descricao, categoria, link, imagemURL, dataPublicacao, id], 
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Notícia não encontrada!' });
            res.json({ message: 'Notícia atualizada com sucesso!' });
        }
    );
}
);

// delete noticia por id (apenas admin)
router.delete('/:id', verificarToken, verificarAdmin, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM noticias WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Notícia não encontrada!' });
        res.json({ message: 'Notícia deletada com sucesso!' });
    });
});

module.exports = router;