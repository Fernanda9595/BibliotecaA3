const API_URL = `${location.origin}/livros`;

document.getElementById('formLivro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, autor }),
  });

  document.getElementById('formLivro').reset();
  carregarLivros();
});

async function carregarLivros() {
  const res = await fetch(API_URL);
  const livros = await res.json();
  const lista = document.getElementById('listaLivros');
  lista.innerHTML = '';
  livros.forEach((livro) => {
    const li = document.createElement('li');
    li.textContent = `${livro.titulo} - ${livro.autor}`;
    lista.appendChild(li);
  });
}

carregarLivros();