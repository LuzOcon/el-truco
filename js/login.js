
import { login as apiLogin, setToken, parseJwt } from './api.js';

// Login form handler (module)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Completa usuario y contraseña');
      return;
    }

    try {
      const data = await apiLogin({ email, password });

      // apiLogin may return a string or an object
      let token = null;
      if (typeof data === 'string') {
        token = data.startsWith('Bearer ') ? data.split(' ')[1] : data;
      } else if (data.token) {
        token = data.token;
      }

      if (!token) throw new Error('No se recibió token de autenticación.');

      setToken(token);

      const payload = parseJwt(token) || {};

      // Gather possible role claims into an array
      const candidates = [];
      if (payload.roles) candidates.push(payload.roles);
      if (payload.authorities) candidates.push(payload.authorities);
      if (payload.role) candidates.push(payload.role);
      if (payload.rolesString) candidates.push(payload.rolesString);

      // Flatten and convert to strings
      const flattened = [].concat(...candidates.map(c => Array.isArray(c) ? c : [c]))
        .filter(Boolean)
        .map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item.authority === 'string') return item.authority;
          return String(item);
        });

      const normalize = s => String(s).replace(/^ROLE[_-]/i, '').toUpperCase();
      const normalized = flattened.map(normalize);

      const isAdmin = normalized.some(r => r === 'ADMIN' || r.includes('ADMIN'));
      const isUser = normalized.some(r => r === 'USER' || r.includes('USER'));

      if (isAdmin) {
        window.location.href = './admin/admin-products.html';
      } else if (isUser) {
        window.location.href = './user/user.html';
      } else {
        window.location.href = './index.html';
      }

    } catch (error) {
      console.error('Login error:', error);
      alert('Error al iniciar sesión: ' + (error.message || 'Revisa la consola'));
    }
  });
});