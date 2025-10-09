// Solo se ejecuta si encuentra ".gallery-scroll"
const sliderInfinito = document.querySelector(".gallery-scroll");
if (sliderInfinito) {
    sliderInfinito.innerHTML += sliderInfinito.innerHTML;
}

/* OCULTAR NAVBAR */
// Selectores
const navbarContainer = document.querySelector('.navbar-container');
const navCollapse = document.querySelector('#navbarNav');

// Solo funciona si encuentra "".navbar-container"
if (navbarContainer && navCollapse) {
    // Constantes y Variables de estado
    const LG_BREAKPOINT = 992; // Punto de quiebre 'lg' de Bootstrap en píxeles.
    const navbarHeight = navbarContainer.offsetHeight;
    let lastScrollTop = 0;
    let isNavbarTransitioning = false;

    // Instancia del componente Collapse de Bootstrap
    const bsCollapse = new bootstrap.Collapse(navCollapse, {
    toggle: false
    });

    // Lógica para pausar el script durante la animación del menú 
    navCollapse.addEventListener('show.bs.collapse', () => { isNavbarTransitioning = true; });
    navCollapse.addEventListener('shown.bs.collapse', () => { isNavbarTransitioning = false; });
    navCollapse.addEventListener('hide.bs.collapse', () => { isNavbarTransitioning = true; });
    navCollapse.addEventListener('hidden.bs.collapse', () => { isNavbarTransitioning = false; });

    // Lógica del scroll para ocultar/mostrar
    window.addEventListener('scroll', () => {
    if (!isNavbarTransitioning) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Si scrolleamos hacia abajo...
        if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
        navbarContainer.classList.add('navbar--hidden'); // Ocultamos el navbar.
        //navCollapse.classList.remove('show');
        //bsCollapse.hide();

        const openDropdown = navbarContainer.querySelector('.dropdown-menu.show');
        if (openDropdown) {
        openDropdown.classList.remove('show');
      }
        } else {
        navbarContainer.classList.remove('navbar--hidden');
        }
        lastScrollTop = Math.max(0, scrollTop);
    }
    });

    // Cerrar menu hamburguesa al pasar a una resolución mayor
    window.addEventListener('resize', () => {
    // Verificamos si el ancho de la ventana es mayor o igual al punto de quiebre
    if (window.innerWidth >= LG_BREAKPOINT) {
        // Cierre instantáneo sin animación
        navCollapse.classList.remove('show');
    }
    });
}
/* OCULTAR NAVBAR FIN */