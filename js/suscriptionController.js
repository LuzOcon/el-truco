class SuscriptionController{
    constructor() {
        this.suscriptionPlans = [];
        this.storageKey = 'suscriptions';
        this.useDatabase = false; // Cambiar a true cuando se tenga la base de datos
        
        this.init();
    }

   
    async init() {
        await this.loadSuscriptions();
        console.log('SuscriptionController iniciado con', this.suscriptionPlans.length, 'planes');
    }

    async loadSuscriptions() {
        if (this.useDatabase) {
            await this.loadFromDatabase();
        } else {
            this.loadFromLocalStorage();
        }
    }

   //Cargamos desde localstorage
    loadFromLocalStorage() {
        const stored = localStorage.getItem(this.storageKey);
        
        if (stored) {
            this.suscriptionPlans = JSON.parse(stored);
            console.log('Suscripciones cargados desde localStorage');
        } else {
            this.createSampleData();
            this.saveToLocalStorage();
            console.log('Datos de ejemplo creados');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.suscriptionPlans));
    }

    //Cargamos desde base de datos
    async loadFromDatabase() {
    //codigo para cuando tengamos la base de datos
    }

    createSampleData() {
        this.suscriptionPlans = [
            {
                id: 1,
                name: 'Plan individual',
                description: 'Recibe 12 huevos orgánicos frescos cada 7 días. Perfecto para parejas o individuos con un consumo moderado.',
                price: 152.00,
                duration: 'mes',
                main_image: 'img/suscripcion1.webp'
            },
            {
                id: 2,
                name: 'Plan familiar',
                description: 'Recibe 24 huevos orgánicos cada 7 días. Una excelente opción para familias pequeñas de 3 a 5 integrantes.',
                price: 288.00,
                duration: 'mes',
                main_image: 'img/suscripcion2.webp'
            },
            {
                id: 3,
                name: 'Plan negocios',
                description: 'Recibe 60 huevos orgánicos frescos cada 7 días. Perfecto para cafeterías, panaderías o restaurantes locales.',
                price: 680.00,
                duration: 'mes',
                main_image: 'img/suscripcion3.webp'
            }
        ];
    }


    getAllSuscriptions() {
        return this.suscriptionPlans;
    }

    getSuscriptionById(id) {
        return this.suscriptionPlans.find(s => s.id == id);
    }
    

//     //para el carrito
//     getVariantById(variantId) {
//     for (let suscription of this.suscriptionPlans) {
//         const variant = suscription.variants.find(v => v.id == variantId);
//         if (variant) return { product, variant };
//     }
//     return null;
// }


    //Renderizar pagina de catalogo
    renderCatalog(containerId = 'list-suscriptions') {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        this.suscriptionPlans.forEach(suscription => {
            const card = this.createSuscriptionCard(suscription);
            container.appendChild(card);
            
        });
    }

    createSuscriptionCard(suscription) {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-4';
        
        col.innerHTML = `
        <div class="card border-0 producto-card">
        <img src="${suscription.main_image}" alt=" ${suscription.name}" class="card-img-products">
            <div class="card-body text-center">
                <h5 class="card-title"> ${suscription.name} </h5>
                <p>${suscription.description}</p>
                <p class="card-price"> $${suscription.price} MXN / ${suscription.duration}</p>
                <button class="btn btn-verde"> Suscríbete ahora <i class="bi bi-check2-square"></i>
                </button>
            </div>
        </div>
        `;

    return col;
}
   
}

const suscriptionController = new SuscriptionController();