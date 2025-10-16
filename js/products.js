const productsController = new ProductsController(0);

function addProductCard(product){
   const listEl = document.getElementById("list-items");

   const optionsHTML = product.sizes.map(size => {
        return `<option value="${size.name}">
                    ${size.name} - $${size.price} MXN
                </option>`;
    }).join('');

    //<p class="card-text">${product.description}</p>

   listEl.innerHTML += `
<div class="col-md-4 col-lg-4">
    <div class="card border-0 producto-card">
      <img src="${product.imgroute}" alt="${product.name}" class="card-img-products">
      <div class="card-body text-center">
        <h5 class="card-title">${product.name}</h5>
        
        <p class="card-price">Desde $${product.price} MXN</p>

        <a href="${product.productroute}" class="btn btn-brown mb-2"> Ver información del producto </a>

        <button class="btn btn-verde" data-bs-toggle="collapse" data-bs-target="#options-${product.id}" aria-expanded="false"> Ver opciones <i class="bi bi-chevron-down"></i>
        </button>

        <div class="collapse mt-3" id="options-${product.id}">
          <select class="form-select collapse-format mb-2">
            ${optionsHTML}
          </select>
          <button class="btn btn-verde"> Agregar al carrito <i class="bi bi-basket2-fill fs-5"></i> </button>
        </div>
      </div>
    </div>
  </div>
        `;
 
}

function loadStorageSampleData(){
    if(!localStorage.getItem("products")){
        const sampleItems = [
            {
                'name':'Huevos Orgánicos',
                'imgroute':'../img/sixeggs.webp',
                'description':'Perfectos para consumo diario, libres de químicos y con frescura garantizada.',
                'price':'24.00',
                'productroute':'../products/huevos-pack6.html',
                'sizes': [
                    {name: 'Paquete de 6 piezas', price: 24},
                    {name: 'Paquete de 12 piezas', price: 40},
                    {name: 'Cono de 30 piezas', price: 90},
                    {name: 'Caja de 320 piezas', price: 980}]
            },
        
            {
                'name':'Abono Orgánico',
                'imgroute':'../img/abono.webp',
                'description':'Abono orgánico elaborado a partir del estiércol compostado de gallinas criadas al aire libre',
                'price':'80.00',
                'productroute':'../products/abono-1kg.html',
                'sizes':[
                    {name: 'Bolsa de 1 Kg', price: 80},
                    {name: 'Bolsaza de 6 Kg', price: 280},
                    {name: 'Costal de 10 Kg', price: 320},
                    {name: 'Costal de 15 Kg', price: 400},
                    {name: 'Costal de 25 Kg', price: 620}]
            },
            
            {
                'name':'Lote de Gallinas',
                'imgroute':'../img/chicken2.webp',
                'description':'Lote de gallinas de postura',
                'price':'280.00',
                'productroute':'../products/lote-gallinas-25.html',
                'sizes':[
                    {name: 'Lote de 25 Aves', price: 80},
                    {name: 'Lote de 50 Aves', price: 280},
                    {name: 'Lote de 100 Aves', price: 320},]
            }
        ];
        localStorage.setItem("products", JSON.stringify(sampleItems));
    }

}
 

function loadCardsListFromProductsController(){
    for(var i = 0, size = productsController.products.length; i < size ; i++){
        const product = productsController.products[i];
        addProductCard(product);
    }
}


loadStorageSampleData();
productsController.loadProductsFromLocalStorage();
loadCardsListFromProductsController();