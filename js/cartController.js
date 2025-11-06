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

  //para las variantes
  document.addEventListener('click', (e) => {
    const variantCard = e.target.closest('.variant-card');
    if(!variantCard) return;

    const cards = document.querySelectorAll('.variant-card');
    cards.forEach(c => c.classList.remove('active'));
    variantCard.classList.add('active');

    const productTitle = document.querySelector('.product-container h2');
    const productPrice = document.querySelector('.product-container .price');
    const mainImg = document.querySelector('.carousel-item.active img');

    if (productTitle) productTitle.textContent = variantCard.dataset.name;
    if (productPrice) productPrice.textContent = `$${parseFloat(variantCard.dataset.price).toFixed(2)} MXN`;
    if (mainImg) mainImg.src = variantCard.dataset.img;
  });

  //  Detecta clics en botones de productos o suscripciones
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-verde');
    if (!btn) return;

    const isAddCart = btn.textContent.includes('Agregar al carrito');
    const isSubscribe = btn.textContent.includes('Suscríbete ahora');
    if (!isAddCart && !isSubscribe) return;

    if (btn.dataset.section === 'variantes') {
      const activeVariant = document.querySelector('.variant-card.active');
      if (!activeVariant) {
        showToast('Por favor selecciona una presentación');
        return;
      }
      
      const quantityInput = document.querySelector('#quantity');
      const qty = parseInt(quantityInput?.value || 1, 10);
      const variantId = parseInt(activeVariant.dataset.variantId, 10);
      const result = productService.getVariantById(variantId);
      
      if (!result) {
        showToast('Variante no encontrada');
        return;
      }
      
      const variant = result.variant;
      
      const item = {
        id: String(variant.id),
        name: variant.name,
        price: variant.price,
        image: variant.image,
        qty
      };
      
      addToCart(item);
      return; 
  }

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
