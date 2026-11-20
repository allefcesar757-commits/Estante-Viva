const express = require('express');
const path = require('path');
const db = require('./db'); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ROTA PARA BUSCAR TODOS OS LIVROS
app.get('/livros', (req, res) => {
  const query = 'SELECT * FROM tb_livro';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      return res.status(500).json({ erro: 'Erro interno no banco de dados' });
    }
    res.json(results);
  });
});

// ROTA PARA CADASTRAR UM LIVRO
app.post('/livros', (req, res) => {
  const { titulo, autor, preco, quantidade_estoque } = req.body;
  
  const query = 'INSERT INTO tb_livro (titulo, autor, preco, quantidade_estoque) VALUES (?, ?, ?, ?)';
  
  db.query(query, [titulo, autor, Number(preco), Number(quantidade_estoque)], (err, result) => {
    if (err) {
      console.error('Erro ao inserir livro:', err);
      return res.status(500).json({ erro: 'Erro ao salvar no banco de dados' });
    }
    
    const novoLivro = {
      id_livro: result.insertId,
      titulo,
      autor,
      preco: Number(preco),
      quantidade_estoque: Number(quantidade_estoque)
    };
    res.status(201).json(novoLivro);
  });
});

// ROTA PARA ATUALIZAR UM LIVRO
app.put('/livros/:id', (req, res) => {
  const id = req.params.id;
  const { titulo, autor, preco, quantidade_estoque } = req.body;
  
  const query = 'UPDATE tb_livro SET titulo = ?, autor = ?, preco = ?, quantidade_estoque = ? WHERE id_livro = ?';
  
  db.query(query, [titulo, autor, Number(preco), Number(quantidade_estoque), id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar livro:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar no banco de dados' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }
    
    res.json({ id_livro: id, titulo, autor, preco, quantidade_estoque });
  });
});

// ROTA PARA EXCLUIR UM LIVRO
app.delete('/livros/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM tb_livro WHERE id_livro = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar livro:', err);
      return res.status(500).json({ erro: 'Erro ao deletar no banco de dados' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }
    
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Estante Viva rodando em http://localhost:${PORT}`);
});
