import { getAllRecipes, deleteRecipe, BASE_URL } from './admin-api.js';

document.addEventListener('DOMContentLoaded', () => {

  // DOM
  const adminRecipeList = document.getElementById('adminRecipeList');
  const notificationContainer = document.getElementById('notificationContainer');
  
  // Modal de confirmación
  const deleteConfirmModalEl = document.getElementById('deleteConfirmModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  // modal para ampliar la imagen
  const imagePreviewModalEl = document.getElementById('imagePreviewModal');
  const modalImage = document.getElementById('modalImage');
  const imagePreviewModalLabel = document.getElementById('imagePreviewModalLabel');
  
  // Si no estamos en la página correcta, no hacer nada
  if (!adminRecipeList) {
    return;
  }

  // Instancia de los modales
  const deleteModal = new bootstrap.Modal(deleteConfirmModalEl);
  const imageModal = new bootstrap.Modal(imagePreviewModalEl);

  // Variable para guardar el ID que se va a borrar
  let recipeIdToDelete = null;


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
    // Busca el mensaje guardado desde la página de creación
    const successMessage = sessionStorage.getItem('showSuccessNotification');
    
    if (successMessage) {
      // Si existe lo mostramos al usuario
      showNotification(successMessage, 'success');
      
      // Se borra para que no aparezca cada vez que se recargue la página
      sessionStorage.removeItem('showSuccessNotification');
    }
  };

  // Lógica de la Lista
  const getFriendlyCategoryName = (categoryKey) => {
    const categoryMap = {
      breakfast: 'Desayuno',
      lunch: 'Almuerzo',
      dinner: 'Cena',
      dessert: 'Postre',
      dip: 'Salsas / Aderesos',
      drink: 'Bebida'
    };
    return categoryMap[categoryKey] || categoryKey;
  };

  const renderRecipes = (recipes) => {
    adminRecipeList.innerHTML = '';
    if (!recipes || recipes.length === 0) {
      adminRecipeList.innerHTML = `
        <tr><td colspan="4" class="text-center p-4">No se encontraron recetas.</td></tr>
      `;
      return;
    }

    recipes.forEach(recipe => {
      const row = document.createElement('tr');
      row.setAttribute('data-recipe-id', recipe.id);

      // Usamos la URL base del backend para las imágenes
      const backendRootUrl = BASE_URL.replace('/api', '');
      const imageUrl = recipe.imageFilename 
        ? `${backendRootUrl}/images/recipes/${recipe.imageFilename}` 
        : 'https://placehold.co/300x200/b2b2b2/ffffff?text=Sin+Imagen';

      row.innerHTML = `
            <td data-label="Imagen">
              <img src="${imageUrl}" alt="${recipe.name}" class="admin-recipe-thumbnail img-preview-trigger">
            </td>
            <td data-label="Nombre">${recipe.name}</td>
            <td data-label="Categoría">${getFriendlyCategoryName(recipe.category)}</td>
            
            <td data-label="Acciones" class="text-end">
              <a href="edit-recipe.html?id=${recipe.id}" class="btn btn-outline-primary btn-sm me-2" aria-label="Editar ${recipe.name}">
                <i class="bi bi-pencil-fill"></i>
              </a>
              <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${recipe.id}" aria-label="Eliminar ${recipe.name}">
                <i class="bi bi-trash-fill"></i>
              </button>
            </td>
        `;
      adminRecipeList.appendChild(row);
    });
  };

  const loadRecipes = async () => {
    try {
      const recipes = await getAllRecipes();
      renderRecipes(recipes);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
      showNotification(`Error al cargar recetas: ${error.message}`, 'danger');
      adminRecipeList.innerHTML = `
        <tr><td colspan="4" class="text-center p-4 text-danger">Error al cargar los datos.</td></tr>
      `;
    }
  };

  const handleTabClick = (event) => {
    // Revisar si el click fue borrar
    const deleteButton = event.target.closest('.delete-btn');
    if (deleteButton) {
      recipeIdToDelete = deleteButton.dataset.id;
      deleteModal.show();
      return; // Fin
    }

    // Revisar si el click fue en la imagen
    const imageTrigger = event.target.closest('.img-preview-trigger');
    if (imageTrigger) {
      // Obtenemos los datos de la imagen clicada
      const src = imageTrigger.src;
      const alt = imageTrigger.alt;
      
      // Colocamos los datos en el modal de imagen
      modalImage.src = src;
      modalImage.alt = alt;
      imagePreviewModalLabel.textContent = alt;

      // Mostramos el modal de imagen
      imageModal.show();
      return;
    }
  };

  // Confirmar eliminar
  const performDelete = async () => {
    if (!recipeIdToDelete) return;

    confirmDeleteBtn.disabled = true;

    try {
      // Llamamos a la API para borrar
      await deleteRecipe(recipeIdToDelete);
      
      // Mostramos notificación de éxito
      showNotification('Receta eliminada con éxito.', 'success');
      
      // Eliminamos la fila de la tabla
      document.querySelector(`tr[data-recipe-id="${recipeIdToDelete}"]`).remove();

    } catch (error) {
      console.error('Error al eliminar receta:', error);
      showNotification(`Error al eliminar: ${error.message}`, 'danger');
    
    } finally {
      deleteModal.hide();
      confirmDeleteBtn.disabled = false;
      recipeIdToDelete = null;
    }
  };

  // Carga las recetas al iniciar
  loadRecipes();

  // Verifica si venimos después de agregar una receta
  checkSuccessNotification();

  // Listener en la tabla para los botones de eliminar
  adminRecipeList.addEventListener('click', handleTabClick);
  
  // Listener en el botón de confirmación del modal
  confirmDeleteBtn.addEventListener('click', performDelete);
});