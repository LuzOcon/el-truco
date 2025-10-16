class ProductsController{
    //constructor con propiedad currentId
    constructor(currentId = 0){
        this.products = [];
        this.currentId = currentId;
    }

    //metodo addItem
    addItem(name, description, price, imgroute, productroute, sizes =[]){

        //objeto product
        const product = {
            id: this.currentId++,
            name: name,
            description: description,
            price: price,
            imgroute: imgroute,
            productroute: productroute,
            sizes: sizes
            
        };

        this.products.push(product);
    }

    loadProductsFromLocalStorage() {
        const storageProducts = localStorage.getItem("products")
        if (storageProducts) {
            const products = JSON.parse(storageProducts)
            for(let i = 0; i < products.length; i++){
                const product = products[i];
                if (typeof product.id === 'undefined') {
                    product.id = this.currentId++;
                }
                this.products.push(product);
            }    
        }
    }

}









