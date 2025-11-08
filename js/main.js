import { subscribeToNewsletter } from './api.js';

// Solo se ejecuta si encuentra ".gallery-scroll"
const sliderInfinito = document.querySelector(".gallery-scroll");
if (sliderInfinito) {
    sliderInfinito.innerHTML += sliderInfinito.innerHTML;
}

/* OCULTAR NAVBAR */
const navbarContainer = document.querySelector('.navbar-container');
const navCollapse = document.querySelector('#navbarNav');

// Solo funciona si encuentra los elementos del navbar en la página
if (navbarContainer && navCollapse) {

    // Constantes y Variables de estado
    const LG_BREAKPOINT = 992; // Punto de quiebre 'lg' de Bootstrap en píxeles.
    const navbarHeight = navbarContainer.offsetHeight;
    let lastScrollTop = 0;
    let isNavbarTransitioning = false;
    let dropdownJustClicked = false; // Bandera para la evitar conflictos con el dropdown

    // Instancia del componente Collapse de Bootstrap
    const bsCollapse = new bootstrap.Collapse(navCollapse, {
        toggle: false
    });

    // Lógica para pausar el script durante la animación del menú 
    navCollapse.addEventListener('show.bs.collapse', () => { isNavbarTransitioning = true; });
    
    // Intercepta la orden de cierre para anularla si se hizo clic en un dropdown
    navCollapse.addEventListener('hide.bs.collapse', (event) => {
        if (dropdownJustClicked) {
            event.preventDefault(); // Cancela el cierre del menú principal
            return;
        }
        isNavbarTransitioning = true;
    });
    navCollapse.addEventListener('hidden.bs.collapse', () => { isNavbarTransitioning = false; });
    
    // Añade "periodo de gracia" después de abrir para ignorar micro-scrolls
    navCollapse.addEventListener('shown.bs.collapse', () => {
        setTimeout(() => {
            isNavbarTransitioning = false;
        }, 100);
    });

    // Lógica para prevenir que el dropdown cierre el menú principal
    const dropdownToggles = navbarContainer.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            dropdownJustClicked = true;
            setTimeout(() => { dropdownJustClicked = false; }, 50);
        });
    });

    // Lógica del scroll para ocultar/mostrar
    const handleScroll = () => {
        if (isNavbarTransitioning) return;

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Si el menú hamburguesa está abierto, la prioridad es cerrarlo
        if (navCollapse.classList.contains('show')) {
            if (scrollTop > 1) { // Ignora micro-scrolls
                bsCollapse.hide();
            }
        } else {
            // Si el menú está cerrado, aplica la lógica normal de ocultar/mostrar
            if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
                navbarContainer.classList.add('navbar--hidden');

                // Busca y cierra cualquier dropdown que esté abierto en el navbar.
                const openDropdown = navbarContainer.querySelector('.dropdown-menu.show');
                if (openDropdown) {
                    openDropdown.classList.remove('show');
                }
            } else if (scrollTop < lastScrollTop) {
                navbarContainer.classList.remove('navbar--hidden');
            }
        }
        lastScrollTop = Math.max(0, scrollTop);
    };
    
    window.addEventListener('scroll', handleScroll);

    // Lógica para reducir errores con el "temblor" al abrir el navbar y bloquear el scroll del fondo
    navCollapse.addEventListener('shown.bs.collapse', () => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.classList.add('menu-open');
    });

    navCollapse.addEventListener('hidden.bs.collapse', () => {
        document.body.style.paddingRight = '';
        document.body.classList.remove('menu-open');
    });

    // Cerrar menú hamburguesa al pasar a una resolución mayor
    window.addEventListener('resize', () => {
        if (window.innerWidth >= LG_BREAKPOINT) {
            navCollapse.classList.remove('show');
        }
    });

    // Cierre del menú hamburguesa al hacer clic fuera
    document.addEventListener('click', (event) => {
        // Verificamos si el menú está abierto
        const isMenuOpen = navCollapse.classList.contains('show');
        
        // Verificamos si el clic ocurrió dentro del contenedor del navbar
        const isClickInside = navbarContainer.contains(event.target);

        // Si el menú está abierto Y el clic fue afuera, se cierra el menú hamburguesa
        if (isMenuOpen && !isClickInside) {
            bsCollapse.hide();
        }
    });
}
/* OCULTAR NAVBAR FIN */


