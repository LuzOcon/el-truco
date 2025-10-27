export const BASE_URL = 'http://localhost:8080/api';

function getJsonHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

async function handleApiError(response) {
    let errorMsg = 'Error desconocido de la API';
    try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || response.statusText;
    } catch (e) {
        errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
}

// Petición GET para obtener TODAS las recetas
export async function getAllRecipes() {
    const response = await fetch(`${BASE_URL}/recipes`);
    
    if (!response.ok) {
        await handleApiError(response);
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
        await handleApiError(response);
    }
    return response.json();
}

// Petición POST para subir la imagen (envía FormData)
export async function uploadRecipeImage(recipeId, imageFormData) {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/upload-image`, {
        method: 'POST',
        body: imageFormData
    });
    
    if (!response.ok) {
        await handleApiError(response);
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
        await handleApiError(response);
    }
    return response.json();
}

// Petición DELETE para eliminar una receta
export async function deleteRecipe(recipeId) {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        await handleApiError(response);
    }
    return { success: true }; 
}