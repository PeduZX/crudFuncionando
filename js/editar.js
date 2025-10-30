// Pegar ID da URL
const paramsURL = new URLSearchParams(window.location.search);
const id = paramsURL.get("id");

// Atualizar ao enviar formulário
const formEditar = document.getElementById("formEditar");
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    modelo: document.getElementById("modelo").value,
    marca: document.getElementById("marca").value,
    origem_fabricante: document.getElementById("origem_fabricante").value,
    tipo_carroceria: document.getElementById("tipo_carroceria").value,
  };

  try {
    const response = await fetch(`http://localhost:3000/editarCarro/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      window.location.href = "carros.html";
    } else {
      alert("Erro: " + result.message);
    }
  } catch (err) {
    console.error("Erro ao atualizar carro:", err);
    alert("Ocorreu um erro ao atualizar o carro.");
  }
});
