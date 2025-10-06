// Obtener el elemento select de categoría
const categoryFilterSelect = document.getElementById('categoryFilter');

// Obtener el contenedor de recetas
const recipesContainer = document.getElementById('recipesContainer');

// Datos de recetas (generados)
const recipes = [
  {
    name: 'Sopa de Pollo',
    category: 'lunch',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Sopa+Orgánica',
    description: 'Deliciosa sopa de pollo casera.',
    ingredients: ['1 pechuga de pollo', '2 zanahorias', '1 papa', '1 rama de apio', 'Sal y pimienta'],
    steps: ['Cocer la pechuga en agua con sal.', 'Agregar verduras en trozos.', 'Hervir 20 minutos y servir.'],
  },
  {
    name: 'Panqueques de Avena',
    category: 'breakfast',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Panqueques',
    description: 'Esponjosos panqueques de avena para empezar el día.',
    ingredients: ['1 taza de avena', '1 huevo', '1 plátano', '½ taza de leche', '1 cdta polvo para hornear'],
    steps: ['Licuar todos los ingredientes.', 'Cocinar en sartén caliente.', 'Servir con miel o fruta.'],
  },
  {
    name: 'Ensalada de Quinoa',
    category: 'lunch',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Ensalada+de+Quinoa',
    description: 'Refrescante ensalada de quinoa con vegetales frescos.',
    ingredients: ['1 taza de quinoa cocida', '1 pepino', '1 tomate', '½ cebolla morada', 'Limón y aceite de oliva'],
    steps: ['Cocer quinoa y enfriar.', 'Mezclar con vegetales.', 'Aliñar con limón y aceite.'],
  },
  {
    name: 'Tacos de Coliflor',
    category: 'dinner',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Tacos+de+Coliflor',
    description: 'Sabrosos tacos de coliflor con un toque picante.',
    ingredients: ['1 coliflor', 'Tortillas de maíz', 'Salsa picante', 'Cilantro', 'Cebolla'],
    steps: ['Asar coliflor con especias.', 'Servir en tortillas.', 'Agregar cebolla y salsa.'],
  },
  {
    name: 'Brownies de Chocolate',
    category: 'dessert',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Brownies',
    description: 'Brownies suaves y chocolatosos para compartir.',
    ingredients: ['1 taza de harina', '200 g chocolate', '2 huevos', '½ taza azúcar', '½ taza mantequilla'],
    steps: [
      'Batir huevos con azúcar.',
      'Agregar chocolate y mantequilla.',
      'Incorporar harina.',
      'Hornear 25 min a 180°C.',
    ],
  },
  {
    name: 'Smoothie Verde',
    category: 'drink',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Smoothie+Verde',
    description: 'Bebida refrescante y nutritiva.',
    ingredients: ['1 taza espinaca', '1 plátano', '½ taza piña', '1 taza agua'],
    steps: ['Licuar todo hasta mezcla suave.', 'Servir frío.'],
  },
  {
    name: 'Pizza Margarita',
    category: 'dinner',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Pizza+Margarita',
    description: 'Pizza clásica con jitomate, albahaca y mozzarella.',
    ingredients: ['Masa para pizza', '200 g mozzarella', 'Salsa de jitomate', 'Albahaca fresca'],
    steps: ['Extender masa y cubrir con salsa.', 'Agregar mozzarella y albahaca.', 'Hornear 15 min a 220°C.'],
  },
  {
    name: 'Omelette de Espinaca',
    category: 'breakfast',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Omelette',
    description: 'Desayuno rápido y nutritivo.',
    ingredients: ['2 huevos', '½ taza espinaca', 'Queso rallado', 'Sal y pimienta'],
    steps: ['Batir huevos y salpimentar.', 'Agregar espinaca.', 'Cocinar en sartén y doblar con queso.'],
  },
  {
    name: 'Pasta Alfredo',
    category: 'lunch',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Pasta+Alfredo',
    description: 'Cremosa pasta con salsa Alfredo casera.',
    ingredients: ['200 g pasta', '1 taza crema', 'Mantequilla', 'Queso parmesano', 'Ajo'],
    steps: ['Cocer pasta.', 'Preparar salsa con mantequilla, ajo y crema.', 'Mezclar con pasta y parmesano.'],
  },
  {
    name: 'Guacamole',
    category: 'dip',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Guacamole',
    description: 'Dip fresco para acompañar con totopos.',
    ingredients: ['2 aguacates', '1 tomate', '½ cebolla', 'Limón', 'Cilantro'],
    steps: ['Triturar aguacates.', 'Agregar vegetales picados.', 'Sazonar con limón y cilantro.'],
  },
  {
    name: 'Arroz con Leche',
    category: 'dessert',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Arroz+con+Leche',
    description: 'Postre tradicional cremoso con canela.',
    ingredients: ['1 taza arroz', '4 tazas leche', '½ taza azúcar', '1 raja canela'],
    steps: ['Cocer arroz con leche y canela.', 'Agregar azúcar y remover.', 'Servir frío o caliente.'],
  },
  {
    name: 'Hamburguesa Veggie',
    category: 'dinner',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Hamburguesa',
    description: 'Hamburguesa vegetariana de garbanzos.',
    ingredients: ['1 taza garbanzos cocidos', 'Pan de hamburguesa', 'Lechuga', 'Tomate'],
    steps: ['Hacer puré de garbanzos con especias.', 'Formar tortitas y freír.', 'Servir en pan con vegetales.'],
  },
  {
    name: 'Crepas Dulces',
    category: 'dessert',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Crepas',
    description: 'Crepas finas rellenas de fruta y chocolate.',
    ingredients: ['1 taza harina', '2 huevos', '1 taza leche', 'Mantequilla'],
    steps: ['Preparar masa líquida.', 'Cocinar capas finas en sartén.', 'Rellenar con fruta y chocolate.'],
  },
  {
    name: 'Chilaquiles Verdes',
    category: 'breakfast',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Chilaquiles+Verdes',
    description: 'Platillo mexicano con totopos bañados en salsa verde.',
    ingredients: ['Totopos', 'Salsa verde', 'Crema', 'Queso fresco', 'Cebolla'],
    steps: ['Calentar totopos en salsa verde.', 'Servir con crema, queso y cebolla.'],
  },
  {
    name: 'Limonada Fresca',
    category: 'drink',
    image: 'https://placehold.co/400x300/c8dbd1/708c69?text=Limonada',
    description: 'Bebida fresca para días calurosos.',
    ingredients: ['Jugo de 3 limones', '1 litro de agua', '½ taza azúcar'],
    steps: ['Mezclar jugo de limón con agua.', 'Endulzar al gusto.', 'Servir con hielo.'],
  },
];

