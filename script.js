/* ─────────────────────────────────────────────
   JEREMIAH PEREZ — PORTFOLIO JS v2
───────────────────────────────────────────── */

// ── Theme ──────────────────────────────────────
const html = document.documentElement;
const savedTheme = localStorage.getItem('jp-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeLabel();

function toggleTheme() {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('jp-theme', next);
    updateThemeLabel();
}

function updateThemeLabel() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-label').forEach(el => {
        el.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    });
}

document.getElementById('themeBtnSb')?.addEventListener('click', toggleTheme);
document.getElementById('themeBtnMob')?.addEventListener('click', toggleTheme);

// ── Mobile sidebar ──────────────────────────────
const leftPanel = document.getElementById('leftPanel');
const mobOverlay = document.getElementById('mobOverlay');
const mobMenuBtn = document.getElementById('mobMenuBtn');

function openPanel() {
    leftPanel?.classList.add('open');
    mobOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closePanel() {
    leftPanel?.classList.remove('open');
    mobOverlay?.classList.remove('active');
    document.body.style.overflow = '';
}

mobMenuBtn?.addEventListener('click', () => {
    leftPanel?.classList.contains('open') ? closePanel() : openPanel();
});
mobOverlay?.addEventListener('click', closePanel);

// Close on nav link click (mobile)
document.querySelectorAll('.lp-inner a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closePanel();
    });
});

// ── Smooth scroll ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (!href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const isMobile = window.innerWidth <= 768;
        const topbarH = isMobile ? 52 : 0;
        const offset = target.getBoundingClientRect().top + window.scrollY - topbarH - 16;
        // On desktop, scroll within right panel
        const rightPanel = document.getElementById('rightPanel');
        if (rightPanel && !isMobile) {
            const relOffset = target.getBoundingClientRect().top + rightPanel.scrollTop - 16;
            rightPanel.scrollTo({ top: relOffset, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

// ── Scroll reveal ────────────────────────────────
function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0');
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    // Stagger cards
    document.querySelectorAll('.proj-card').forEach((el, i) => { el.dataset.delay = i * 80; });
    document.querySelectorAll('.cert-card').forEach((el, i) => { el.dataset.delay = i * 70; });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
setupReveal();

// Also observe with right panel scroll on desktop
const rightPanel = document.getElementById('rightPanel');
if (rightPanel) {
    const rpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0');
                setTimeout(() => entry.target.classList.add('visible'), delay);
                rpObserver.unobserve(entry.target);
            }
        });
    }, {
        root: rightPanel,
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });
    document.querySelectorAll('.reveal').forEach(el => rpObserver.observe(el));
}

// ── Scroll hint ─────────────────────────────────
const scrollHint = document.querySelector('.scroll-hint');

function hideScrollHint() {
    if (!scrollHint) return;
    scrollHint.classList.add('hidden');
}

function showScrollHint() {
    if (!scrollHint) return;
    scrollHint.classList.remove('hidden');
}

scrollHint?.addEventListener('click', () => {
    const projects = document.getElementById('projects');
    if (projects && rightPanel) {
        rightPanel.scrollTo({ top: projects.offsetTop - 16, behavior: 'smooth' });
    } else if (projects) {
        projects.scrollIntoView({ behavior: 'smooth' });
    }
    hideScrollHint();
});

rightPanel?.addEventListener('scroll', () => {
    if (rightPanel.scrollTop > 60) {
        hideScrollHint();
    } else {
        showScrollHint();
    }
}, { passive: true });

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        hideScrollHint();
    } else {
        showScrollHint();
    }
}, { passive: true });


// ── Section header animations ────────────────────
const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            headerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    headerObserver.observe(el);
});

// Also for right panel
if (rightPanel) {
    const rpHeaderObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                rpHeaderObs.unobserve(entry.target);
            }
        });
    }, { root: rightPanel, threshold: 0.1 });
    document.querySelectorAll('.section-header').forEach(el => rpHeaderObs.observe(el));
}



// ── Skill chip micro-interactions ───────────────
document.querySelectorAll('.sk').forEach(chip => {
    chip.addEventListener('mouseenter', () => {
        chip.style.transform = 'translateY(-2px) scale(1.05)';
        chip.style.transition = 'all 0.15s ease';
    });
    chip.addEventListener('mouseleave', () => {
        chip.style.transform = '';
    });
});

// ── Entrance animation for hero ──────────────────
window.addEventListener('DOMContentLoaded', () => {
    const heroEls = [
        '.rp-photo-frame',
        '.rp-greeting',
        '.rp-headline',
        '.rp-about',
        '.rp-cta-row',
        '.stats-row',
        '.rp-bottom-grid'
    ];
    heroEls.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        });
    });
});

// ── Console easter egg ───────────────────────────
console.log('%c👋 Hey there!', 'font-size:20px; font-weight:700;');
console.log('%cLooking for a developer? You found one!', 'font-size:14px; color:#2563eb;');
console.log('%c📧 perezjrmh@gmail.com', 'font-size:12px; color:#888;');