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

  //  Lógica del Formulario 
  imageFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
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

    try {
      const formData = new FormData(recipeForm);
      const recipeData = {
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

      jsonOutput.querySelector('code').textContent = JSON.stringify(recipeData, null, 2);

      const savedRecipe = await createRecipe(recipeData);
      console.log('Éxito JSON. Receta creada con ID:', savedRecipe.id);

      const imageToUpload = imageFile.files[0];
      if (imageToUpload) {
        console.log(`Enviando imagen para la receta ID: ${savedRecipe.id}`);
        const imageFormData = new FormData();
        imageFormData.append('image', imageToUpload); 
        await uploadRecipeImage(savedRecipe.id, imageFormData);
        console.log('Éxito Imagen. Receta actualizada.');
      }

      sessionStorage.setItem('showSuccessNotification', '¡Receta guardada exitosamente!');
      window.location.href = 'admin-recipes.html';
      
    } catch (error) {
      console.error('Error en el proceso de envío:', error);
      showNotification(`Hubo un error: ${error.message}`, 'danger');
      recipeForm.classList.remove('was-validated');
    
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Receta';
    }
  });

  recipeForm.addEventListener('input', () => {
    if (recipeForm.classList.contains('was-validated')) {
      recipeForm.classList.remove('was-validated');
    }
    notificationContainer.innerHTML = ''; 
  });

});