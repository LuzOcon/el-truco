const BASE_URL = 'http://localhost:8080/api';

// Obtiene todas las recetas
export async function getAllRecipes() {

    // 1.- Hacer la petición al servidor
    // Llama al endpoint de Spring Boot (API REST)
    const response = await fetch(`${BASE_URL}/recipes`);

    if (!response.ok) {
        throw new Error(`API_ERROR: Failed to fetch all recipes (Status: ${response.status})`);
    }
    // 2.- convertir la petición
    const recipes = await response.json();

    // 3.- devolvemos el JSON como objeto de js
    return recipes;
}

// Obtiene una receta por su slug para la vista individual
export async function getRecipeBySlug(slug) {
    const response = await fetch(`${BASE_URL}/recipes/${slug}`);
    
    if (response.status === 404) {
        throw new Error("NOT_FOUND");
    }

    if (!response.ok) {
        throw new Error(`API_ERROR: Failed to fetch recipe ${slug} (Status: ${response.status})`);
    }
    
    return response.json();
}