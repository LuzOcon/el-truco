import { getToken, parseJwt, removeToken } from '../../js/api.js';

(function() {
  try {
    const token = getToken();
    if (!token) {
      // No hay token, que inicie sesión
      window.location.href = '../login.html';
      return;
    }

    const payload = parseJwt(token) || {};

    const candidates = [];
    if (payload.roles) candidates.push(payload.roles);
    if (payload.authorities) candidates.push(payload.authorities);
    if (payload.role) candidates.push(payload.role);
    if (payload.rolesString) candidates.push(payload.rolesString);

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

    if (!isAdmin) {
      // Hay token pero no de admin, que inicie sesión
      window.location.href = '../index.html';
    }
  } catch (e) {
    console.error('Admin guard error', e);
    try { window.location.href = '../login.html'; } catch (er) {}
  }
})();

// Attach logout handler when DOM is ready so the navbar button works
document.addEventListener('DOMContentLoaded', () => {
  try {
    const handleLogout = (ev) => {
      if (ev) ev.preventDefault();
      try { removeToken(); } catch (e) { /* ignore */ }
      window.location.href = '../login.html';
    };

    // Desktop icon
    const btn = document.getElementById('logoutButton');
    if (btn) btn.addEventListener('click', handleLogout);

    // Mobile link(s) inside the collapsed nav (.d-lg-none)
    const mobileLinks = document.querySelectorAll('.nav-item.d-lg-none a.nav-link');
    if (mobileLinks && mobileLinks.length) {
      mobileLinks.forEach(el => {
        // guard: only attach to those that contain 'Cerrar' to avoid side effects
        if (/cerrar/i.test(el.textContent || '')) {
          el.addEventListener('click', handleLogout);
        }
      });
    }
  } catch (e) {
    console.error('Error attaching logout handler', e);
  }
});
