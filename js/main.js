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
window.addEventListener('load', function() {
  const hash = window.location.hash;
  if (hash) {
    const
// END AVISOS LEGALES