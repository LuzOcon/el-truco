const BASE_URL = 'http://localhost:8080/api';

function getJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  };
}

// Auth
export function setToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch (e) {
    return null;
  }
}

export function getAuthHeaders() {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
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

// Auth endpoints
export async function register(user) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(user)
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try { message = JSON.parse(text).message || text; } catch(e) {}
    const err = new Error(message || `API_ERROR: ${response.status}`);
    err.response = response;
    throw err;
  }

  return response.json();
}

export async function login(credentials) {
  // { email, password }
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try { message = JSON.parse(text).message || text; } catch(e) {}
    const err = new Error(message || `API_ERROR: ${response.status}`);
    err.response = response;
    throw err;
  }

  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json;
  } catch (e) {
    return text;
  }
}