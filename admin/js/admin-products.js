import { getAllProducts, deleteProduct, deleteVariant, updateVariant, BASE_URL } from './admin-api.js';

document.addEventListener('DOMContentLoaded', () => {

  // DOM
  const adminProductList = document.getElementById('adminProductList');
  const notificationContainer = document.getElementById('notificationContainer');
  
  // Modal de confirmación
  const deleteConfirmModalEl = document.getElementById('deleteConfirmModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  const deleteVariantModalEl = document.getElementById('deleteVariantModal');
  const confirmDeleteVariantBtn = document.getElementById('confirmDeleteVariantBtn');

  // modal para ampliar la imagen
  const imagePreviewModalEl = document.getElementById('imagePreviewModal');
  const modalImage = document.getElementById('modalImage');
  const imagePreviewModalLabel = document.getElementById('imagePreviewModalLabel');
  
  // Si no estamos en la página correcta, no hacer nada
  if (!adminProductList) {
    return;
  }

  // Instancia de los modales
  const deleteModal = new bootstrap.Modal(deleteConfirmModalEl);
  const deleteVariantModal = new bootstrap.Modal(deleteVariantModalEl);
  const imageModal = new bootstrap.Modal(imagePreviewModalEl);

  let productIdToDelete = null;
  let variantToDelete = { productId: null, variantId: null };

  function getImageUrl(mainImage) {
    const backendRootUrl = BASE_URL.replace('/api', '');
    
    if (!mainImage) {
      return 'https://placehold.co/80x80/b2b2b2/ffffff?text=Sin+Imagen';
    }

    if (mainImage.startsWith('img/')) {
      return `../${mainImage}`;
    }
    
    if (!mainImage.includes('/')) {
      return `${backendRootUrl}/images/products/${mainImage}`;
    }
    
    if (mainImage.startsWith('public/')) {
      const filename = mainImage.split('/').pop();
      return `${backendRootUrl}/images/products/${filename}`;
    }
    
    return mainImage;
  }

  // Alertas para el usuario
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

  const checkSuccessNotification = () => {
    const notificationString = sessionStorage.getItem('showNotification');
    
    if (notificationString) {
      try {
        const notification = JSON.parse(notificationString);
        showNotification(notification.message, notification.type);
        sessionStorage.removeItem('showNotification');
      } catch (e) {
        console.error('Error al parsear la notificación:', e);
        sessionStorage.removeItem('showNotification');
      }
    }
  };

  const getFriendlyCategoryName = (categoryKey) => {
    const categoryMap = {
      huevos: 'Huevos',
      abono: 'Abono',
      aves: 'Aves',
      otros: 'Otros'
    };
    return categoryMap[categoryKey] || categoryKey;
  };


 const renderVariantsTable = (variants, productId) => {
    if (!variants || variants.length === 0) {
      return '<p class="text-muted mb-0">No hay variantes disponibles</p>';
    }

    return `
      <div class="table-responsive">
        <table class="table table-sm table-bordered mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 80px;">Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th style="width: 120px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${variants.map(variant => {
              const variantImageUrl = getImageUrl(variant.image || variant.variantImage);
              
              return `
                <tr data-variant-id="${variant.id}">
                  <td class="text-center">
                    <img src="${variantImageUrl}" 
                         alt="${variant.name || 'Variante'}" 
                         class="variant-thumbnail img-preview-trigger"
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer;">
                  </td>
                  <td class="align-middle"><strong>${variant.name || 'N/A'}</strong></td>
                  <td class="align-middle"><span>$${variant.price || '0.00'}</span></td>
                  <td class="align-middle">
                    <span class="badge ${variant.stock > 0 ? 'bg-info' : 'bg-warning'} text-light">
                      ${variant.stock !== undefined ? variant.stock : 'N/A'}
                    </span>
                  </td>
                  <td class="align-middle text-center">
                    <a href="edit-variant.html?productId=${productId}&variantId=${variant.id}" 
                       class="btn btn-outline-primary btn-sm me-1" 
                       aria-label="Editar variante ${variant.name}">
                      <i class="bi bi-pencil-fill"></i>
                    </a>
                    <button class="btn btn-outline-danger btn-sm delete-variant-btn" 
                            data-product-id="${productId}"
                            data-variant-id="${variant.id}"
                            aria-label="Eliminar variante ${variant.name}">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const renderProducts = (products) => {
  adminProductList.innerHTML = '';
  if (!products || products.length === 0) {
    adminProductList.innerHTML = `
      <tr><td colspan="7" class="text-center p-4">No se encontraron productos.</td></tr>
    `;
    return;
  }

  products.forEach(product => {
    // Fila principal del producto
    const row = document.createElement('tr');
    row.setAttribute('data-product-id', product.id);

    const imageUrl = getImageUrl(product.mainImage);
    const numVariants = product.variants ? product.variants.length : 0;

    row.innerHTML = `
      <td data-label="Imagen">
        <img src="${imageUrl}" alt="${product.name}" class="admin-recipe-thumbnail img-preview-trigger">
      </td>
      <td data-label="Nombre">${product.name}</td>
      <td data-label="Precio Base">$${product.basePrice}</td>
      <td data-label="Categoría">${getFriendlyCategoryName(product.category)}</td>
      <td data-label="No. de variantes">
        ${numVariants > 0 ? `
          <button class="btn btn-sm btn-outline-secondary toggle-variants-btn" 
                  data-product-id="${product.id}"
                  aria-label="Ver variantes de ${product.name}">
            ${numVariants} <i class="bi bi-chevron-down"></i>
          </button>
        ` : `
          <button class="btn btn-sm btn-outline-secondary toggle-variants-btn" 
                  data-product-id="${product.id}"
                  aria-label="Ver variantes de ${product.name}">
            ${numVariants} <i class="bi bi-chevron-down"></i>
          </button>
        `}
      </td>
      <td data-label="Activo">
        <span class="badge ${product.active ? 'bg-success' : 'bg-secondary'}">
          ${product.active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td data-label="Acciones" class="text-end">
        <a href="edit-product.html?id=${product.id}" class="btn btn-outline-primary btn-sm me-2" aria-label="Editar ${product.name}">
          <i class="bi bi-pencil-fill"></i>
        </a>
        <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${product.id}" aria-label="Eliminar ${product.name}">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
    
    adminProductList.appendChild(row);

    const variantsRow = document.createElement('tr');
    variantsRow.classList.add('variants-row', 'd-none');
    variantsRow.setAttribute('data-variants-for', product.id);

    if (numVariants > 0) {
      // Si tiene variantes, mostrar tabla
      variantsRow.innerHTML = `
        <td colspan="7" class="bg-light p-3">
          <div class="variants-container">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0">Variantes de "${product.name}"</h6>
              <a href="add-variant.html?productId=${product.id}" class="btn btn-verde">
                <i class="bi bi-plus-circle-fill me-1"></i>Nueva Variante
              </a>
            </div>
            ${renderVariantsTable(product.variants, product.id)}
          </div>
        </td>
      `;
    } else {
      variantsRow.innerHTML = `
        <td colspan="7" class="bg-light p-3">
          <div class="variants-container text-center">
            <p class="text-muted mb-3">Este producto aún no tiene variantes</p>
            <a href="add-variant.html?productId=${product.id}" class="btn btn-verde">
              <i class="bi bi-plus-circle-fill me-1"></i>Agregar Primera Variante
            </a>
          </div>
        </td>
      `;
    }

    // Agregar la fila de variantes al final
    adminProductList.appendChild(variantsRow);
  });
};


  const toggleVariants = (productId) => {
    const variantsRow = document.querySelector(`tr[data-variants-for="${productId}"]`);
    const toggleBtn = document.querySelector(`button[data-product-id="${productId}"]`);
    
    if (variantsRow && toggleBtn) {
      const isHidden = variantsRow.classList.contains('d-none');
      const icon = toggleBtn.querySelector('i');
      
      if (isHidden) {
        variantsRow.classList.remove('d-none');
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-up');
      } else {
        variantsRow.classList.add('d-none');
        icon.classList.remove('bi-chevron-up');
        icon.classList.add('bi-chevron-down');
      }
    }
  };

  const loadProducts = async () => {
    try {
      const products = await getAllProducts();
      renderProducts(products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      showNotification(`Error al cargar productos: ${error.message}`, 'danger');
      adminProductList.innerHTML = `
        <tr><td colspan="7" class="text-center p-4 text-danger">Error al cargar los datos.</td></tr>
      `;
    }
  };

  const performDeleteVariant = async () => {
    if (!variantToDelete.productId || !variantToDelete.variantId) return;

    confirmDeleteVariantBtn.disabled = true;
    confirmDeleteVariantBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Eliminando...';

    try {
      await deleteVariant(variantToDelete.productId, variantToDelete.variantId);
      
      showNotification('Variante eliminada con éxito.', 'success');
      
      // Eliminar la fila de la variante
      const variantRow = document.querySelector(`tr[data-variant-id="${variantToDelete.variantId}"]`);
      if (variantRow) {
        variantRow.remove();
      }

      // Actualizar el contador de variantes
      const productRow = document.querySelector(`tr[data-product-id="${variantToDelete.productId}"]`);
      if (productRow) {
        const variantsRow = document.querySelector(`tr[data-variants-for="${variantToDelete.productId}"]`);
        const remainingVariants = variantsRow ? variantsRow.querySelectorAll('tbody tr').length : 0;
        
        const variantsCell = productRow.querySelector('td[data-label="No. de variantes"]');
        if (variantsCell) {
          if (remainingVariants === 0) {
            variantsCell.textContent = '0';
            if (variantsRow) variantsRow.remove();
          } else {
            const toggleBtn = variantsCell.querySelector('.toggle-variants-btn');
            if (toggleBtn) {
              toggleBtn.childNodes[0].textContent = remainingVariants + ' ';
            }
          }
        }
      }

    } catch (error) {
      console.error('Error al eliminar variante:', error);
      showNotification(`Error al eliminar: ${error.message}`, 'danger');
    } finally {
      deleteVariantModal.hide();
      confirmDeleteVariantBtn.disabled = false;
      confirmDeleteVariantBtn.innerHTML = '<i class="bi bi-trash-fill me-1"></i>Eliminar Variante';
      variantToDelete = { productId: null, variantId: null };
    }
  };

  const handleTabClick = (event) => {
    // Revisar si el click fue en el botón de variantes
    const variantsButton = event.target.closest('.toggle-variants-btn');
    if (variantsButton) {
      const productId = variantsButton.dataset.productId;
      toggleVariants(productId);
      return;
    }

    const deleteVariantButton = event.target.closest('.delete-variant-btn');
    if (deleteVariantButton) {
      variantToDelete = {
        productId: deleteVariantButton.dataset.productId,
        variantId: deleteVariantButton.dataset.variantId
      };
      deleteVariantModal.show();
      return;
    }

    const deleteButton = event.target.closest('.delete-btn');
    if (deleteButton) {
      productIdToDelete = deleteButton.dataset.id;
      deleteModal.show();
      return;
    }


    const imageTrigger = event.target.closest('.img-preview-trigger');
    if (imageTrigger) {
      const src = imageTrigger.src;
      const alt = imageTrigger.alt;
      
      modalImage.src = src;
      modalImage.alt = alt;
      imagePreviewModalLabel.textContent = alt;

      imageModal.show();
      return;
    }
  };

  // Confirmar eliminar
  const performDelete = async () => {
    if (!productIdToDelete) return;

    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Eliminando...';

    try {
      await deleteProduct(productIdToDelete);
      
      showNotification('Producto eliminado con éxito.', 'success');
      
      // Eliminar la fila del producto Y su fila de variantes si existe
      const productRow = document.querySelector(`tr[data-product-id="${productIdToDelete}"]`);
      const variantsRow = document.querySelector(`tr[data-variants-for="${productIdToDelete}"]`);
      
      if (productRow) productRow.remove();
      if (variantsRow) variantsRow.remove();

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      showNotification(`Error al eliminar: ${error.message}`, 'danger');
    
    } finally {
      deleteModal.hide();
      confirmDeleteBtn.disabled = false;
      productIdToDelete = null;
    }
  };

  // Carga los productos al iniciar
  loadProducts();

  // Verifica si venimos después de agregar un producto
  checkSuccessNotification();

  // Listener en la tabla para los botones
  adminProductList.addEventListener('click', handleTabClick);
  
  // Listener en el botón de confirmación del modal
  confirmDeleteBtn.addEventListener('click', performDelete);

  confirmDeleteVariantBtn.addEventListener('click', performDeleteVariant);

// Listener para guardar cambios de variante
  saveVariantBtn.addEventListener('click', saveVariantChanges);
});