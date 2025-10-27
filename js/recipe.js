import { getRecipeBySlug } from './api.js';

// URL base para los recursos estáticos (imágenes) en entorno Live Server
const BASE_URL = 'http://localhost:8080/images/recipes';

// Función que construye todo el HTML de la receta y lo llena con datos.
function renderRecipeHtml(recipe) {
    
  // Generar sub-listas de ingredientes y pasos
  const ingredientsHtml = recipe.ingredients.map(ingredient => `
    <li class="d-flex align-items-start mb-2">
      <span class="me-2 text-success">o</span> ${ingredient.ingredientText}
    </li>
  `).join('');

  const stepsHtml = recipe.steps.map(step => `
    <li class="mb-3 p-2 border-start border-5 border-success">
      ${step.instruction}
    </li>
  `).join('');

  // Construir la URL de la imagen (usando BASE_URL para Live Server)
  const imageUrl = `${BASE_URL}/${recipe.imageFilename}`;
  
  // Devolver TODA la estructura principal
  return `
    <header class="text-center py-5 mb-4">
      <h1 class="display-5 fw-bold">${recipe.name}</h1>
    </header>

    <div class="row">
      <div class="col-md-6 col-lg-7">
        <figure class="mb-4">
          <div class="ratio ratio-16x9">
            <img loading="lazy" src="${imageUrl}" alt="Imagen de la receta: ${recipe.name}" class="object-fit-cover  rounded-5 shadow-top-left" />
          </div>
          <figcaption class="mt-3 lead text-muted">
            ${recipe.fullDescription}
          </figcaption>
        </figure>
      </div>

      <div class="col-md-6 col-lg-5">
        <h2 class="h4 border-bottom pb-2 mb-3">Ingredientes</h2>
        <ul class="list-unstyled">
          ${ingredientsHtml}
        </ul>

        <h2 class="h4 border-bottom pb-2 mb-3">Pasos</h2>
        <ol class="list-unstyled">
          ${stepsHtml}
        </ol>
      </div>
    </div>
  `;
}

// Muestra el error en la interfaz (se mantiene la lógica de UX amigable)
function displayFriendlyError(errorMessage) {
  const container = document.querySelector('.container-lg'); 

  container.innerHTML = `
    <div class="row text-center py-5">
      <div class="col-12 py-5">
        <h1 class="display-4 rendering-error-message">
          ${errorMessage === "NOT_FOUND" 
            ? "¡Vaya! No encontramos esa receta." 
            : "Estamos teniendo problemas para cargar la receta."}
        </h1>
        <p class="fw-bold fs-4 mt-4">
          ${errorMessage === "NOT_FOUND" 
            ? "Parece que la URL no es correcta o la receta ha sido removida. Visita nuevamente nuestro recetario."
            : "Por favor, inténtalo más tarde."}
        </p>
        <a href="recipes.html" class="btn btn-dark mt-3">Volver al Recetario</a>
      </div>
    </div>
  `;
}

async function fetchAndRenderRecipe() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('receta');
  
  const container = document.querySelector('.container-lg');
  const pageTitle = document.getElementById('pageTitle'); // Se usa solo para el <title> del documento

  if (!slug) {
    // Si no hay parámetro, muestra error 404
    displayFriendlyError("NOT_FOUND");
    return; 
  }

  // Mostrar mensaje de carga
  container.innerHTML = `
    <div class="row text-center py-5" id="temp-loading-message">
      <div class="col-12 p-5">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Cargando receta...</span>
        </div>
        <p class="mt-2">Cargando receta...</p>
      </div>
    </div>
  `;

  try {
    // Llamada a la API
    const recipe = await getRecipeBySlug(slug);
    
    // Generar la receta
    const recipeHtml = renderRecipeHtml(recipe);
    container.innerHTML = recipeHtml; 
    
    // Cambiar título a la pestaña
    pageTitle.textContent = `El Truco - ${recipe.name}`; 
  } catch (error) {
    // Mostrar error al usuario
    displayFriendlyError(error.message);
  }
}

// Llamamos la función al cargar el DOM
document.addEventListener('DOMContentLoaded', fetchAndRenderRecipe);