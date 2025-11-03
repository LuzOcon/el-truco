(function () {
  const STORAGE_KEY = 'eltruco_cart';

  const loadCart = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const saveCart = (cart) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  const fmt = (n) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

  // 🔔 Actualiza los contadores del carrito
  function updateCartBadges() {
    const cart = loadCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const badges = document.querySelectorAll('#cartCount, #cartCountDesktop');
    badges.forEach((b) => {
      if (b) {
        b.textContent = totalItems;
        b.style.display = totalItems ? 'inline-block' : 'none';
      }
    });
  }

  //  Agregar producto o suscripción al carrito
  function addToCart(item) {
    const cart = loadCart();
    const existing = cart.find((p) => p.id === item.id);
    if (existing) {
      existing.qty += item.qty;
    } else {
      cart.push(item);
    }
    saveCart(cart);
    updateCartBadges();
    showToast(`🛒 ${item.name} agregado al carrito`);
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'added' } }));
  }

  //  Mini alerta visual
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-add';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1600);
  }

  //  Detecta clics en botones de productos o suscripciones
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-verde');
    if (!btn) return;

    const isAddCart = btn.textContent.includes('Agregar al carrito');
    const isSubscribe = btn.textContent.includes('Suscríbete ahora');
    if (!isAddCart && !isSubscribe) return;

    const card = btn.closest('.card');
    if (!card) return;

    const name = card.querySelector('.card-title')?.textContent || 'Producto';
    const priceText = card.querySelector('.card-price')?.textContent.replace(/[^\d.]/g, '');
    const price = parseFloat(priceText) || 0;
    const image = card.querySelector('img')?.src || '';
    const id = name.toLowerCase().replace(/\s+/g, '_');

    const item = { id, name, price, image, qty: 1 };
    addToCart(item);
  });

  //  Actualiza badges al cargar la página
  document.addEventListener('DOMContentLoaded', updateCartBadges);
})();
