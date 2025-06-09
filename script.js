// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Smooth scrolling with improved behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
});

// Truck Slideshow Implementation
class TruckSlideshow {
    constructor() {
        this.trucks = [
            {
                brand: 'IVECO',
                model: 'S-Way',
                image: '',
                description: 'IVECO S-Way - Premium Heavy Duty Truck'
            },
            {
                brand: 'MAN',
                model: 'TGX',
                image: 'https://images.app.goo.gl/aUVtdQ6hiWPLN5SR7',
                description: 'MAN TGX - Efficient Long Distance Transport'
            },
            {
                brand: 'IVECO',
                model: 'Eurocargo',
                image: '',
                description: 'IVECO Eurocargo - Urban Delivery Solutions'
            },
            {
                brand: 'MAN',
                model: 'TGM',
                image: '',
                description: 'MAN TGM - Versatile Distribution Truck'
            },
            {
                brand: 'IVECO',
                model: 'Daily',
                image: '',
                description: 'IVECO Daily - Light Commercial Vehicle'
            },
            {
                brand: 'MAN',
                model: 'TGS',
                image: '',
                description: 'MAN TGS - Construction & Mining Specialist'
            }
        ];
        
        this.currentIndex = 0;
        this.isPlaying = true;
        this.slideInterval = null;
        this.transitionDuration = 500;
        
        this.init();
    }
    
    init() {
        this.createSlideshowContainer();
        this.createSlides();
        this.createControls();
        this.createIndicators();
        this.setupEventListeners();
        this.startSlideshow();
        this.preloadImages();
    }
    
    createSlideshowContainer() {
        // Create slideshow container and inject it into the hero section
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const slideshowHTML = `
            <div class="truck-slideshow" id="truckSlideshow">
                <div class="slideshow-container">
                    <div class="slides-wrapper"></div>
                    <div class="slideshow-overlay"></div>
                    <div class="slideshow-content">
                        <div class="slide-info">
                            <h3 class="slide-brand"></h3>
                            <p class="slide-description"></p>
                        </div>
                    </div>
                    <div class="slideshow-controls">
                        <button class="slide-btn prev-btn" aria-label="Previous slide">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="slide-btn next-btn" aria-label="Next slide">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="slide-indicators"></div>
                </div>
            </div>
        `;
        
        heroSection.insertAdjacentHTML('afterbegin', slideshowHTML);
        
        // Add CSS styles dynamically
        this.addSlideshowStyles();
    }
    
    addSlideshowStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .truck-slideshow {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 0;
                overflow: hidden;
            }
            
