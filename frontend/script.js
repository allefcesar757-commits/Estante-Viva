// Elementos do formulário
const form = document.getElementById('form-cadastro');
const tituloForm = document.getElementById('titulo-form');
const inputTitulo = document.getElementById('titulo');
const inputAutor = document.getElementById('autor');
const inputPreco = document.getElementById('preco');
const inputEstoque = document.getElementById('estoque');
const btnSalvar = document.getElementById('btn-salvar');

// Elementos da tabela e pesquisa
const listaLivros = document.getElementById('lista-livros');
const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');
const btnLimpar = document.getElementById('btn-limpar');

// Carrega os livros salvos no navegador ou inicia uma lista vazia
let livros = JSON.parse(localStorage.getItem('estanteVivaLivros')) || [];
let idEmEdicao = null;

// Função para salvar no navegador
function salvarNoNavegador() {
    localStorage.setItem('estanteVivaLivros', JSON.stringify(livros));
}

// 1. Cadastrar ou Salvar Edição
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const precoTexto = inputPreco.value.replace(',', '.');
    const preco = parseFloat(precoTexto) || 0;
    const estoque = parseInt(inputEstoque.value) || 0;

    if (idEmEdicao !== null) {
        // Atualiza o livro existente
        const index = livros.findIndex(livro => livro.id === idEmEdicao);
        if (index !== -1) {
            livros[index] = {
                id: idEmEdicao,
                titulo: titulo,
                autor: autor,
                preco: preco,
                estoque: estoque
            };
        }
        // Volta o formulário para o modo de cadastro
        idEmEdicao = null;
        tituloForm.textContent = 'Cadastrar livro';
        btnSalvar.textContent = 'Cadastrar livro';
    } else {
        // Cria um novo livro
        const novoLivro = {
            id: Date.now(),
            titulo: titulo,
            autor: autor,
            preco: preco,
            estoque: estoque
        };
        livros.push(novoLivro);
    }

    salvarNoNavegador();
    renderizarTabela(livros);
    form.reset();
});

// 2. Desenhar a tabela na tela
function renderizarTabela(listaParaExibir) {
    listaLivros.innerHTML = '';

    if (listaParaExibir.length === 0) {
        listaLivros.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #666;">
                    Nenhum livro encontrado no catálogo.
                </td>
            </tr>
        `;
        return;
    }

    listaParaExibir.forEach(function(livro) {
        const tr = document.createElement('tr');
        tr.classList.add('table-campos');

        const precoFormatado = livro.preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        tr.innerHTML = `
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${precoFormatado}</td>
            <td>${livro.estoque}</td>
            <td>
                <button type="button" class="edit" onclick="editarLivro(${livro.id})">Editar</button>
                <button type="button" class="edit" onclick="excluirLivro(${livro.id})">Excluir</button>
            </td>
        `;

        listaLivros.appendChild(tr);
    });
}

// 3. Carregar dados no formulário para Editar
function editarLivro(id) {
    const livro = livros.find(item => item.id === id);
    if (!livro) return;

    inputTitulo.value = livro.titulo;
    inputAutor.value = livro.autor;
    inputPreco.value = livro.preco.toFixed(2).replace('.', ',');
    inputEstoque.value = livro.estoque;

    idEmEdicao = id;
    tituloForm.textContent = 'Editar livro';
    btnSalvar.textContent = 'Salvar alterações';

    // Sobe a tela suavemente até o formulário
    form.scrollIntoView({ behavior: 'smooth' });
}

// 4. Excluir livro
function excluirLivro(id) {
    livros = livros.filter(livro => livro.id !== id);
    salvarNoNavegador();
    renderizarTabela(livros);
}

// 5. Buscar por título
btnBuscar.addEventListener('click', function() {
    const termo = inputBusca.value.toLowerCase().trim();
    const filtrados = livros.filter(livro => 
        livro.titulo.toLowerCase().includes(termo)
    );
    renderizarTabela(filtrados);
});

// 6. Limpar busca
btnLimpar.addEventListener('click', function() {
    inputBusca.value = '';
    renderizarTabela(livros);
});

// Mostra os livros salvos assim que a página abre
renderizarTabela(livros);
