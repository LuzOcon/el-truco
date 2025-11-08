class ProductService {
    constructor() {
        this.products = [];
        this.storageKey = 'productsDB';
        this.useDatabase = true; // true usa la base de datos y false usa local storage
        this.BASE_URL = 'http://localhost:8080/api';
    }

   
    async init() {
        if (!this.useDatabase) {
            this.loadFromLocalStorage();
            return;
    }

    //si ya hay datos en local los agarramos de ahí
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
        this.products = JSON.parse(stored);
        console.log('Productos cargados desde localStorage');
        return;
    }

        try {
        const response = await fetch(`${this.BASE_URL}/products`);
       
        if (!response.ok) {
            throw new Error(`API_ERROR: Failed to fetch all products (Status: ${response.status})`);
        }
        
        this.products = await response.json(); 
        console.log('Productos cargados desde la base de datos');
    } catch (error) {
        console.error('Error al cargar productos desde la BD:', error);
        
        this.loadFromLocalStorage();
    }
    }

   //Cargamos desde localstorage
    loadFromLocalStorage() {
        const stored = localStorage.getItem(this.storageKey);
        
        if (stored) {
            this.products = JSON.parse(stored);
            console.log('Productos cargados desde localStorage');
        } else {
            this.createSampleData();
            this.saveToLocalStorage();
            console.log('Datos de ejemplo creados');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    }

    //Cargamos desde base de datos
    async loadFromDatabase() {
        const BASE_URL = 'http://localhost:8080/api';
        const response = await fetch(`${BASE_URL}/products`);
    
        if (!response.ok) {
            throw new Error(`API_ERROR: Failed to fetch all products (Status: ${response.status})`);
        }
        // 2.- convertir la petición
        const products = await response.json();
    
        // 3.- devolvemos el JSON como objeto de js
        return products;
    
    }

    createSampleData() {
        this.products = [
            {
                id: 1,
                name: 'Huevos Orgánicos',
                description: 'Nuestros huevos provienen de gallinas criadas con mínimo uso de químicos, en un ambiente cuidado y natural.',
                basePrice: 24.00,
                category: 'huevos',
                mainImage: 'img/sixeggs.webp',
                active: 1,
                variants: [
                    { id: 1, productId: 1, name: 'Paquete de 6 Huevos', price: 24.00, image: '../img/sixeggs.webp', stock: 100 },
                    { id: 2, productId: 1, name: 'Paquete de 12 Huevos', price: 40.00, image: '../img/eggs12.webp', stock: 80 },
                    { id: 3, productId: 1, name: 'Paquete de 30 Huevos', price: 95.00, image: '../img/eggs30.webp', stock: 50 },
                    { id: 4, productId: 1, name: 'Caja de 320 Huevos', price: 980.00, image: '../img/eggs320.webp', stock: 20 }
                ]
            },
            {
                id: 2,
                name: 'Abono Orgánico',
                description: 'Abono orgánico elaborado a partir del estiércol compostado de gallinas.',
                basePrice: 80.00,
                category: 'abono',
                mainImage: 'img/abono.webp',
                active: 1,
                variants: [
                    { id: 5, productId: 2, name: 'Bolsa de 1 Kg', price: 80.00, image: '../img/abono.webp', stock: 200 },
                    { id: 6, productId: 2, name: 'Bolsaza de 6 Kg', price: 280.00, image: '../img/abono.webp', stock: 100 },
                    { id: 7, productId: 2, name: 'Costal de 10 Kg', price: 320.00, image: '../img/abono.webp', stock: 80 },
                    { id: 8, productId: 2, name: 'Costal de 15 Kg', price: 400.00, image: '../img/abono.webp', stock: 60 },
                    { id: 9, productId: 2, name: 'Costal de 25 Kg', price: 620.00, image: '../img/abono.webp', stock: 40 }
                ]
            },
            {
                id: 3,
                name: 'Lote de Gallinas',
                description: 'Gallinas de postura de alta calidad.',
                basePrice: 280.00,
                category: 'aves',
                mainImage: 'img/chicken2.webp',
                active: 1,
                variants: [
                    { id: 10, productId: 3, name: 'Lote de 25 Aves',  price: 280.00, image: '../img/chicken2.webp', stock: 15 },
                    { id: 11, productId: 3, name: 'Lote de 50 Aves',  price: 500.00, image: '../img/chicken2.webp', stock: 10 },
                    { id: 12, productId: 3, name: 'Lote de 100 Aves', price: 950.00, image: '../img/chicken2.webp', stock: 5 }
                ]
            }
        ];
    }


    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id == id);
    }
    

    //para el carrito
    getVariantById(variantId) {
    for (let product of this.products) {
        const variant = product.variants.find(v => v.id === variantId);
        if (variant) return { product, variant };
    }
    return null;
}


    //Renderizar pagina de catalogo
    renderCatalog(containerId = 'list-items') {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        this.products.forEach(product => {
            if (product.active) {  //unicamente si active = 1
                const card = this.createProductCard(product);
                container.appendChild(card);
            }
        });
    }

    createProductCard(product) {
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-lg-4';

    //datos para el carrito y para el menu collapse
    const optionsHTML = product.variants.map(v => `<option value="${v.id}" data-name="${v.name}" data-price="${v.price}" data-image="${v.image}"> ${v.name} - $${v.price.toFixed(2)} MXN </option>`).join('');

    col.innerHTML = `
        <div class="card border-0 producto-card">
            <img src="${product.mainImage}" alt="${product.name}" class="card-img-products">
            <div class="card-body text-center">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-price">Desde $${product.basePrice.toFixed(2)} MXN</p>
                
                <a href="products/producto.html?id=${product.id}" class="btn btn-brown mb-2">
                    Ver información del producto
                </a>
                
                <button class="btn btn-verde" data-bs-toggle="collapse" 
                        data-bs-target="#options-${product.id}">
                    Ver opciones <i class="bi bi-chevron-down"></i>
                </button>
                
                <div class="collapse mt-3" id="options-${product.id}">
                    <select class="form-select collapse-format mb-2" id="select-${product.id}">
                        ${optionsHTML}
                    </select>
                    <button class="btn btn-verde add-to-cart" 
                            data-product-id="${product.id}">
                        Agregar al carrito <i class="bi bi-basket2-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    return col;
}
   

//renderiza pagina individual con el Id de cada producto
renderProductPage(productId) {
    const product = this.getProductById(productId);
    
    if (!product) {
        document.querySelector('.product-container').innerHTML = '<div class="alert alert-danger">Producto no encontrado</div>';
        return;
    }

    //carga el  numero de variante 
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedVariantId = urlParams.get('variant');
    
    let selectedVariant = product.variants[0]; //por default variante 1
    
    if (preselectedVariantId) {
        const found = product.variants.find(v => v.id == preselectedVariantId);
        if (found) selectedVariant = found;
    }

    //carga informacion de la vista principal
    const productTitle = document.querySelector('.product-container h2');
    const productPrice = document.querySelector('.product-container .price');
    const productDesc = document.querySelector('.product-container .col-md-5 > p:not(.price)'); //descripcion del producto

    if (productTitle) productTitle.textContent = selectedVariant.name;  //cambia el titulo por el nombre de la variante
    if (productPrice) productPrice.textContent = `$${selectedVariant.price.toFixed(2)} MXN`; //cambia el precio por el precio de la variante
    if (productDesc) productDesc.textContent = product.description;  //cambia la descripcion por la descripcion del producto

    //cambia la imagen 
    const mainImg = document.querySelector('.carousel-item.active img');
    if (mainImg) mainImg.src = selectedVariant.image;

    //llama las variantes seleccionables 
    this.renderVariants(product, preselectedVariantId);
}


//renderiza las variantes seleccionables
    renderVariants(product, preselectedVariantId = null) {
    const variantList = document.getElementById('variantList');
    if (!variantList) return;
    
    variantList.innerHTML = product.variants.map((variant) => {
        // determinar variante activa
        const isActive = preselectedVariantId 
            ? variant.id == preselectedVariantId  
            : variant.id === product.variants[0].id;  
        
        return `
            <div class="variant-card ${isActive ? 'active' : ''}" 
                 data-variant-id="${variant.id}" 
                 data-name="${variant.name}" 
                 data-price="${variant.price}" 
                 data-img="${variant.image}"> 
                <img src="${variant.image}" alt="${variant.name}" class="variant-img"> 
                <p>${variant.name.split(' ').slice(-2).join(' ')}</p>
            </div>
        `;
    }).join('');

    this.attachVariantEvents();
}

    //eventos de las variantes
    attachVariantEvents() {
        const cards = document.querySelectorAll('.variant-card');
        const productTitle = document.querySelector('.product-container h2');
        const productPrice = document.querySelector('.product-container .price');
        const mainImg = document.querySelector('.carousel-item.active img');
    
        cards.forEach(card => {
        card.addEventListener('click', () => {cards.forEach(c => c.classList.remove('active'));
            
            // active a la seleccionada
            card.classList.add('active');

            // actualiza los datos
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const img = card.dataset.img;
            if (productTitle) productTitle.textContent = name;
            if (productPrice) productPrice.textContent = `$${price.toFixed(2)} MXN`;
            if (mainImg) mainImg.src = img;
        });
    });
}

updateVariantStock(variantId, quantity) {
    for (const product of this.products) {
        const variant = product.variants.find(v => v.id === variantId);
        if (variant) {
            if (variant.stock >= quantity) {
                variant.stock -= quantity;
                
                if (this.useDatabase) {
                    // actualiza en la base
                    this.updateStockInDatabase(variantId, variant.stock);
                } else {
                    this.saveToLocalStorage();
                }
                return true;
            }
            return false; // no hay stock
        }
    }
    return false;
}

}



const productService = new ProductService();