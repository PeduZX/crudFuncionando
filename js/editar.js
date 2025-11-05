// Pegar ID da URL
const paramsURL = new URLSearchParams(window.location.search);
const id = paramsURL.get("id");

// Atualizar ao enviar formulário
const formEditar = document.getElementById("formEditar");
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("modelo", document.getElementById("modelo").value);
  formData.append("marca", document.getElementById("marca").value);
  formData.append("origem_fabricante", document.getElementById("origem_fabricante").value);
  formData.append("tipo_carroceria", document.getElementById("tipo_carroceria").value);

  const arquivo = document.getElementById("input-editar-img").files[0]; 
  if (arquivo) {
    formData.append("arquivo", arquivo);
  }

  try {
    const response = await fetch(`http://localhost:3000/editarCarro/${id}`, {
      method: "PUT",
      body: formData,
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

