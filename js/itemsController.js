class ItemsController {
  constructor(currentId = 0) {
    this.items = [];
    this.currentId = currentId;
  }

  addItem(name, description, img, createdAt) {
    this.currentId++;
    const item = {
      id: this.currentId,
      name,
      description,
      img,
      createdAt
    };
    this.items.push(item);
  }

  // 🔹 Nuevo método para mostrar los items en pantalla
  renderItems() {
    const itemsContainer = document.getElementById('items-list');
    itemsContainer.innerHTML = ''; // Limpiamos el contenedor

    for (let item of this.items) {
      const itemHTML = `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm h-100">
            <img src="${item.img}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.description}</p>
              <p class="text-muted small">${item.createdAt}</p>
            </div>
          </div>
        </div>
      `;
      itemsContainer.innerHTML += itemHTML;
    }
  }
}
