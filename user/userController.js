document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveChangesBtn");
  const inputs = document.querySelectorAll("#userForm input");
  const alert = document.getElementById("divAlert");

  // alerta con Bootstrap
  const appendAlert = (message, type) => {
    const alerta = document.createElement("div");
    alerta.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alert.innerHTML = ""; 
    alert.append(alerta);
  };

  // boton editar
  editBtn.addEventListener("click", () => {
    inputs.forEach(input => input.removeAttribute("disabled"));
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
  });

  // boton guardar
  saveBtn.addEventListener("click", () => {
    inputs.forEach(input => input.setAttribute("disabled", "true"));
    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";

    appendAlert("Tus cambios se guardaron correctamente.", "success");
  });
});
