(function () {
  const STORAGE_KEY = 'eltruco_cart';
  const $ = (s) => document.querySelector(s);
  const fmt = (n) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

  const loadCart = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const saveCart = (cart) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  let appliedCoupon = null;
  const COUPONS = {
    HUEVOS10: { type: 'percent', value: 10 },
    GRANJA25: { type: 'amount', value: 25 },
  };
  const FREE_SHIPPING = 999;
  const SHIPPING_COST = 79;

  // 🔄 Renderiza el carrito
  function renderCart() {
    const cart = loadCart();
    const list = $('#cartList');
    if (!list) return;
    list.innerHTML = '';

    if (cart.length === 0) {
      list.innerHTML = '<p class="text-center">Tu carrito está vacío 🛒</p>';
      updateTotals();
      return;
    }

    cart.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'd-flex justify-content-between align-items-center border-bottom py-3';
      card.dataset.id = item.id;

      const subtotal = item.price * item.qty;
      const isSubscription = item.name.toLowerCase().includes('plan');

      card.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${item.image}" alt="${item.name}" width="60" class="me-3 rounded">
          <div>
            <h6>${item.name}${isSubscription ? ' 🗓️' : ''}</h6>
            <small>${fmt(item.price)} c/u</small>
          </div>
        </div>

        <div class="d-flex flex-column align-items-end">
          <div class="d-flex align-items-center gap-2 mb-1">
            <button class="btn btn-sm btn-outline-dark minus">−</button>
            <input type="number" min="1" value="${item.qty}" class="form-control form-control-sm qty-input text-center" style="width:60px">
            <button class="btn btn-sm btn-outline-dark plus">+</button>
            <button class="btn btn-sm btn-outline-danger remove">x</button>
          </div>
          <small class="text-green fw-semibold">Subtotal: ${fmt(subtotal)}</small>
        </div>
      `;
      list.appendChild(card);
    });

    updateTotals();
  }

  // 💰 Totales, descuentos y envío
  function updateTotals() {
    const cart = loadCart();
    const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
    let discount = 0;

    if (appliedCoupon && COUPONS[appliedCoupon]) {
      const c = COUPONS[appliedCoupon];
      discount = c.type === 'percent' ? (subtotal * c.value) / 100 : c.value;
    }

    const shipping =
      subtotal - discount >= FREE_SHIPPING
        ? 0
        : cart.length
        ? SHIPPING_COST
        : 0;

    const total = subtotal - discount + shipping;

    $('#subtotal').textContent = fmt(subtotal);
    $('#discount').textContent = discount ? `−${fmt(discount)}` : fmt(0);
    $('#shipping').textContent = shipping === 0 ? 'GRATIS' : fmt(shipping);
    $('#grandTotal').textContent = fmt(total);

    const badges = document.querySelectorAll('#cartCount, #cartCountDesktop');
    const count = cart.reduce((a, b) => a + b.qty, 0);
    badges.forEach((b) => {
      if (b) {
        b.textContent = count;
        b.style.display = count ? 'inline-block' : 'none';
      }
    });

    $('#freeShippingHint').textContent =
      subtotal - discount < FREE_SHIPPING && subtotal > 0
        ? `Te faltan ${fmt(FREE_SHIPPING - (subtotal - discount))} para envío gratis 🚚`
        : '';
  }

  // ➕ ➖ ❌ Interacciones del carrito
  document.addEventListener('click', (e) => {
    const id = e.target.closest('[data-id]')?.dataset.id;
    if (!id) return;

    const cart = loadCart();
    const i = cart.findIndex((x) => x.id === id);
    if (i < 0) return;

    let action = null;

    if (e.target.classList.contains('plus')) {
      cart[i].qty++;
      action = 'added';
    }
    if (e.target.classList.contains('minus')) {
      cart[i].qty = Math.max(1, cart[i].qty - 1);
      action = 'updated';
    }
    if (e.target.classList.contains('remove')) {
      cart.splice(i, 1);
      action = 'removed';
    }

    if (!action) return;
    saveCart(cart);
    renderCart();
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action } }));
  });

  // ✏️ Cambio manual de cantidad
  document.addEventListener('change', (e) => {
    if (!e.target.classList.contains('qty-input')) return;
    const id = e.target.closest('[data-id]')?.dataset.id;
    const val = Math.max(1, parseInt(e.target.value) || 1);
    const cart = loadCart();
    const i = cart.findIndex((x) => x.id === id);
    cart[i].qty = val;
    saveCart(cart);
    renderCart();
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'updated' } }));
  });

  // 🎟️ Cupón
  $('#applyCoupon')?.addEventListener('click', () => {
    const code = $('#couponInput').value.trim().toUpperCase();
    if (!COUPONS[code]) return alert('Cupón no válido');
    appliedCoupon = code;
    updateTotals();
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'coupon' } }));
    alert(`Cupón aplicado: ${code}`);
  });

  // 🧹 Vaciar carrito
  $('#clearCart')?.addEventListener('click', () => {
    if (confirm('¿Vaciar el carrito?')) {
      localStorage.setItem(STORAGE_KEY, '[]');
      renderCart();
      document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'cleared' } }));
    }
  });

  // 💳 Pago simulado
  $('#checkoutBtn')?.addEventListener('click', () =>
    alert('Función de pago próximamente 💳')
  );

  document.addEventListener('DOMContentLoaded', renderCart);
})();

// 🔔 Animaciones visuales y notificaciones
function pulseCartIcon() {
  const badges = document.querySelectorAll('#cartCount, #cartCountDesktop');
  badges.forEach((b) => {
    if (b) {
      b.classList.add('pulse');
      setTimeout(() => b.classList.remove('pulse'), 400);
    }
  });
}

document.addEventListener('cartUpdated', (e) => {
  pulseCartIcon();

  const toast = document.createElement('div');
  toast.className = 'toast-add';

  const action = e.detail?.action;
  let message = '🛒 Carrito actualizado';
  if (action === 'added') message = '🛍️ Producto agregado';
  else if (action === 'updated') message = '🔁 Cantidad actualizada';
  else if (action === 'removed') message = '❌ Producto eliminado';
  else if (action === 'coupon') message = '🎟️ Cupón aplicado';
  else if (action === 'cleared') message = '🧹 Carrito vaciado';

  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1600);
});
