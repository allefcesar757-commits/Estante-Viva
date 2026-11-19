const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const ARQUIVO_DADOS = path.join(__dirname, 'livros.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

function lerLivros() {
  if (!fs.existsSync(ARQUIVO_DADOS)) {
    fs.writeFileSync(ARQUIVO_DADOS, '[]', 'utf-8');
  }
  return JSON.parse(fs.readFileSync(ARQUIVO_DADOS, 'utf-8'));
}

function salvarLivros(lista) {
  fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(lista, null, 2), 'utf-8');
}

app.get('/livros', (req, res) => {
  res.json(lerLivros());
});

app.post('/livros', (req, res) => {
  const livros = lerLivros();
  const novoLivro = {
    id: Date.now(),
    titulo: req.body.titulo,
    autor: req.body.autor,
    preco: Number(req.body.preco),
    estoque: Number(req.body.estoque)
  };
  livros.push(novoLivro);
  salvarLivros(livros);
  res.status(201).json(novoLivro);
});

app.put('/livros/:id', (req, res) => {
  const id = Number(req.params.id);
  const livros = lerLivros();
  const index = livros.findIndex(livro => livro.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Livro não encontrado' });
  }

  livros[index] = {
    id,
    titulo: req.body.titulo,
    autor: req.body.autor,
    preco: Number(req.body.preco),
    estoque: Number(req.body.estoque)
  };

  salvarLivros(livros);
  res.json(livros[index]);
});


app.delete('/livros/:id', (req, res) => {
  const id = Number(req.params.id);
  const livros = lerLivros();
  const atualizados = livros.filter(livro => livro.id !== id);
  salvarLivros(atualizados);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor Estante Viva rodando em http://localhost:${PORT}`);
});
