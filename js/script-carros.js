// --- CADASTRAR CARRO ---
async function cadastrarCarro(event) {
  event.preventDefault(); // impede reload da página
  const form = document.getElementById("form-info-cars");
  const formData = new FormData(form); // coleta todos os campos e a imagem

  try {
    const resp = await fetch("http://localhost:3000/registerCarros", {
      method: "POST",
      body: formData, // nada de headers JSON aqui!
    });

    const data = await resp.json();

    if (data.success) {
      alert("Carro cadastrado com sucesso!");
      form.reset();
      carregarCarros(); // atualiza lista automaticamente
    } else {
      alert("Erro ao cadastrar: " + data.message);
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro de conexão com o servidor.");
  }
}

// --- LISTAR CARROS ---
async function carregarCarros() {
  const lista = document.getElementById("div-cards");
  if (!lista) return; // evita erro se não estiver na página de listagem

  try {
    const resp = await fetch("http://localhost:3000/listarCarros");
    const carros = await resp.json();

    console.log("Carros recebidos:", carros);
    lista.innerHTML = "";

    carros.data.forEach((c) => {
      const div = document.createElement("div");
      div.className = "InfoCard";
      div.innerHTML = `
        <img class="img-carros-card" src="http://localhost:3000/uploads/${c.nome_arquivo}" alt="${c.modelo}" />
        <p>Modelo: ${c.modelo}</p>
        <p>Marca: ${c.marca}</p>
        <p>Origem fabricante: ${c.origem_fabricante}</p>
        <p>Tipo da carroceria: ${c.tipo_carroceria}</p>
         <a id= "a-editar" href="editar.html?id=${c.id}">Editar</a>
        <button id="btn-deletar" onclick="deletarCarros(${c.id})">Deletar</button>
      `;
      lista.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar carros:", error);
  }
}

carregarCarros(); // chama automaticamente ao abrir a página

// --- DELETAR CARROS ---
async function deletarCarros(id) {
  if (!confirm("Tem certeza que deseja deletar este carro?")) return;

  try {
    const response = await fetch(`http://localhost:3000/delete/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log(data);
    alert("Carro deletado com sucesso!");
    carregarCarros();
  } catch (error) {
    console.error("Erro ao deletar carro:", error);
  }
}
