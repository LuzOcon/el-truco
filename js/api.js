const BASE_URL = 'http://localhost:8080/api';

function getJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  };
}

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

// POST de correo para newsletter
export async function subscribeToNewsletter(email) {
  const response = await fetch(`${BASE_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(email)
  });

  if (!response.ok) {
    const error = new Error(`API_ERROR: ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.json();
}