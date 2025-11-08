
import { register as apiRegister } from './api.js';

document.getElementById('registroForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validaciones básicas
  if (!nombre || !telefono || !email || !password || !confirmPassword) {
    alert('⚠️ Completa los campos obligatorios.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('El correo electrónico no es válido.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  // Separar nombre y apellido (si el usuario ingresó ambos)
  const parts = nombre.split(/\s+/);
  const name = parts.shift() || '';
  const lastName = parts.join(' ') || '';

  const telefonoRegex = /^[0-9]{10}$/;
  if (!telefonoRegex.test(telefono)) {
    alert('El número de teléfono debe tener 10 dígitos.');
    return;
  }

  const payload = {
    name,
    lastName,
    phoneNumber: telefono,
    email,
    password
  };

  try {
    await apiRegister(payload);
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error en registro:', error);
    alert('Error en el registro: ' + (error.message || 'Revisa la consola'));
  }
});