document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Toggle (Dark/Light) ---
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if(themeToggle) themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            let theme = document.body.getAttribute('data-theme');
            if (theme === 'dark') {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
            }
            // Update charts if they exist
            updateChartsTheme();
        });
    }

    // --- RTL Toggle ---
    const rtlToggle = document.getElementById('rtlToggle');
    const currentDir = localStorage.getItem('dir') || 'ltr';
    if(currentDir === 'rtl') {
        document.body.setAttribute('dir', 'rtl');
    }

    if(rtlToggle) {
        rtlToggle.addEventListener('click', (e) => {
            e.preventDefault();
            let dir = document.body.getAttribute('dir');
            if(dir === 'ltr' || !dir) {
                document.body.setAttribute('dir', 'rtl');
                localStorage.setItem('dir', 'rtl');
            } else {
                document.body.setAttribute('dir', 'ltr');
                localStorage.setItem('dir', 'ltr');
            }
        });
    }

    // --- Sidebar Toggle for Mobile ---
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // --- Mobile Menu Scroll Lock & Icon Toggle ---
    const navbarNav = document.getElementById('navbarNav');
    if (navbarNav) {
        navbarNav.addEventListener('show.bs.collapse', () => {
            document.body.style.overflow = 'hidden';
            const togglerIcon = document.querySelector('[data-bs-target="#navbarNav"] i, .navbar-toggler i');
            if (togglerIcon) {
                togglerIcon.classList.remove('bi-list');
                togglerIcon.classList.add('bi-x-lg');
            }
        });
        navbarNav.addEventListener('hidden.bs.collapse', () => {
            document.body.style.overflow = '';
            const togglerIcon = document.querySelector('[data-bs-target="#navbarNav"] i, .navbar-toggler i');
            if (togglerIcon) {
                togglerIcon.classList.remove('bi-x-lg');
                togglerIcon.classList.add('bi-list');
            }
        });
    }

    // --- Copy Code Interaction ---
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-clipboard-target');
            const codeBlock = document.querySelector(targetId);
            if (codeBlock) {
                navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="bi bi-check2 text-success"></i> Copied!';
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                    }, 2000);
                });
            }
        });
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.fade-up');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // --- Back to Top Button (footer pages) ---
    const footer = document.querySelector('footer');
    if (footer && !document.querySelector('.back-to-top')) {
        const backToTop = document.createElement('a');
        backToTop.href = '#';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
        document.body.appendChild(backToTop);

        const toggleBackToTop = () => {
            if (window.scrollY > 250) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        };

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop();

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Counter Animations ---
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / 100;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        
        // Simple Intersection Observer to start counter when visible
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                updateCount();
                observer.disconnect();
            }
        });
        observer.observe(counter);
    });

    // --- Initialize Charts if Chart.js is loaded ---
    initCharts();

});

// --- Chart.js Initialization ---
let charts = [];
function initCharts() {
    if (typeof Chart === 'undefined') return;

    // Common Chart Options
    Chart.defaults.color = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim();
    Chart.defaults.font.family = getComputedStyle(document.body).getPropertyValue('--font-body').trim();

    // Vulnerability Chart
    const vulnCtx = document.getElementById('vulnChart');
    if (vulnCtx) {
        charts.push(new Chart(vulnCtx, {
            type: 'doughnut',
            data: {
                labels: ['Medical', 'Legal', 'Educational', 'Corporate'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        '#10B981', // Emerald (Medical)
                        '#F59E0B', // Amber (Legal)
                        '#06B6D4', // Cyan (Educational)
                        '#4F46E5'  // Indigo (Corporate)
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '70%'
            }
        }));
    }

    // Gas Optimization Chart
    const gasCtx = document.getElementById('gasChart');
    if (gasCtx) {
        charts.push(new Chart(gasCtx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'On-Site Hours',
                    data: [150, 220, 180, 240],
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }, {
                    label: 'Virtual Remote (VRI) Hours',
                    data: [85, 140, 190, 210],
                    backgroundColor: '#06B6D4',
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        }));
    }
}

function updateChartsTheme() {
    if (typeof Chart === 'undefined') return;
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const textColor = isLight ? '#475569' : '#aab3c5';
    const gridColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';

    Chart.defaults.color = textColor;
    charts.forEach(chart => {
        if(chart.options.scales && chart.options.scales.y) {
            chart.options.scales.y.grid.color = gridColor;
        }
        chart.update();
    });
}
