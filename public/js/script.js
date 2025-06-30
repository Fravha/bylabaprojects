// Mobile menu toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on links
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
    }
});


// Seleccion de tema dark
const toggleBtn = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Aplicar modo por defecto si ya hay uno guardado o si el sistema es oscuro
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark)) {
document.body.classList.add('dark-mode');
toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
document.body.classList.toggle('dark-mode');
const isDark = document.body.classList.contains('dark-mode');
localStorage.setItem('theme', isDark ? 'dark' : 'light');
toggleBtn.textContent = isDark ? '☀️' : '🌙';
});


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});


// Add loading animation to project buttons
document.querySelectorAll('.project-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const href = button.getAttribute('href');

        if (!href || href === '#') {
            e.preventDefault();
            const originalText = button.textContent;
            button.textContent = 'Cargando...';
            button.style.pointerEvents = 'none';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.pointerEvents = 'auto';
                alert('Esta funcionalidad estará disponible próximamente.');
            }, 1000);
        }
        // Si tiene href real, deja que el navegador siga su curso normal
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 500);
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        typeWriter(heroTitle, 'Francisco Bailaba', 100);
    }
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark)) {
    document.body.classList.add('dark-mode');
    }
    document.body.style.visibility = 'visible';
});

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal animation for sections
function revealSections() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrolled = window.pageYOffset;
        
        if (scrolled > sectionTop - windowHeight + sectionHeight / 3) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

function copiarTexto(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copiado al portapapeles.");
  });
}

// Initialize sections with hidden state
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease';
});

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);