/* ===================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   =================================== */

// ===================================
// 1. SMOOTH SCROLLING
// ===================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// ===================================
// 2. NAVBAR FUNCTIONALITY
// ===================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Add scrolled class to navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===================================
// 3. COUNTER ANIMATION (About Stats)
// ===================================

const counters = document.querySelectorAll('.stat-number');
let counterAnimated = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
};

// Trigger counter animation when about section is in view
const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimated) {
            animateCounters();
            counterAnimated = true;
        }
    });
}, observerOptions);

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    counterObserver.observe(aboutSection);
}

// ===================================
// 4. SKILLS PROGRESS BAR ANIMATION
// ===================================

const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

const animateSkills = () => {
    skillBars.forEach((bar, index) => {
        const progress = bar.getAttribute('data-progress');
        
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, index * 100); // Stagger animation
    });
};

// Trigger skills animation when skills section is in view
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            animateSkills();
            skillsAnimated = true;
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ===================================
// 5. STAGGER ANIMATION FOR SKILL ITEMS
// ===================================

const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// ===================================
// 6. PROJECT CARDS ANIMATION
// ===================================

const projectCards = document.querySelectorAll('.project-card');

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2
});

projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    projectObserver.observe(card);
});

// ===================================
// 7. CONTACT FORM HANDLING
// ===================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(contactForm);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Show success message (simulation)
    showNotification('Message sent successfully! 🚀', 'success');
    
    // Reset form
    contactForm.reset();
});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'var(--accent-tertiary)' : 'var(--accent-secondary)'};
        color: var(--bg-primary);
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: var(--font-primary);
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: var(--bg-primary);
        font-size: 1.5rem;
        margin-left: 12px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
`;
document.head.appendChild(style);

// ===================================
// 8. BACK TO TOP BUTTON
// ===================================

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// 9. CURSOR EFFECT (Optional Enhancement)
// ===================================

// Create custom cursor
const cursor = document.createElement('div');
const cursorFollower = document.createElement('div');

cursor.className = 'custom-cursor';
cursorFollower.className = 'cursor-follower';

cursor.style.cssText = `
    width: 10px;
    height: 10px;
    background: var(--accent-primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.1s ease;
`;

cursorFollower.style.cssText = `
    width: 40px;
    height: 40px;
    border: 2px solid var(--accent-primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.15s ease;
    opacity: 0.5;
`;

// Only add custom cursor on desktop
if (window.innerWidth > 1024) {
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        cursorFollower.style.left = (e.clientX - 20) + 'px';
        cursorFollower.style.top = (e.clientY - 20) + 'px';
    });
    
    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// ===================================
// 10. PARALLAX EFFECT FOR HERO SECTION
// ===================================

const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    
    if (scrolled < heroHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / heroHeight);
    }
});

// ===================================
// 11. TYPING EFFECT FOR HERO SUBTITLE (Optional)
// ===================================

const subtitleText = document.querySelector('.hero-subtitle p');
if (subtitleText) {
    const originalText = subtitleText.textContent;
    subtitleText.textContent = '';
    
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < originalText.length) {
            subtitleText.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing after page load
    setTimeout(typeWriter, 1000);
}

// ===================================
// 12. IMAGE LAZY LOADING FALLBACK
// ===================================

// Modern browsers support native lazy loading, but this is a fallback
const images = document.querySelectorAll('img');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    imageObserver.observe(img);
});

// ===================================
// 13. FORM INPUT ANIMATION
// ===================================

const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.parentElement.classList.remove('focused');
        }
    });
});

// ===================================
// 14. PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScroll = debounce(() => {
    // Your scroll-heavy code here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ===================================
// 15. CONSOLE MESSAGE (Easter Egg)
// ===================================

console.log('%c👋 Hey there, Developer!', 'color: #00ffff; font-size: 20px; font-weight: bold;');
console.log('%cLooking for something? Check out the code on GitHub!', 'color: #ff00ff; font-size: 14px;');
console.log('%c💼 Portfolio designed & developed by UZER SHAIKH', 'color: #00ff88; font-size: 12px;');

// ===================================
// 16. PREVENT RIGHT CLICK (Optional - Remove if not needed)
// ===================================

// Uncomment if you want to prevent right-click on images
/*
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showNotification('Image protection enabled', 'success');
    });
});
*/

// ===================================
// 17. PAGE LOAD ANIMATION
// ===================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// 18. KEYBOARD NAVIGATION ENHANCEMENT
// ===================================

// Escape key closes mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===================================
// 19. PRINT STYLES TRIGGER
// ===================================

window.addEventListener('beforeprint', () => {
    console.log('Preparing to print...');
    // Add any print-specific modifications here
});

// ===================================
// 20. RESPONSIVE BREAKPOINT DETECTION
// ===================================

let currentBreakpoint = '';

function checkBreakpoint() {
    const width = window.innerWidth;
    let newBreakpoint = '';
    
    if (width <= 480) {
        newBreakpoint = 'mobile-small';
    } else if (width <= 768) {
        newBreakpoint = 'mobile';
    } else if (width <= 1024) {
        newBreakpoint = 'tablet';
    } else {
        newBreakpoint = 'desktop';
    }
    
    if (newBreakpoint !== currentBreakpoint) {
        currentBreakpoint = newBreakpoint;
        console.log('Breakpoint changed to:', currentBreakpoint);
        
        // Remove custom cursor on mobile/tablet
        if (currentBreakpoint !== 'desktop') {
            if (cursor) cursor.remove();
            if (cursorFollower) cursorFollower.remove();
        }
    }
}

checkBreakpoint();
window.addEventListener('resize', debounce(checkBreakpoint, 250));

// ===================================
// END OF JAVASCRIPT
// ===================================

console.log('%c✨ Portfolio fully loaded!', 'color: #00ffff; font-size: 16px; font-weight: bold;');
