const textarea = document.getElementById("descripcion");
const contador = document.getElementById("contador");

textarea.addEventListener("input", () => {
  contador.textContent = `${textarea.value.length}/1000`;
});
