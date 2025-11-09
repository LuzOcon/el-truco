import { BASE_URL } from './admin-api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const variantForm = document.getElementById('variantForm');
    const notificationContainer = document.getElementById('notificationContainer');
    const productInfo = document.getElementById('productInfo');
    const imageInput = document.getElementById('variantImage');
    const imagePreview = document.getElementById('imagePreview');

    // Obtener productId de los query params
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (!productId) {
        showNotification('Error: No se especificó el producto.', 'danger');
        setTimeout(() => {
            window.location.href = 'admin-products.html';
        }, 2000);
        return;
    }

    // Cargar información del producto
    const loadProductInfo = async () => {
        try {
            const response = await fetch(`${BASE_URL}/products/${productId}`);
            if (!response.ok) throw new Error('Producto no encontrado');
            
            const product = await response.json();
            productInfo.innerHTML = `Para el producto: <strong>${product.name}</strong>`;
        } catch (error) {
            console.error('Error al cargar producto:', error);
            productInfo.innerHTML = '<span class="text-danger">Error al cargar información del producto</span>';
        }
    };

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
        } else {
            imagePreview.style.display = 'none';
            imagePreview.src = 'https://placehold.co/300x200/b2b2b2/ffffff?text=Sin+Imagen';
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
            formData.append('name', document.getElementById('name').value.trim());
            formData.append('price', document.getElementById('price').value);
            formData.append('stock', document.getElementById('stock').value || 0);
            formData.append('sku', document.getElementById('sku').value.trim());
            formData.append('active', document.getElementById('active').value === 'true');

            const imageFile = imageInput.files[0];
            if (imageFile) {
                formData.append('variantImage', imageFile);
            }

            const response = await fetch(`${BASE_URL}/products/${productId}/variants`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear la variante');
            }

            // Guardar notificación de éxito en sessionStorage
            sessionStorage.setItem('showNotification', JSON.stringify({
                message: 'Variante creada exitosamente.',
                type: 'success'
            }));

            // Redirigir a la lista de productos
            window.location.href = 'admin-products.html';

        } catch (error) {
            console.error('Error al crear variante:', error);
            showNotification(`Error: ${error.message}`, 'danger');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    // Cargar info del producto al iniciar
    await loadProductInfo();
});