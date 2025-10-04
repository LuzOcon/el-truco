// Esperar a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {
  // Obtener los elementos del DOM (IDs usados como anclas de script)
  const pageTitle = document.getElementById('pageTitle');
  const recipeNameHeader = document.getElementById('recipeNameHeader');
  const recipeImage = document.getElementById('recipeImage');
  const recipeDescription = document.getElementById('recipeDescription');
  const recipeIngredients = document.getElementById('recipeIngredients');
  const recipeSteps = document.getElementById('recipeSteps'); // Datos de la receta (simulados, para este ejemplo de front-end)
  
  const recipeData = {
    name: 'Sopa de Pollo Orgánica y Rústica',
    image: 'https://placehold.co/800x500/c8dbd1/708c69?text=Sopa+Orgánica', // Placeholder con colores de branding
    description:
      'Deliciosa sopa de pollo casera preparada con vegetales orgánicos frescos y de temporada, ideal para reconfortar el alma y reforzar el sistema inmunológico.',
    ingredients: [
      '1 pechuga de pollo orgánico (sin hueso)',
      '2 zanahorias grandes',
      '1 papa grande',
      '1 rama de apio (de cultivo ecológico)',
      'Sal marina y pimienta fresca',
    ],
    steps: [
      'Cocer la pechuga en agua hirviendo con sal y retirar los residuos de la superficie.',
      'Agregar las verduras cortadas en trozos medianos y una pizca de pimienta.',
      'Dejar hervir a fuego lento durante 20 minutos, o hasta que las verduras estén suaves.',
      'Servir caliente, decorado con perejil fresco.',
    ],
  }; 
  
  // Función para mostrar los detalles de la receta
  function displayRecipeDetails(recipe) {
    // Establecer el título de la página
    pageTitle.textContent = `El Orgánico - ${recipe.name}`; 
    
    // Encabezado de la receta
    recipeNameHeader.textContent = recipe.name; 
    
    // Imagen: Se establece la fuente y el texto alternativo (alt) para A11Y y SEO.
    recipeImage.src = recipe.image;
    recipeImage.alt = `Imagen de la receta: ${recipe.name}`; 
    
    // Descripción
    recipeDescription.textContent = recipe.description; 
    
    // Ingredientes
    recipe.ingredients.forEach((ingredient) => {
      const li = document.createElement('li');
      
      li.classList.add('d-flex', 'align-items-start', 'mb-2'); 
      li.innerHTML = `<span class="me-2 text-success">o</span> ${ingredient}`;
      //li.textContent = ingredient;
      recipeIngredients.appendChild(li);
    }); 
    
    // Pasos
    recipe.steps.forEach((step) => {
      const li = document.createElement('li'); 
      
      // Clase de utilidad Bootstrap para espaciado.
      li.classList.add('mb-3', 'p-2', 'border-start', 'border-5', 'border-success');
      li.textContent = step;
      recipeSteps.appendChild(li);
    });
  } 
  
  // Llamar a la función para mostrar los detalles de la receta con los datos simulados
  displayRecipeDetails(recipeData);
});
