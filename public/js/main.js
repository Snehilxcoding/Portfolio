// Preloader — hides once the page (fonts, CSS, images) has fully loaded.
// Smooths out the flash-of-unstyled-content on every visit. Note: this can't
// mask the free-tier cold-start delay itself (that happens before any HTML
// arrives) — see README for the uptime-pinger fix for that.
const preloader = document.getElementById('preloader');
if (preloader) {
    const hidePreloader = () => preloader.classList.add('hidden');
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
        // Safety net: never block the page for more than 2.5s even if a
        // slow-loading asset (e.g. a font) stalls the 'load' event.
        setTimeout(hidePreloader, 2500);
    }
}

// Scroll progress bar
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = pct + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Spotlight glow that follows the cursor on cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
    });
});

// Stat counters — animate from 0 to target when scrolled into view
const statEls = document.querySelectorAll('.stat-number');
if (statEls.length) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target, prefersReducedMotion);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    statEls.forEach(el => statObserver.observe(el));
}

function animateCount(el, skipAnimation) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (skipAnimation || !target) {
        el.textContent = target + suffix;
        return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
}

// Contact form submission — sent directly to Web3Forms (no backend involved).
// Replace WEB3FORMS_ACCESS_KEY below with your own key from https://web3forms.com
// (free, 250 submissions/month, no card required). The key is designed to be
// public/client-side safe — it just routes submissions to your inbox.
const WEB3FORMS_ACCESS_KEY = '8c53c36d-e969-40c7-9730-7c00edbc9592';

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const statusEl = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusEl.textContent = '';
        statusEl.className = '';

        const data = {
            access_key: WEB3FORMS_ACCESS_KEY,
            name: contactForm.name.value.trim(),
            email: contactForm.email.value.trim(),
            message: contactForm.message.value.trim(),
            subject: 'New message from your portfolio site',
        };

        if (!data.name || !data.email || !data.message) {
            statusEl.textContent = 'Please fill in all fields.';
            statusEl.className = 'error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            if (res.ok && result.success) {
                statusEl.textContent = "Message sent — I'll get back to you soon.";
                statusEl.className = 'success';
                contactForm.reset();
            } else {
                statusEl.textContent = result.message || 'Something went wrong. Please try again.';
                statusEl.className = 'error';
            }
        } catch (err) {
            statusEl.textContent = 'Network error — please try again or email me directly.';
            statusEl.className = 'error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}
