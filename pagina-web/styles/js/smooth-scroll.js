/* ===========================
   SMOOTH SCROLL Y EFECTOS DE SCROLL
   ========================== */

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrollLinks();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupScrollIndicator();
    }

    // Configurar enlaces de scroll suave
    setupSmoothScrollLinks() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                if (!targetId) return;
                
                const targetElement = document.getElementById(targetId);
                if (!targetElement) return;
                
                e.preventDefault();
                this.scrollToElement(targetElement);
            });
        });
    }

    // Scroll suave a un elemento específico
    scrollToElement(element, offset = 0) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const targetPosition = elementPosition - headerHeight - offset;

        // Usar scroll suave nativo si está disponible
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback para navegadores que no soportan scroll suave
            this.animatedScroll(targetPosition);
        }
    }

    // Animación de scroll personalizada (fallback)
    animatedScroll(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const easeInOutCubic = progress < duration / 2
                ? 4 * Math.pow(progress / duration, 3)
                : 1 - Math.pow(-2 * (progress / duration) + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }

    // Configurar animaciones basadas en scroll
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .mission-card, .vision-card, .contact-form');
        
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver(animatedElements);
        } else {
            // Fallback para navegadores antiguos
            this.setupScrollListener(animatedElements);
        }
    }

    setupIntersectionObserver(elements) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(element => {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    }

    setupScrollListener(elements) {
        let ticking = false;

        const checkElements = () => {
            elements.forEach(element => {
                if (element.classList.contains('animate-in')) return;
                
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = elementTop < window.innerHeight - 100;
                
                if (elementVisible) {
                    element.classList.add('animate-in');
                }
            });
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(checkElements);
                ticking = true;
            }
        };

        elements.forEach(element => {
            element.classList.add('animate-on-scroll');
        });

        window.addEventListener('scroll', requestTick, { passive: true });
        checkElements(); // Verificar elementos visibles al cargar
    }

    // Efectos parallax sutiles
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.tech-illustration, .hero-section');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const opacity = 1 - (scrolled / window.innerHeight);

            parallaxElements.forEach(element => {
                if (element.classList.contains('tech-illustration')) {
                    element.style.transform = `translateY(${rate * 0.3}px) rotate(${scrolled * 0.05}deg)`;
                } else if (element.classList.contains('hero-section')) {
                    element.style.transform = `translateY(${rate * 0.1}px)`;
                    element.style.opacity = Math.max(opacity, 0.3);
                }
            });

            ticking = false;
        };

        const requestParallaxTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestParallaxTick, { passive: true });
    }

    // Indicador de progreso de scroll
    setupScrollIndicator() {
        const indicator = this.createScrollIndicator();
        
        let ticking = false;
        
        const updateIndicator = () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            
            indicator.style.width = `${Math.min(scrolled, 100)}%`;
            ticking = false;
        };

        const requestIndicatorTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateIndicator);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestIndicatorTick, { passive: true });
        window.addEventListener('resize', requestIndicatorTick, { passive: true });
    }

    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-progress-indicator';
        
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        `;
        
        document.body.appendChild(indicator);
        return indicator;
    }
}

/* ===========================
   EFECTOS AVANZADOS DE SCROLL
   ========================== */

class ScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupCounterAnimations();
        this.setupTypingEffect();
        this.setupScrollReveal();
    }

    // Animación de contadores (si tuviéramos estadísticas)
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter, target, duration);
                        observer.unobserve(counter);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // Efecto de escritura para títulos
    setupTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeText(element, text);
                        observer.unobserve(element);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    typeText(element, text, speed = 50) {
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i > text.length - 1) {
                clearInterval(timer);
                element.classList.add('typing-complete');
            }
        }, speed);
    }

    // Revelar elementos con diferentes efectos
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        revealElements.forEach(element => {
            const effect = element.getAttribute('data-reveal') || 'fade';
            element.classList.add(`reveal-${effect}`);
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
}

/* ===========================
   UTILIDADES DE SCROLL
   ========================== */

class ScrollUtils {
    // Obtener posición de scroll
    static getScrollPosition() {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    }

    // Verificar si un elemento está visible
    static isElementVisible(element, threshold = 0.5) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const visibleHeight = Math.max(0, 
            Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
        );
        
        return (visibleHeight / element.offsetHeight) >= threshold;
    }

    // Obtener porcentaje de scroll de la página
    static getScrollPercentage() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        return (window.pageYOffset / windowHeight) * 100;
    }

    // Scroll a la parte superior
    static scrollToTop(smooth = true) {
        if (smooth) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo(0, 0);
        }
    }

    // Bloquear/desbloquear scroll
    static lockScroll() {
        document.body.style.overflow = 'hidden';
    }

    static unlockScroll() {
        document.body.style.overflow = '';
    }
}

/* ===========================
   INICIALIZACIÓN
   ========================== */

document.addEventListener('DOMContentLoaded', () => {
    new SmoothScroll();
    new ScrollEffects();
});

// Reinicializar en cambios de orientación
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        new SmoothScroll();
    }, 100);
});

/* ===========================
   ESTILOS CSS PARA ANIMACIONES
   ========================== */

const scrollStyles = `
    <style>
    /* Animaciones de scroll */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Diferentes efectos de reveal */
    .reveal-fade {
        opacity: 0;
        transition: opacity 0.8s ease;
    }
    
    .reveal-fade.revealed {
        opacity: 1;
    }
    
    .reveal-slide-up {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .reveal-slide-up.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .reveal-slide-left {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 0.8s ease;
    }
    
    .reveal-slide-left.revealed {
        opacity: 1;
        transform: translateX(0);
    }
    
    .reveal-scale {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.8s ease;
    }
    
    .reveal-scale.revealed {
        opacity: 1;
        transform: scale(1);
    }
    
    /* Efecto de escritura */
    [data-typing] {
        border-right: 2px solid #667eea;
        animation: blink 1s infinite;
    }
    
    [data-typing].typing-complete {
        border-right: none;
        animation: none;
    }
    
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: #667eea; }
    }
    
    /* Scroll suave para navegadores que no lo soportan */
    html {
        scroll-behavior: smooth;
    }
    
    /* Desactivar animaciones si el usuario prefiere movimiento reducido */
    @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll,
        .reveal-fade,
        .reveal-slide-up,
        .reveal-slide-left,
        .reveal-scale,
        [data-typing] {
            transition: none !important;
            animation: none !important;
        }
        
        html {
            scroll-behavior: auto;
        }
    }
    
    /* Mejoras de rendimiento */
    .tech-illustration,
    .hero-section {
        will-change: transform;
    }
    
    /* Indicador de progreso de scroll */
    .scroll-progress-indicator {
        will-change: width;
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', scrollStyles);