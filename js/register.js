
document.getElementById('registroForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validaciones
  if (!nombre || !telefono || !email || !password || !confirmPassword) {
    alert('⚠️ Todos los campos son obligatorios.');
    return;
  }

  
  //Prueba de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('El correo electrónico no es válido.');
    return;
  }

  //Prueba de largo de teléfono
  const telefonoRegex = /^[0-9]{10}$/;
  if (!telefonoRegex.test(telefono)) {
    alert('El número de teléfono debe tener al menos 10 dígitos');
    return;
  }

  if (password !== confirmPassword) { //si medio cuadra la rechaza
    alert('Las contraseñas no coinciden');
    return;
  }

  // Si pasa todas las validaciones:
  const usuario = {
    nombreCompleto: nombre,
    telefono: telefono,
    email: email,
    password: password
  };

  const usuarioJSON = JSON.stringify(usuario, null, 2);
  console.log("Usuario registrado:", usuarioJSON);

  alert('Registro exitoso. Revisa la consola para ver el JSON:)');
  this.reset();
});