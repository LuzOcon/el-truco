import { BASE_URL } from './admin-api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const variantForm = document.getElementById('variantForm');
    const notificationContainer = document.getElementById('notificationContainer');
    const productInfo = document.getElementById('productInfo');
    const imageInput = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');

    // Obtener IDs de los query params
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    const variantId = urlParams.get('variantId');

    if (!productId || !variantId) {
        showNotification('Error: No se especificó el producto o la variante.', 'danger');
        setTimeout(() => {
            window.location.href = 'admin-products.html';
        }, 2000);
        return;
    }

    // Función para obtener URL de imagen
    function getImageUrl(imagePath) {
        const backendRootUrl = BASE_URL.replace('/api', '');
        
        if (!imagePath) {
            return 'https://placehold.co/300x200/b2b2b2/ffffff?text=Sin+Imagen';
        }

        if (imagePath.startsWith('img/')) {
            return `../${imagePath}`;
        }
        
        if (!imagePath.includes('/')) {
            return `${backendRootUrl}/images/products/${imagePath}`;
        }
        
        if (imagePath.startsWith('public/')) {
            const filename = imagePath.split('/').pop();
            return `${backendRootUrl}/images/products/${filename}`;
        }
        
        return imagePath;
    }

    // Mostrar notificación
    const showNotification = (message, type) => {
        notificationContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        `;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cargar información del producto y la variante
    const loadVariantData = async () => {
        try {
            // Obtener información del producto
            const productResponse = await fetch(`${BASE_URL}/products/${productId}`);
            if (!productResponse.ok) throw new Error('Producto no encontrado');
            
            const product = await productResponse.json();
            
            // Buscar la variante específica
            const variant = product.variants.find(v => v.id == variantId);
            if (!variant) throw new Error('Variante no encontrada');

            // Mostrar información del producto
            productInfo.innerHTML = `Editando variante de: <strong>${product.name}</strong>`;

            // Llenar el formulario
            document.getElementById('variantName').value = variant.name || '';
            document.getElementById('variantPrice').value = variant.price || '';
            document.getElementById('variantStock').value = variant.stock !== undefined ? variant.stock : 0;


            // Mostrar imagen actual
            const variantImage = variant.image || variant.variantImage || product.mainImage;
            imagePreview.src = getImageUrl(variantImage);
            imagePreview.style.display = 'block';

        } catch (error) {
            console.error('Error al cargar variante:', error);
            showNotification(`Error al cargar la variante: ${error.message}`, 'danger');
            productInfo.innerHTML = '<span class="text-danger">Error al cargar información</span>';
        }
    };

    // Preview de imagen
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });


    // Submit del formulario
    variantForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!variantForm.checkValidity()) {
            e.stopPropagation();
            variantForm.classList.add('was-validated');
            return;
        }

        const submitButton = variantForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

        try {
            const formData = new FormData();
            formData.append('name', document.getElementById('variantName').value.trim());
            formData.append('price', document.getElementById('variantPrice').value);
            formData.append('stock', document.getElementById('variantStock').value || 0);

            const imageFile = imageInput.files[0];
            if (imageFile) {
                formData.append('variantImage', imageFile);
            }

            const response = await fetch(`${BASE_URL}/products/${productId}/variants/${variantId}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la variante');
            }

            // Guardar notificación de éxito en sessionStorage
            sessionStorage.setItem('showNotification', JSON.stringify({
                message: 'Variante actualizada exitosamente.',
                type: 'success'
            }));

            // Redirigir a la lista de productos
            window.location.href = 'admin-products.html';

        } catch (error) {
            console.error('Error al actualizar variante:', error);
            showNotification(`Error: ${error.message}`, 'danger');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    // Cargar datos al iniciar
    await loadVariantData();
});