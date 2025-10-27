// Importamos las funciones necesarias, incluyendo las NUEVAS
import { getRecipeById, updateRecipe, uploadRecipeImage, BASE_URL } from './admin-api.js';

document.addEventListener('DOMContentLoaded', () => {

    // DOM
    const recipeForm = document.getElementById('recipeForm');
    const imageFile = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');
    const ingredientList = document.getElementById('ingredientList');
    const addIngredientBtn = document.getElementById('addIngredient');
    const stepList = document.getElementById('stepList');
    const addStepBtn = document.getElementById('addStep');
    const notificationContainer = document.getElementById('notificationContainer');

    // Si no es la página correcta, salimos
    if (!recipeForm) {
        return;
    }

    // Obtener id de url
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    // Si no hay ID, devolvemos al usuario a la lista
    if (!recipeId) {
        window.location.href = 'admin-recipes.html';
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
        const reader = new FileReader();
        reader.onload = (e) => imagePreview.src = e.target.result;
        reader.readAsDataURL(file);
        }
    });

    const createIngredientField = (showRemoveButton = true) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'dynamic-field-wrapper mb-2';

        const removeButtonHtml = showRemoveButton
            ? `<button class="btn btn-danger remove-item" type="button" aria-label="Quitar ingrediente">&times;</button>`
            : '';

        wrapper.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control" name="ingredientText" placeholder="Nuevo ingrediente" required maxlength="255">
            ${removeButtonHtml} 
            <div class="invalid-feedback">El ingrediente no puede estar vacío</div>
        </div>
        `;
        ingredientList.appendChild(wrapper);
        return wrapper;
    };

    const createStepField = (showRemoveButton = true) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'dynamic-field-wrapper mb-2';

        const removeButtonHtml = showRemoveButton
            ? `<button class="btn btn-danger remove-item" type="button" aria-label="Quitar paso">&times;</button>`
            : '';
        
        wrapper.innerHTML = `
        <div class="input-group">
            <textarea class="form-control" name="instruction" placeholder="Nueva instrucción" rows="2" required></textarea>
            ${removeButtonHtml}
            <div class="invalid-feedback">La instrucción del paso no puede estar vacía.</div>
        </div>
        `;
        stepList.appendChild(wrapper);
        return wrapper;
    };

    const handleRemoveItem = (event) => {
        if (event.target.classList.contains('remove-item')) {
        event.target.closest('.dynamic-field-wrapper').remove();
        }
    };

    addIngredientBtn.addEventListener('click', createIngredientField);
    addStepBtn.addEventListener('click', createStepField);
    ingredientList.addEventListener('click', handleRemoveItem);
    stepList.addEventListener('click', handleRemoveItem);

    // Rellenar con la receta
    const populateForm = (recipe) => {
        // Rellenar campos simples
        recipeForm.elements.name.value = recipe.name;
        recipeForm.elements.shortDescription.value = recipe.shortDescription;
        recipeForm.elements.fullDescription.value = recipe.fullDescription;
        recipeForm.elements.category.value = recipe.category;
        
        // Rellenar título de la página
        document.title = `Editar: ${recipe.name} - Admin El Truco`;

        // Rellenar imagen
        if (recipe.imageFilename) {
        const backendRootUrl = BASE_URL.replace('/api', '');
        imagePreview.src = `${backendRootUrl}/images/recipes/${recipe.imageFilename}`;
        }

        // Rellenar Ingredientes
        ingredientList.innerHTML = ''; 
        recipe.ingredients.forEach((ingredient, index) => {
            // El prumer campo no tiene botón para borrar
            const showRemove = index > 0;
            // Creamos un nuevo campo
            const fieldWrapper = createIngredientField(showRemove);
            // Le ponemos el valor
            fieldWrapper.querySelector('[name="ingredientText"]').value = ingredient.ingredientText;
        });
        // Si la receta no tenía ingredientes, añadimos uno vacío
        if (recipe.ingredients.length === 0) {
        createIngredientField(false);
        }


        // Rellenar Pasos
        stepList.innerHTML = '';
        recipe.steps.forEach((step, index) => {
            const showRemove = index > 0;
            const fieldWrapper = createStepField(showRemove);
            fieldWrapper.querySelector('[name="instruction"]').value = step.instruction;
        });
        if (recipe.steps.length === 0) {
            createStepField(false);
        }
    };

    // Carga la receta al iniciar la página
    const loadRecipe = async () => {
        try {
            const recipe = await getRecipeById(recipeId);
            populateForm(recipe);
        } catch (error) {
            console.error('Error al cargar la receta:', error);
            showNotification(`No se pudo cargar la receta: ${error.message}`, 'danger');
            // Deshabilitamos el formulario si no se pudo cargar
            recipeForm.querySelector('button[type="submit"]').disabled = true;
        }
    };

    recipeForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        notificationContainer.innerHTML = '';
        
        if (!recipeForm.checkValidity()) {
        event.stopPropagation();
        recipeForm.classList.add('was-validated'); 
        showNotification('Por favor, corrige los errores marcados.', 'danger');
        return; 
        }
        recipeForm.classList.add('was-validated');
        
        const submitButton = recipeForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando...';

        let recipeData;

        try {
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
        recipeData.ingredients = Array.from(ingredientInputs).map(input => ({ ingredientText: input.value })).filter(item => item.ingredientText.trim() !== '');
        const stepInputs = recipeForm.querySelectorAll('[name="instruction"]');
        recipeData.steps = Array.from(stepInputs).map((input, index) => ({ stepOrder: index + 1, instruction: input.value })).filter(item => item.instruction.trim() !== '');
        
        // Enviar petición PUT
        await updateRecipe(recipeId, recipeData);

        // Subir nueva imagen
        const imageToUpload = imageFile.files[0];
        if (imageToUpload) {
            const imageFormData = new FormData();
            imageFormData.append('image', imageToUpload); 
            await uploadRecipeImage(recipeId, imageFormData);
        }

        // Redireccionar con mensaje de éxito
        const recipeName = recipeData.name;
        const notification = { 
            type: 'success', 
            message: `¡La receta "${recipeName}" se actualizó exitosamente!` 
        };
        sessionStorage.setItem('showNotification', JSON.stringify(notification));
        window.location.href = 'admin-recipes.html';
        
        } catch (error) {
            
        console.error('Error en el proceso de actualización:', error);
        let userMessage = error.message;
        if (userMessage.includes('Duplicate entry')) {
            userMessage = 'Ya existe OTRA receta con este nombre. Elige un nombre diferente.';
        }
        showNotification(`Hubo un error al actualizar: ${userMessage}`, 'danger');
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Cambios';
        }
    });

    loadRecipe();
});