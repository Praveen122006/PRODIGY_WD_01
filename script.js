/**
 * SONICBEAST AUDIO - INTERACTIVE SCRIPTS
 * Description: Navbar scroll styling, mobile menu toggle, active section tracking, 
 * spotlight hover coordinates, and custom IEM recommendation calculator.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    function checkScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    }
    
    // Initial load check + scroll listener
    checkScroll();
    window.addEventListener('scroll', checkScroll);


    // --- 2. Mobile Menu Toggle (Hamburger) ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent background scrolling while menu drawer is active
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu drawer upon clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside of the active area
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    // --- 3. Scroll Section Active Tracker (Intersection Observer) ---
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    // --- 4. Card Mouse Hover Spotlight Effect ---
    // Tracks pointer coordinates over cards to update CSS variables (--x, --y)
    const cardsToSpotlight = document.querySelectorAll('.anatomy-card, .tuning-card, .guide-item-card, .store-card, .showcase-card');

    cardsToSpotlight.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });


    // --- 5. Interactive IEM Recommendation Calculator Form ---
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('formSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const useCase = document.getElementById('userPrimaryUse').value;
            
            if (!name || !email || !useCase) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }

            // Button loading simulation
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Analyzing Acoustics...';
            submitBtn.disabled = true;
            
            // Map selected use cases to recommended product recommendations
            let recModel = '';
            let recExplanation = '';

            switch(useCase) {
                case 'music':
                    recModel = 'SonicBeast Pulse (Dynamic)';
                    recExplanation = 'featuring dynamic sub-bass response and warm acoustic mids for pleasant long-session listening.';
                    break;
                case 'gaming':
                    recModel = 'SonicBeast Clarity (Hybrid)';
                    recExplanation = 'featuring precise balanced-armature highs for directionality and low-latency response to pick up footstep cues.';
                    break;
                case 'production':
                    recModel = 'SonicBeast Maestro (Reference)';
                    recExplanation = 'featuring 4 flat balanced-armatures for clinical reference sound signature, allowing uncolored audio mixing.';
                    break;
                case 'stage':
                    recModel = 'SonicBeast Maestro (Reference)';
                    recExplanation = 'offering absolute isolation (-26dB) and balanced crossovers to monitor vocals and instruments cleanly on stage.';
                    break;
                default:
                    recModel = 'SonicBeast Clarity (Hybrid)';
                    recExplanation = 'offering our most versatile hybrid driver configuration.';
            }

            setTimeout(() => {
                showFeedback(
                    `Hello ${name}! We've analyzed your requirements. Based on your preferences, we recommend the <strong>${recModel}</strong>, ${recExplanation} We have emailed this recommendation report to ${email}.`, 
                    'success'
                );
                contactForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 1800);
        });
    }

    function showFeedback(msg, status) {
        formFeedback.innerHTML = msg; // Inner HTML to support strong tags
        formFeedback.className = 'form-feedback-message';
        formFeedback.classList.add(status);
        
        // Auto fadeout message after 10 seconds due to longer recommendation text
        setTimeout(() => {
            formFeedback.innerHTML = '';
            formFeedback.className = 'form-feedback-message';
        }, 12000);
    }
});