// Función para generar tarjetas de recetas
function generateRecipeCards(filteredRecipes) {
  recipesContainer.innerHTML = ''; // Limpiar el contenedor
  filteredRecipes.forEach((recipe) => {
    // Identificador único, para uso futuro en URL personalizada
    const recipeSlug = recipe.name.toLowerCase().replace(/\s+/g, '-'); 
    const cardHTML = `  
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">  
                <div class="card h-100 recipe-card">  
                    <img loading="lazy" src="${recipe.image}" class="card-img-top"  alt="${recipe.name}">  
                    <div class="card-body d-flex flex-column">  
                        <h3 class="card-title">${recipe.name}</h3>  
                        <p class="card-text">${recipe.description}</p>  
                        <a href="recipe-template.html?recipe=${recipeSlug}" class="btn mt-auto recipe-card-button">Ver Receta</a> 
                    </div>  
                </div>  
            </div>  
        `;
    recipesContainer.innerHTML += cardHTML;
  });
}

// Función para filtrar recetas por categoría
function filterRecipes(category) {
  if (category === 'all') {
    generateRecipeCards(recipes);
  } else {
    const filteredRecipes = recipes.filter((recipe) => recipe.category === category);
    generateRecipeCards(filteredRecipes);
  }
}

// Listener de evento para la selección de categoría
categoryFilterSelect.addEventListener('change', function () {
  const selectedCategory = this.value;
  filterRecipes(selectedCategory);
});

// Generar tarjetas iniciales (todas las recetas)
generateRecipeCards(recipes);
