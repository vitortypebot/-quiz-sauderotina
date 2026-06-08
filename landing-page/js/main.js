/* ============================================
   5 MINUTE WORK FACE SYSTEM - LANDING PAGE SCRIPTS
   ============================================ */

// Timer Functionality
function initTimers() {
    // Set timer to 3 hours from now
    const now = new Date();
    const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    
    // Save to localStorage
    localStorage.setItem('timerEndTime', endTime.getTime());
    
    updateTimers();
    setInterval(updateTimers, 1000);
}

function updateTimers() {
    const endTime = parseInt(localStorage.getItem('timerEndTime'));
    if (!endTime) return;
    
    const now = new Date().getTime();
    const diff = endTime - now;
    
    if (diff <= 0) {
        // Timer expired, reset
        localStorage.removeItem('timerEndTime');
        initTimers();
        return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update all timers
    const timers = document.querySelectorAll('.timer');
    timers.forEach(timer => {
        timer.textContent = timeString;
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// CTA Click Tracking
function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.btn-primary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Track CTA click with Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'InitiateCheckout', {
                    content_name: '5 Minute Work Face System',
                    value: 17.90,
                    currency: 'USD'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.problem-card, .solution-card, .testimonial-card, .value-item, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initTimers();
    initFAQ();
    initSmoothScroll();
    initCTATracking();
    initScrollAnimations();
    initHeaderScroll();
});

// Track Page View
if (typeof fbq !== 'undefined') {
    fbq('track', 'ViewContent', {
        content_name: '5 Minute Work Face System - Landing Page'
    });
}
