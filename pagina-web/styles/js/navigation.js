/* ===========================
   NAVEGACIÓN Y HEADER
   ========================== */

class Navigation {
    constructor() {
        this.header = document.querySelector('header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('nav ul');
        this.navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupActiveNavigation();
        this.setupScrollToTop();
    }

    // Efecto del header al hacer scroll
    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            
            // Agregar clase cuando se hace scroll
            if (scrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Ocultar/mostrar header en scroll
            if (scrollY > lastScrollY && scrollY > 200) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Menú móvil
    setupMobileMenu() {
        if (!this.mobileToggle || !this.navMenu) return;

        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Cerrar menú al hacer clic en un enlace
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('header')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.navMenu.classList.add('active');
        this.mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animar hamburguesa
        const spans = this.mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Restaurar hamburguesa
        const spans = this.mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }

    // Navegación activa basada en scroll
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        const updateActiveNav = () => {
            const scrollY = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    // Remover clase active de todos los enlaces
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    // Agregar clase active al enlace actual
                    if (navLink) navLink.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav(); // Ejecutar al cargar
    }

    // Botón scroll to top
    setupScrollToTop() {
        // Crear botón si no existe
        let scrollTopBtn = document.querySelector('.scroll-to-top');
        
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.className = 'scroll-to-top';
            scrollTopBtn.innerHTML = '↑';
            scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
            document.body.appendChild(scrollTopBtn);
        }

        // Mostrar/ocultar botón
        const toggleScrollTopBtn = () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        };

        // Funcionalidad del botón
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
        toggleScrollTopBtn(); // Ejecutar al cargar
    }
}

/* ===========================
   UTILIDADES DE NAVEGACIÓN
   ========================== */

class NavigationUtils {
    // Obtener altura del header para ajustar scroll
    static getHeaderHeight() {
        const header = document.querySelector('header');
        return header ? header.offsetHeight : 0;
    }

    // Scroll suave a sección específica
    static scrollToSection(sectionId, offset = 0) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const headerHeight = this.getHeaderHeight();
        const targetPosition = section.offsetTop - headerHeight - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Verificar si una sección está visible
    static isSectionVisible(sectionId, threshold = 0.5) {
        const section = document.getElementById(sectionId);
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const visibleHeight = Math.max(0, 
            Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
        );
        
        return (visibleHeight / section.offsetHeight) >= threshold;
    }
}

/* ===========================
   INICIALIZACIÓN Y EVENTOS
   ========================== */

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});

// Manejar cambios de orientación en móviles
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        const navigation = new Navigation();
        navigation.closeMobileMenu();
    }, 100);
});

// Manejar resize de ventana
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Cerrar menú móvil en pantallas grandes
        if (window.innerWidth > 768) {
            const navigation = new Navigation();
            navigation.closeMobileMenu();
        }
    }, 250);
});

/* ===========================
   ESTILOS CSS PARA FUNCIONALIDADES JS
   ========================== */

// Agregar estilos dinámicamente
const navStyles = `
    <style>
    /* Menú móvil */
    @media (max-width: 768px) {
        nav ul {
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: left 0.3s ease;
            z-index: 999;
        }
        
        nav ul.active {
            left: 0;
        }
        
        nav ul li {
            margin: 1rem 0;
            opacity: 0;
            transform: translateY(20px);
            animation: slideInMobile 0.3s ease forwards;
        }
        
        nav ul.active li:nth-child(1) { animation-delay: 0.1s; }
        nav ul.active li:nth-child(2) { animation-delay: 0.2s; }
        nav ul.active li:nth-child(3) { animation-delay: 0.3s; }
        nav ul.active li:nth-child(4) { animation-delay: 0.4s; }
        
        nav ul li a {
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        .mobile-menu-toggle {
            z-index: 1001;
        }
    }
    
    /* Enlace activo */
    nav a.active {
        color: #ffd700;
    }
    
    nav a.active::after {
        width: 100%;
    }
    
    /* Botón scroll to top */
    .scroll-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .scroll-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }
    
    /* Animaciones */
    @keyframes slideInMobile {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Header con transición */
    header {
        transition: transform 0.3s ease, background 0.3s ease, padding 0.3s ease;
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', navStyles);