            .slideshow-container {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .slides-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .truck-slide {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity ${this.transitionDuration}ms ease-in-out, transform ${this.transitionDuration}ms ease-in-out;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                transform: scale(1.05);
            }
            
            .truck-slide.active {
                opacity: 1;
                transform: scale(1);
            }
            
            .slideshow-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%);
                z-index: 1;
            }
            
            .slideshow-content {
                position: absolute;
                bottom: 40px;
                left: 40px;
                right: 40px;
                z-index: 2;
                color: white;
            }
            
            .slide-info {
                background: rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                padding: 20px 30px;
                border-radius: 15px;
                border: 1px solid rgba(255,255,255,0.1);
                max-width: 400px;
                transform: translateY(20px);
                opacity: 0;
                transition: all 0.6s ease;
            }
            
            .slide-info.active {
                transform: translateY(0);
                opacity: 1;
            }
            
            .slide-brand {
                font-size: 2.2rem;
                font-weight: 900;
                margin: 0 0 10px 0;
                color: #fff;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            
            .slide-description {
                font-size: 1.1rem;
                margin: 0;
                color: rgba(255,255,255,0.9);
                font-weight: 500;
            }
            
            .slideshow-controls {
                position: absolute;
                top: 50%;
                left: 20px;
                right: 20px;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 3;
                pointer-events: none;
            }
            
            .slide-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                pointer-events: auto;
                font-size: 1.2rem;
            }
            
            .slide-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.1);
                border-color: rgba(255,255,255,0.5);
            }
            
            .slide-indicators {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                z-index: 3;
            }
            
            .indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255,255,255,0.4);
                border: 2px solid rgba(255,255,255,0.6);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .indicator.active {
                background: white;
                transform: scale(1.2);
            }
            
            .indicator:hover {
                background: rgba(255,255,255,0.8);
            }
            
            @media (max-width: 768px) {
                .slideshow-content {
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                }
                
                .slide-info {
                    padding: 15px 20px;
                    max-width: 100%;
                }
                
                .slide-brand {
                    font-size: 1.6rem;
                }
                
                .slide-description {
                    font-size: 1rem;
                }
                
                .slide-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 1rem;
                }
                
                .slideshow-controls {
                    left: 10px;
                    right: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createSlides() {
        const slidesWrapper = document.querySelector('.slides-wrapper');
        if (!slidesWrapper) return;
        
        this.trucks.forEach((truck, index) => {
            const slide = document.createElement('div');
            slide.className = `truck-slide ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `url(${truck.image})`;
            slide.setAttribute('data-index', index);
            slidesWrapper.appendChild(slide);
        });
        
        this.updateSlideInfo();
    }
    
    createControls() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    createIndicators() {
        const indicatorsContainer = document.querySelector('.slide-indicators');
        if (!indicatorsContainer) return;
        
        this.trucks.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('data-index', index);
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    setupEventListeners() {
        // Pause on hover
        const slideshow = document.querySelector('.truck-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => {
                if (this.isPlaying) this.pauseSlideshow();
            });
            
            slideshow.addEventListener('mouseleave', () => {
                if (this.isPlaying) this.startSlideshow();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/swipe support
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        const slideshow = document.querySelector('.truck-slideshow');
        if (!slideshow) return;
        
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        slideshow.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        slideshow.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }
    
    startSlideshow() {
        if (this.slideInterval) this.pauseSlideshow();
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 3000);
    }
    
    pauseSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.startSlideshow();
        } else {
            this.pauseSlideshow();
        }
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.trucks.length;
        this.updateSlides();
    }
    
    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.trucks.length) % this.trucks.length;
        this.updateSlides();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlides();
    }
    
    updateSlides() {
        const slides = document.querySelectorAll('.truck-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
        
        this.updateSlideInfo();
    }
    
    updateSlideInfo() {
        const slideInfo = document.querySelector('.slide-info');
        const slideBrand = document.querySelector('.slide-brand');
        const slideDescription = document.querySelector('.slide-description');
        
        if (!slideInfo || !slideBrand || !slideDescription) return;
        
        const currentTruck = this.trucks[this.currentIndex];
        
        // Fade out
        slideInfo.classList.remove('active');
        
        setTimeout(() => {
            // Update content
            slideBrand.textContent = `${currentTruck.brand} ${currentTruck.model}`;
            slideDescription.textContent = currentTruck.description;
            
            // Fade in
            slideInfo.classList.add('active');
        }, 200);
    }
    
    preloadImages() {
        this.trucks.forEach(truck => {
            const img = new Image();
            img.src = truck.image;
        });
    }
    
    destroy() {
        this.pauseSlideshow();
        const slideshow = document.querySelector('.truck-slideshow');
        if (slideshow) slideshow.remove();
    }
}

// Initialize slideshow when DOM is loaded
let truckSlideshow;
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for hero section to be ready
    setTimeout(() => {
        truckSlideshow = new TruckSlideshow();
    }, 100);
});

// Scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and elements with animation classes
document.querySelectorAll('section, .animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-scale').forEach(element => {
    observer.observe(element);
});

// Staggered animations for lists
document.querySelectorAll('.stagger-animation').forEach(container => {
    const items = container.children;
    Array.from(items).forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Form validation and submission with enhanced UX
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('input[name="name"]').value.trim();
        const email = this.querySelector('input[name="email"]').value.trim();
        const message = this.querySelector('textarea[name="message"]').value.trim();
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission with loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate API call
        setTimeout(() => {
            this.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            showNotification('Message sent successfully!', 'success');
        }, 1500);
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// WhatsApp button click handler with enhanced UX
const whatsappButton = document.querySelector('.whatsapp-button');
if (whatsappButton) {
    whatsappButton.addEventListener('click', function(e) {
        e.preventDefault();
        const phoneNumber = '966504106845';
        const message = 'Hello! I would like to inquire about your trucking services.';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Add click animation
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 300);
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
    });
}

// Add smooth scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Language Toggle Functionality
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  // Update all elements with data-en/data-ar
  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      // For input/textarea, update placeholder
      el.placeholder = el.getAttribute(`data-${lang}`) || '';
    } else {
      el.textContent = el.getAttribute(`data-${lang}`) || '';
    }
  });
  // Update document direction
  if (lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.body.classList.add('lang-ar');
    document.body.classList.remove('lang-en');
  } else {
    document.documentElement.dir = 'ltr';
    document.body.classList.add('lang-en');
    document.body.classList.remove('lang-ar');
  }
  // Update toggle button text
  langToggle.textContent = lang === 'en' ? 'AR' : 'EN';
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
  });
}

// Set default language on load
setLanguage('en');