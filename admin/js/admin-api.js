export const BASE_URL = 'http://localhost:8080/api';

function getJsonHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

async function handleApiError(response) {
  // Traducimos los códigos de estado HTTP a mensajes de usuario
  if (response.status === 413) {
    throw new Error('La imagen es demasiado grande. Intenta con una más pequeña.');
  }
  if (response.status === 400) {
    const errorText = await response.text(); 
    
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || 'Error en los datos enviados.');
    } catch (e) {
      throw new Error(errorText);
    }
  }
  if (response.status === 404) {
    throw new Error('No se encontró el recurso en el servidor (404).');
  }
  if (response.status === 500) {
    throw new Error('Error interno del servidor (500).');
  }

  // Error genérico si no es uno de los anteriores
  try {
    const errorData = await response.json();
    throw new Error(errorData.message || response.statusText);
  } catch (e) {
    // Si el 'fetch' falla por completo (CORS, red caída), entra aquí.
    throw new Error('Error de red o conexión. Revisa la consola.');
  }
}

// Petición GET para obtener TODAS las recetas
export async function getAllRecipes() {
    const response = await fetch(`${BASE_URL}/recipes`);
    
    if (!response.ok) {
        throw await handleApiError(response);
    }
    return response.json();
}

// Petición POST para crear la receta (envía JSON)
export async function createRecipe(recipeData) {
    const response = await fetch(`${BASE_URL}/recipes`, {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(recipeData)
    });
    
    if (!response.ok) {
        throw await handleApiError(response);
    }
    return response.json();
}

// Petición POST para subir la imagen (envía FormData)
export async function uploadRecipeImage(recipeId, imageFormData) {
    try {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/upload-image`, {
        method: 'POST',
        body: imageFormData
    });
    
    if (!response.ok) {
        throw await handleApiError(response);
    }
    return response.json();

  } catch (error) {
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('La imagen es demasiado grande.');
    }
    
    throw error;
  }
}

// Petición GET para obtener una receta por su ID
export async function getRecipeById(recipeId) {
    const response = await fetch(`${BASE_URL}/recipes/admin/${recipeId}`);
    
    if (!response.ok) {
        throw await handleApiError(response);
    }
    return response.json();
}

// Petición PUT para actualizar una receta (envía JSON)
export async function updateRecipe(recipeId, recipeData) {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}`, {
        method: 'PUT',
        headers: getJsonHeaders(),
        body: JSON.stringify(recipeData)
    });
    
    if (!response.ok) {
        throw await handleApiError(response);
    }
    return response.json();
}

// Petición DELETE para eliminar una receta
export async function deleteRecipe(recipeId) {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw await handleApiError(response);
    }
    return { success: true }; 
}