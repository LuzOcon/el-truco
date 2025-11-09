import { createProduct, uploadProductImage } from './admin-api.js';

document.addEventListener('DOMContentLoaded', () => {

  // DOM
  const productForm = document.getElementById('productForm');
  const mainImage = document.getElementById('mainImage');
  const imagePreview = document.getElementById('imagePreview');
  const jsonOutput = document.getElementById('jsonOutput');
  const notificationContainer = document.getElementById('notificationContainer');

  if (!productForm) {
    return;
  }

  //  Alertas para el usuario 
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

  //  Lógica del Formulario para la imagen 
  mainImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10 MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        showNotification('Tipo de imagen no permitido. Solo JPG, PNG o WEBP.', 'danger');
        mainImage.value = '';
        imagePreview.src = '';
        return;
      }

      if (file.size > maxSize) {
        showNotification('La imagen es demasiado grande. Máximo permitido: 10 MB.', 'danger');
        mainImage.value = '';
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



  const handleRemoveItem = (event) => {
    if (event.target.classList.contains('remove-item')) {
      event.target.closest('.dynamic-field-wrapper').remove();
    }
  };

  productForm.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    notificationContainer.innerHTML = '';
    
    if (!productForm.checkValidity()) {
      event.stopPropagation();
      productForm.classList.add('was-validated'); 
      showNotification('Por favor, corrige los errores marcados en el formulario.', 'danger');
      return; 
    }
    productForm.classList.add('was-validated');
    
    const submitButton = productForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    let savedProduct;
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
      savedProduct = await createProduct(productData);

    } catch (createError) {

      console.error('Error al crear el producto:', createError);

      let userMessage = createError.message;

      if (userMessage.includes('Duplicate entry') && userMessage.includes('products.UK2yg91gejn5gopghwqbh5k25fp')) {
        userMessage = 'Ya existe un producto con este nombre. Por favor, elige un nombre diferente.';
      }

      // Mostramos el mensaje (traducido o no)
      showNotification(`Hubo un error al guardar el producto: ${userMessage}`, 'danger');
      productForm.classList.remove('was-validated');
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Producto';
      return;
    }

    const productName = productData.name;
    const imageToUpload = mainImage.files[0];

    console.log('Imagen a subir:', imageToUpload);
    
    if (imageToUpload) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('image', imageToUpload); 

        console.log('📤 Subiendo imagen para producto ID:', savedProduct.id); // ✅ AGREGA
        await uploadProductImage(savedProduct.id, imageFormData);
        
        // Receta e imagen se guardaron correctamente
        const notification = { 
          type: 'success', 
          message: `¡El producto "${productName}" se guardó exitosamente!` 
        };
        sessionStorage.setItem('showNotification', JSON.stringify(notification));
        
      } catch (imageError) {
        // Solo se guardó la receta
        console.error('Error al subir la imagen:', imageError);
        const notification = { 
          type: 'warning', 
          message: `El producto "${productName}" se creó, pero la imagen no subió: ${imageError.message}` 
        };
        sessionStorage.setItem('showNotification', JSON.stringify(notification));
      }
    
    } else {
      // Notificamos que la receta se guardó pero la imagen no
      const notification = { type: 'success', message: 'Producto guardado exitosamente!' };
      sessionStorage.setItem('showNotification', JSON.stringify(notification));
    }

    // Si se creó la receta (con o sin imagen) se redirige a la tabla de recetas
    window.location.href = 'admin-products.html';
  });

  productForm.addEventListener('input', () => {
    if (productForm.classList.contains('was-validated')) {
      productForm.classList.remove('was-validated');
    }
    notificationContainer.innerHTML = ''; 
  });

});