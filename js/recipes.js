import { getAllRecipes } from './api.js';

// Elementos del DOM
const categoryFilterSelect = document.getElementById('categoryFilter');
const recipesContainer = document.getElementById('recipesContainer');

// Para tomar las imagenes de una carpeta estática en el server
const BASE_URL = 'http://localhost:8080/images/recipes'; // para uso con live server

// Mapeo de slugs de categorías a nombres para el usuario
const categoryLabels = new Map([
  ['breakfast', 'Desayuno'],
  ['lunch', 'Almuerzo'],
  ['dinner', 'Cena'],
  ['dessert', 'Postre'],
  ['dip', 'Salsas / Aderezos'],
  ['drink', 'Bebida'],
]);

let allRecipes = []; // Almacena todas las recetas cargadas para el filtro

// Generamos las categorias para el filtro
function generateCategoryOptions(recipes) {
  const categories = recipes.map(recipe => recipe.category);
  const uniqueCategories = [...new Set(categories)];

  const selectElement = document.getElementById('categoryFilter');
  selectElement.innerHTML = '<option value="all">Todas</option>'; 

  uniqueCategories.forEach(categorySlug => {
    const option = document.createElement('option');
    option.value = categorySlug;
    option.textContent = categoryLabels.get(categorySlug) || categorySlug;
    selectElement.appendChild(option);
  });
}

function generateRecipeCards(filteredRecipes) {
  recipesContainer.innerHTML = ''; 
  filteredRecipes.forEach((recipe) => {
    // Usa el slug de la DB para la URL limpia
    const recipeSlug = recipe.slug; 
    
    // Usa el nombre del archivo de la DB con la ruta estática de Spring Boot
    const imageUrl = `${BASE_URL}/${recipe.imageFilename}`;
    
    const cardHTML = ` 
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4"> 
        <div class="card h-100 recipe-card bg-pattern-normal"> 
          <div class="ratio ratio-4x3"> 
            <img 
              loading="lazy" 
              src="${imageUrl}" 
              class="card-img-top object-fit-cover" 
              alt="${recipe.name}"
            > 
          </div> 
          <div class="card-body d-flex flex-column"> 
            <h3 class="card-title">${recipe.name}</h3> 
            <p class="card-text">${recipe.shortDescription}</p> 
            <a href="recipe.html?receta=${recipeSlug}" class="btn btn-verde">Ver Receta</a> 
          </div> 
        </div> 
      </div> 
    `;
    recipesContainer.innerHTML += cardHTML;
  });
}

function filterRecipes(category, recipesToFilter) {
  if (category === 'all') {
    generateRecipeCards(recipesToFilter);
  } else {
    const filteredRecipes = recipesToFilter.filter((recipe) => recipe.category === category);
    generateRecipeCards(filteredRecipes);
  }
}

async function fetchAndRenderRecipes() {
  // Mostrar mensaje de carga
  recipesContainer.innerHTML = `
    <div class="col-12 text-center p-5">
      <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden">Cargando recetas...</span>
      </div>
      <p class="mt-2">Cargando recetas orgánicas...</p>
    </div>
  `;

  try {
    
    const recipes = await getAllRecipes();
    
    // Ocultar el mensaje de carga y renderizar recetas
    generateCategoryOptions(recipes); 
    generateRecipeCards(recipes); 
    
    return recipes; 
  } catch (error) {
    //console.error("Error al cargar las recetas:", error);
    // Mostrar al usuario mensaje de error si falla
    recipesContainer.innerHTML = `
      <div class="col-12 text-center p-5">
        <h1 class="display-5 rendering-error-message">
          ¡Ups! Estamos teniendo problemas para mostrar nuestras recetas.
        </h1>
        <p class="fw-bold fs-4 mt-4">
          Por favor, inténtalo más tarde.
        </p>
      </div>
    `;
    return []; 
  }
}

// Listener del select (usa el array cargado 'allRecipes')
categoryFilterSelect.addEventListener('change', function () {
  const selectedCategory = this.value;
  filterRecipes(selectedCategory, allRecipes); 
});

// Carga inicial de datos desde la API
fetchAndRenderRecipes()
.then(recipes => {
  allRecipes = recipes; 
});