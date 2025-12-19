document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('lingscars-theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.style.transition = 'background-color 1.5s var(--silk-ease), color 1.5s var(--silk-ease), filter 1.5s var(--silk-ease)';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('lingscars-theme', newTheme);
        updateThemeUI(newTheme);
    });

    function updateThemeUI(theme) {
        themeIcon.textContent = theme === 'dark' ? '🔆' : '🌙';
    }

    const cursor = document.getElementById('custom-cursor');
    const orbs = document.querySelectorAll('.glass-orb');

    document.addEventListener('mousemove', (e) => {
        const xPercent = e.clientX / window.innerWidth;
        const yPercent = e.clientY / window.innerHeight;
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        orbs.forEach((orb, index) => {
            const depth = (index + 1) * 15;
            const moveX = (xPercent - 0.5) * depth;
            const moveY = (yPercent - 0.5) * depth;
            orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    const interactables = document.querySelectorAll('.btn-nexus, .brand-card-v2, .nav-link, .card-deal-v2');

    interactables.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
            item.style.transition = 'transform 0.3s var(--silk-ease)';
            cursor.style.transform = 'translate(-50%, -50%) scale(3)';
            cursor.style.background = 'var(--clr-primary)';
            cursor.style.mixBlendMode = 'normal';
            cursor.style.opacity = '0.2';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.transition = 'transform 1s var(--silk-ease)';
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'white';
            cursor.style.mixBlendMode = 'difference';
            cursor.style.opacity = '0.5';
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px"
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 100;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    const selects = document.querySelectorAll('select.search-input-field');
    selects.forEach(select => {
        const container = document.createElement('div');
        container.className = 'luxury-select-container';
        const trigger = document.createElement('div');
        trigger.className = 'luxury-select-trigger';
        trigger.textContent = select.options[select.selectedIndex].textContent;
        const optionsView = document.createElement('div');
        optionsView.className = 'luxury-select-options';
        Array.from(select.options).forEach(opt => {
            const item = document.createElement('div');
            item.className = 'luxury-select-option';
            item.textContent = opt.textContent;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                select.value = opt.value;
                trigger.textContent = opt.textContent;
                container.classList.remove('open');
                select.dispatchEvent(new Event('change'));
            });
            optionsView.appendChild(item);
        });
        container.appendChild(trigger);
        container.appendChild(optionsView);
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.luxury-select-container').forEach(c => {
                if (c !== container) c.classList.remove('open');
            });
            container.classList.toggle('open');
        });
        select.parentNode.insertBefore(container, select);
        select.style.display = 'none';
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.luxury-select-container').forEach(c => c.classList.remove('open'));
    });
});

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    #custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: transform 0.2s var(--liquid-ease), background 0.3s ease, opacity 0.3s ease;
        mix-blend-mode: difference;
        opacity: 0.5;
    }
    @media (max-width: 768px) {
        #custom-cursor { display: none; }
    }
`;
document.head.appendChild(cursorStyle);
