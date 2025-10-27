document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const variantsContainer = document.getElementById("variantsContainer");
  const addVariantBtn = document.getElementById("addVariantBtn");
  let variantCount = 0;

  // Agregar una nueva variante
  addVariantBtn.addEventListener("click", () => {
    variantCount++;
    const variantHTML = `
      <div class="border p-3 rounded mb-2 variant-item">
        <h6>Variante ${variantCount}</h6>
        <input type="text" class="form-control mb-2 variant-name" placeholder="Nombre (Ej. Paquete de 6 Huevos)">
        <input type="number" class="form-control mb-2 variant-price" placeholder="Precio (Ej. 24.00)">
        <input type="text" class="form-control mb-2 variant-image" placeholder="Imagen (Ej. ../img/sixeggs.webp)">
        <input type="number" class="form-control mb-2 variant-stock" placeholder="Stock disponible">
        <button type="button" class="btn btn-outline-danger btn-sm remove-variant">Eliminar</button>
      </div>`;
    variantsContainer.insertAdjacentHTML("beforeend", variantHTML);
  });

  variantsContainer.addEventListener("click", e => {
    if (e.target.classList.contains("remove-variant")) {
      e.target.closest(".variant-item").remove();
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const base_price = parseFloat(document.getElementById("base_price").value);
    const category = document.getElementById("category").value;
    const main_image = document.getElementById("main_image").value.trim();
    const active = parseInt(document.getElementById("active").value);

    if (!name || !description || !base_price || !category || !main_image) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const variantElements = document.querySelectorAll(".variant-item");
    if (variantElements.length === 0) {
      alert("Agrega al menos una variante.");
      return;
    }

    const variants = [];
    variantElements.forEach((el, i) => {
      const vName = el.querySelector(".variant-name").value.trim();
      const vPrice = parseFloat(el.querySelector(".variant-price").value);
      const vImage = el.querySelector(".variant-image").value.trim();
      const vStock = parseInt(el.querySelector(".variant-stock").value);

      if (!vName || !vPrice || !vImage || !vStock) {
        alert(`Completa todos los campos en la variante ${i + 1}.`);
        throw new Error("Campos incompletos");
      }

      variants.push({
        id: i + 1,
        product_id: Date.now(),
        name: vName,
        price: vPrice,
        image: vImage,
        stock: vStock
      });
    });

    const newProduct = {
      id: Date.now(),
      name,
      description,
      base_price,
      category,
      main_image,
      active,
      variants
    };

    console.log("Producto creado: ");
    console.log(JSON.stringify(newProduct, null, 2));

    alert("Producto creado correctamente (ver consola para el JSON).");
    form.reset();
    variantsContainer.innerHTML = "";
    variantCount = 0;
  });
});
