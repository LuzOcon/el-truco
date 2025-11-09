// Importamos las funciones necesarias, incluyendo las NUEVAS
import { getProductById, updateProduct, uploadProductImage, BASE_URL } from './admin-api.js';

document.addEventListener('DOMContentLoaded', () => {

    // DOM
    const productForm = document.getElementById('productForm');
    const imageFile = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');
    const notificationContainer = document.getElementById('notificationContainer');

    // Si no es la página correcta, salimos
    if (!productForm) {
        return;
    }

    // Obtener id de url
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    // Si no hay ID, devolvemos al usuario a la lista
    if (!productId) {
        window.location.href = 'admin-products.html';
        return;
    }

    // Mensajes a usuario
    const showNotification = (message, type) => {
        notificationContainer.innerHTML = ''; 
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
        `;
        notificationContainer.appendChild(wrapper);
    };

    imageFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 10 * 1024 * 1024; // 10 MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

            if (!allowedTypes.includes(file.type)) {
                showNotification('Tipo de imagen no permitido. Solo JPG, PNG o WEBP.', 'danger');
                imageFile.value = '';
                imagePreview.src = '';
                return;
            }

            if (file.size > maxSize) {
                showNotification('La imagen es demasiado grande. Máximo permitido: 10 MB.', 'danger');
                imageFile.value = '';
                imagePreview.src = '';
                return;
            }

            // Si pasa validación, mostrar preview
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });


    // Rellenar con la receta
    const populateForm = (product) => {
        // Rellenar campos simples
        productForm.elements.name.value = product.name;
        productForm.elements.description.value = product.description;
        productForm.elements.category.value = product.category;
        productForm.elements.basePrice.value = product.basePrice;
        productForm.elements.active.value = product.value;

        const activeValue = product.active ? "1" : "0";
        productForm.elements.active.value = activeValue;
    
    // ✅ Actualizar el badge visual
        const statusBadge = document.getElementById('statusBadge');
        if (product.active) {
            statusBadge.textContent = 'ACTIVO';
            statusBadge.className = 'badge bg-success ms-2';
        } else {
            statusBadge.textContent = 'INACTIVO';
            statusBadge.className = 'badge bg-secondary ms-2';
        }
        
        // Rellenar título de la página
        document.title = `Editar: ${product.name} - Admin El Truco`;

        // Rellenar imagen
        if (product.mainImage) {
        const backendRootUrl = BASE_URL.replace('/api', '');
        imagePreview.src = `../${product.mainImage}`;
        }

    };

    // Carga la receta al iniciar la página
    const loadProduct = async () => {

        try {
            const product = await getProductById(productId);
            populateForm(product);
        } catch (error) {
            console.error('Error al cargar el producto:', error);
            showNotification(`No se pudo cargar el producto: ${error.message}`, 'danger');
            // Deshabilitamos el formulario si no se pudo cargar
            productForm.querySelector('button[type="submit"]').disabled = true;
        }
    };

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        notificationContainer.innerHTML = '';
        
        if (!productForm.checkValidity()) {
        event.stopPropagation();
        productForm.classList.add('was-validated'); 
        showNotification('Por favor, corrige los errores marcados.', 'danger');
        return; 
        }
        productForm.classList.add('was-validated');
        
        const submitButton = productForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando...';

        let productData;

        try {
        const formData = new FormData(productForm);
        productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            basePrice: parseFloat(formData.get('basePrice')), 
            active: formData.get('active') === "1"
        };


        // Enviar petición PUT
        await updateProduct(productId, productData);

        // Subir nueva imagen
        const imageToUpload = imageFile.files[0];
        if (imageToUpload) {
            const imageFormData = new FormData();
            imageFormData.append('image', imageToUpload); 
            await uploadProductImage(productId, imageFormData);
        }

        // Redireccionar con mensaje de éxito
        const productName = productData.name;
        const notification = { 
            type: 'success', 
            message: `¡El producto "${productName}" se actualizó exitosamente!` 
        };
        sessionStorage.setItem('showNotification', JSON.stringify(notification));

        localStorage.removeItem('productsDB');
        localStorage.removeItem('productsDB_timestamp');

        window.location.href = 'admin-products.html';
        
        } catch (error) {
            
        console.error('Error en el proceso de actualización:', error);
        let userMessage = error.message;
        if (userMessage.includes('Duplicate entry')) {
            userMessage = 'Ya existe OTRO producto con este nombre. Elige un nombre diferente.';
        }
        showNotification(`Hubo un error al actualizar: ${userMessage}`, 'danger');
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Cambios';
        }
    });

    loadProduct();
});