// AVISOS LEGALES - Abrir acordeones desde enlaces Footer
function openAccordionSection(hash, shouldScroll = false) {
    
    // Solo funciona si encuentra un #
    if (!hash) return;

    // Busca en la página el elemento con el ID del #
    const targetItem = document.querySelector(hash);
    
    // Solo funciona si el # existe y, además, pertenece a un acordeon
    if (!targetItem || !targetItem.classList.contains('accordion-item')) return;

    // Dentro del acordeon, busca la parte de contenido que se colapsa
    const targetCollapseElement = targetItem.querySelector('.accordion-collapse');
    if (!targetCollapseElement) return;

    // Si la sección a la que hacemos clic ya está abierta
    if (targetCollapseElement.classList.contains('show')) {
        // si el clic vino de un enlace se hace scroll hacia la sección
        if (shouldScroll) {
            targetItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
    }

    // Busca si hay alguna sección diferente abierta
    const accordionParent = targetItem.closest('.accordion');
    const currentlyOpenCollapse = accordionParent ? accordionParent.querySelector('.accordion-collapse.show') : null;

    const openNewSection = () => {
        const bsCollapse = new bootstrap.Collapse(targetCollapseElement, { toggle: false });
        bsCollapse.show(); // Abre la sección deseada

        if (shouldScroll) {
            // Espera que la sección del acordeón se abra para hacer scroll
            targetCollapseElement.addEventListener('shown.bs.collapse', () => {
                targetItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, { once: true });
        }
    };

    // Si la sección a la que hacemos clic ya está no abierta
    if (currentlyOpenCollapse) {
        // Espera que la seccion abierta cierre para comenzar a abirr la seccion elegida
        currentlyOpenCollapse.addEventListener('hidden.bs.collapse', openNewSection, { once: true });
        
        // Cerrar la sección que estaba abierta
        bootstrap.Collapse.getInstance(currentlyOpenCollapse).hide();
    } else {
        // Si no hay ninguna sección abierta se abre la sección elegida
        openNewSection();
    }
}

// Al cargar la página por primera vez
openAccordionSection(window.location.hash, true);

// Se activa si ya estamos en avisos y se da click a un link del footer
const anchorLinks = document.querySelectorAll('a[href*="avisos.html#"]');

anchorLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        // Si ya estamos en la página de avisos
        if (window.location.pathname.includes('avisos.html')) {
            // Se detiene el salto inmediato a la sección
            event.preventDefault();
            // se abre la sección y se da un salto suave a la msma
            const hash = link.hash;
            openAccordionSection(hash, true);
        }
    });
});
// END AVISOS LEGALES

// //Variantes de la vista de productos
// const variantCards = document.querySelectorAll('.variant-card');
//   const productTitle = document.querySelector('h2');
//   const productPrice = document.querySelector('.price');
//   const mainImg = document.querySelector('.carousel-item.active img');

//   variantCards.forEach(card => {
//     card.addEventListener('click', () => {
//       // Quitar la clase active de todas
//       variantCards.forEach(c => c.classList.remove('active'));
//       card.classList.add('active');

//       // Cambiar datos del producto
//       const name = card.getAttribute('data-name');
//       const price = card.getAttribute('data-price');
//       const img = card.getAttribute('data-img');

//       productTitle.textContent = name;
//       productPrice.textContent = `$${price} MXN`;
//       mainImg.src = img;
//     });
//   });

document.addEventListener('DOMContentLoaded', async function() {
    // Solo ejecutar si estamos en la página del catálogo
    if (document.getElementById('list-items')) {
        await productService.init();
        productService.renderCatalog();
        console.log('Catálogo cargado');
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    // Detectar si estamos en la página de producto individual
    if (window.location.pathname.includes('producto.html')) {
        
        // Obtener el ID del producto desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId) {
            await productService.init();
            productService.renderProductPage(parseInt(productId));
        } else {
            console.error('No se encontró ID en la URL');
            alert('Producto no encontrado');
        }
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    // Solo ejecutar si estamos en la página del catálogo
    if (document.getElementById('list-suscriptions')) {
        await suscriptionController.init();
        suscriptionController.renderCatalog();
    }
});

const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

if (animateOnScrollElements.length > 0) {
    const observerOptions = {
        root: null, // El viewport
        rootMargin: '0px',
        threshold: 0.3 // Ejecutar cuando el 30% del elemento es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Dejar de observar una vez que se muestra
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(el => {
        observer.observe(el);
    });
}

const newsletterForm = document.querySelector('#newsletter-form');
const messageElement = document.querySelector('#newsletter-message');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (!validateEmail(email)) {
            showMessage('Por favor ingresa un correo electrónico válido.', 'text-danger');
            return;
        }

        const button = newsletterForm.querySelector('button');
        button.disabled = true;
        showMessage('Enviando...', 'text-muted');

        try {
             const response = await subscribeToNewsletter({ email });

            if (response.message) {
                showMessage(response.message, 'text-success');
            } else {
                showMessage('¡Gracias por suscribirte!', 'text-success');
            }
            emailInput.value = '';
        } catch (error) {
            console.error('Error al suscribirse:', error);

            if (error.response) {
                try {
                const data = await error.response.json();
                showMessage(data.message || 'Ocurrió un error al enviar tu correo.', 'text-danger');
                } catch {
                showMessage('Ocurrió un error inesperado.', 'text-danger');
                }
            } else {
                showMessage('No se pudo conectar con el servidor.', 'text-danger');
            }
        } finally {
            button.disabled = false;
        }
    });
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showMessage(text, className) {
  messageElement.textContent = text;
  messageElement.className = `small ${className}`;
}
