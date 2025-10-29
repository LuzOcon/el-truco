import { createRecipe, uploadRecipeImage } from './admin-api.js';

document.addEventListener('DOMContentLoaded', () => {

  // DOM
  const recipeForm = document.getElementById('recipeForm');
  const imageFile = document.getElementById('imageFile');
  const imagePreview = document.getElementById('imagePreview');
  const ingredientList = document.getElementById('ingredientList');
  const addIngredientBtn = document.getElementById('addIngredient');
  const stepList = document.getElementById('stepList');
  const addStepBtn = document.getElementById('addStep');
  const jsonOutput = document.getElementById('jsonOutput');
  const notificationContainer = document.getElementById('notificationContainer');

  if (!recipeForm) {
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

  const createIngredientField = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'dynamic-field-wrapper mb-2'; 
    wrapper.innerHTML = `
      <div class="input-group">
        <input type="text" class="form-control" name="ingredientText" placeholder="Nuevo ingrediente" aria-label="Ingrediente" required maxlength="255">
        <button class="btn btn-danger remove-item" type="button" aria-label="Quitar ingrediente">&times;</button>
        <div class="invalid-feedback">
          El ingrediente no puede estar vacío
        </div>
      </div>
    `;
    ingredientList.appendChild(wrapper);
  };

  const createStepField = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'dynamic-field-wrapper mb-2';
    wrapper.innerHTML = `
      <div class="input-group">
        <textarea class="form-control" name="instruction" placeholder="Nueva instrucción" aria-label="Instrucción del paso" rows="2" required></textarea>
        <button class="btn btn-danger remove-item" type="button" aria-label="Quitar paso">&times;</button>
        <div class="invalid-feedback">
          La instrucción del paso no puede estar vacía.
        </div>
      </div>
    `;
    stepList.appendChild(wrapper);
  };

  const handleRemoveItem = (event) => {
    if (event.target.classList.contains('remove-item')) {
      event.target.closest('.dynamic-field-wrapper').remove();
    }
  };

  //  Inicialización de Listeners del Formulario 
  addIngredientBtn.addEventListener('click', createIngredientField);
  addStepBtn.addEventListener('click', createStepField);
  ingredientList.addEventListener('click', handleRemoveItem);
  stepList.addEventListener('click', handleRemoveItem);

  recipeForm.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    notificationContainer.innerHTML = '';
    
    if (!recipeForm.checkValidity()) {
      event.stopPropagation();
      recipeForm.classList.add('was-validated'); 
      showNotification('Por favor, corrige los errores marcados en el formulario.', 'danger');
      return; 
    }
    recipeForm.classList.add('was-validated');
    
    const submitButton = recipeForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    let savedRecipe;
    let recipeData;

    try {
      // Creamos la receta
      const formData = new FormData(recipeForm);
      recipeData = {
        name: formData.get('name'),
        shortDescription: formData.get('shortDescription'),
        fullDescription: formData.get('fullDescription'),
        category: formData.get('category'),
        ingredients: [],
        steps: []
      };
      const ingredientInputs = recipeForm.querySelectorAll('[name="ingredientText"]');
      recipeData.ingredients = Array.from(ingredientInputs)
        .map(input => ({ ingredientText: input.value }))
        .filter(item => item.ingredientText.trim() !== '');
      const stepInputs = recipeForm.querySelectorAll('[name="instruction"]');
      recipeData.steps = Array.from(stepInputs)
        .map((input, index) => ({
          stepOrder: index + 1,
          instruction: input.value
        }))
        .filter(item => item.instruction.trim() !== '');
      
      savedRecipe = await createRecipe(recipeData);

    } catch (createError) {
      // Si la receta no se pudo crear, nos quedamos y mostramos error
      console.error('Error al crear la receta:', createError);

      let userMessage = createError.message;

      if (userMessage.includes('Duplicate entry') && userMessage.includes('recipes.UK2yg91gejn5gopghwqbh5k25fp')) {
        userMessage = 'Ya existe una receta con este nombre. Por favor, elige un nombre diferente.';
      }

      // Mostramos el mensaje (traducido o no)
      showNotification(`Hubo un error al guardar la receta: ${userMessage}`, 'danger');
      recipeForm.classList.remove('was-validated');
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Receta';
      return;
    }

    // Cuando la receta se crea, se intenta subir la imagen
    const recipeName = recipeData.name;
    const imageToUpload = imageFile.files[0];
    
    if (imageToUpload) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('image', imageToUpload); 
        await uploadRecipeImage(savedRecipe.id, imageFormData);
        
        // Receta e imagen se guardaron correctamente
        const notification = { 
          type: 'success', 
          message: `¡La receta "${recipeName}" se guardó exitosamente!` 
        };
        sessionStorage.setItem('showNotification', JSON.stringify(notification));
        
      } catch (imageError) {
        // Solo se guardó la receta
        console.error('Error al subir la imagen:', imageError);
        const notification = { 
          type: 'warning', 
          message: `La receta "${recipeName}" se creó, pero la imagen no subió: ${imageError.message}` 
        };
        sessionStorage.setItem('showNotification', JSON.stringify(notification));
      }
    
    } else {
      // Notificamos que la receta se guardó pero la imagen no
      const notification = { type: 'success', message: '¡Receta guardada exitosamente!' };
      sessionStorage.setItem('showNotification', JSON.stringify(notification));
    }

    // Si se creó la receta (con o sin imagen) se redirige a la tabla de recetas
    window.location.href = 'admin-recipes.html';
  });

  recipeForm.addEventListener('input', () => {
    if (recipeForm.classList.contains('was-validated')) {
      recipeForm.classList.remove('was-validated');
    }
    notificationContainer.innerHTML = ''; 
  });

});