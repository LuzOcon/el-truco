// 📦 cartController.js
(function () {
  const STORAGE_KEY = 'eltruco_cart';
  const fmt = (n) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

  const loadCart = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const saveCart = (cart) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

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

  // ⚡ Mini alerta visual (toast)
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-add';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1600);
  }

  // 🧩 Normalizador de texto
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');

  // 🔥 Agrega producto o suscripción al carrito
  function addToCart(item) {
    const cart = loadCart();

    item.id = normalize(item.name);

    // ✅ Busca coincidencias exactas o parciales (para homologar nombres similares)
    const existing = cart.find((p) => {
      const sameId = p.id === item.id;
      const sameName = normalize(p.name) === normalize(item.name);
      const startsSimilar =
        normalize(p.name).startsWith(normalize(item.name)) ||
        normalize(item.name).startsWith(normalize(p.name));
      return sameId || sameName || startsSimilar;
    });

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

  // 🟢 Detecta clics globales (catálogo o index)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-verde');
    if (!btn) return;

    const isAddCart = btn.textContent.includes('Agregar al carrito');
    const isSubscribe = btn.textContent.includes('Suscríbete ahora');
    if (!isAddCart && !isSubscribe) return;

    const collapseDiv = btn.closest('.collapse');
    if (isAddCart && collapseDiv) {
      const select = collapseDiv.querySelector('select');
      if (select) {
        const variantId = select.value;
        const { product, variant } = productService.getVariantById(variantId);
        if (!product || !variant) {
          alert('Error: no se pudo obtener la variante seleccionada.');
          return;
        }

        addToCart({
          id: variant.id,
          name: variant.name,
          price: variant.price,
          image: variant.image,
          qty: 1,
        });
        return;
      }
    }

    // Desde index.html (sin variantes)
    if (isAddCart && !collapseDiv) {
      const card = btn.closest('.card');
      if (!card) return;

      const name = card.querySelector('.card-title')?.textContent || 'Producto';
      const priceText = card.querySelector('.card-price')?.textContent.replace(/[^\d.]/g, '');
      const price = parseFloat(priceText) || 0;
      const image = card.querySelector('img')?.src || '';

      addToCart({ id: '', name, price, image, qty: 1 });
      return;
    }

    // Desde suscripción
    if (isSubscribe) {
      const card = btn.closest('.card');
      if (!card) return;

      const name = card.querySelector('.card-title')?.textContent || 'Suscripción';
      const priceText = card.querySelector('.card-price')?.textContent.replace(/[^\d.]/g, '');
      const price = parseFloat(priceText) || 0;
      const image = card.querySelector('img')?.src || '';

      addToCart({ id: '', name, price, image, qty: 1 });
      return;
    }
  });

  // 🟢 Evento especial: botón de producto individual (producto.html)
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();

    const addBtn = document.getElementById('addToCartBtn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      const activeVariant = document.querySelector('.variant-card.active');
      const qtyInput = document.getElementById('quantity');
      const quantity = parseInt(qtyInput?.value) || 1;

      if (!activeVariant) {
        alert('Selecciona una presentación antes de agregar al carrito');
        return;
      }

      const variantId = activeVariant.dataset.variantId;
      const { product, variant } = productService.getVariantById(variantId);

      if (product && variant) {
        addToCart({
          id: variant.id,
          name: variant.name,
          price: variant.price,
          image: variant.image,
          qty: quantity,
        });
      }
    });
  });
})();





