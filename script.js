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

    // Only apply complex mousemove effects on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        interactables.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                item.style.transform = `translate(${x * 0.03}px, ${y * 0.03}px)`;
                item.style.transition = 'transform 0.6s ease-out';
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursor.style.background = 'var(--clr-primary)';
                cursor.style.mixBlendMode = 'normal';
                cursor.style.opacity = '0.15';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.transition = 'transform 0.8s ease-out';
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'white';
                cursor.style.mixBlendMode = 'difference';
                cursor.style.opacity = '0.5';
            });
        });
    }

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

    // =========================================================================
    // MOBILE MENU FUNCTIONALITY
    // =========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    function openMobileMenu() {
        if (!mobileMenuBtn || !mobileMenu || !mobileOverlay) return;
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileMenuBtn || !mobileMenu || !mobileOverlay) return;
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            isOpen ? closeMobileMenu() : openMobileMenu();
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Mobile submenu dropdowns
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            const submenu = btn.nextElementSibling;

            // Close other submenus
            mobileDropdownBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    const otherSub = otherBtn.nextElementSibling;
                    if (otherSub) otherSub.classList.remove('open');
                }
            });

            btn.setAttribute('aria-expanded', !isExpanded);
            if (submenu) submenu.classList.toggle('open', !isExpanded);
        });
    });

    // Close mobile menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && mobileMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu when clicking nav links
    document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-btn), .mobile-submenu a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ========================================
    // DEALS PAGINATION
    // ========================================
    const dealsSection = document.querySelector('#deals .grid-main');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const paginationNumbers = document.getElementById('pagination-numbers');

    if (dealsSection && prevBtn && nextBtn && paginationNumbers) {
        const allCards = Array.from(dealsSection.querySelectorAll('.card-deal-v2'));
        const cardsPerPage = 9; // 3 rows x 3 cards
        let currentPage = 1;
        const totalPages = Math.ceil(allCards.length / cardsPerPage);

        function showPage(page) {
            currentPage = page;
            const start = (page - 1) * cardsPerPage;
            const end = start + cardsPerPage;

            allCards.forEach((card, index) => {
                if (index >= start && index < end) {
                    card.style.display = '';
                    card.classList.add('reveal', 'active');
                } else {
                    card.style.display = 'none';
                }
            });

            // Update buttons
            prevBtn.disabled = page === 1;
            nextBtn.disabled = page === totalPages;

            // Update page numbers
            renderPageNumbers();

            // Scroll to deals section
            if (page > 1) {
                dealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function renderPageNumbers() {
            paginationNumbers.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    const btn = document.createElement('button');
                    btn.className = 'pagination-num' + (i === currentPage ? ' active' : '');
                    btn.textContent = i;
                    btn.addEventListener('click', () => showPage(i));
                    paginationNumbers.appendChild(btn);
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    const dots = document.createElement('span');
                    dots.className = 'pagination-dots';
                    dots.textContent = '...';
                    paginationNumbers.appendChild(dots);
                }
            }
        }

        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) showPage(currentPage - 1);
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) showPage(currentPage + 1);
        });

        // Initialize first page
        showPage(1);
    }
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
