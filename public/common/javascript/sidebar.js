document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link-wrapper');
    const sidebar = document.getElementById('global-sidebar');
    const mobileNavButton = document.getElementById('mobile-nav-button');
    const breakpoint = window.matchMedia('(max-width: 800px)');

    // Mark the current nav link as active
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    let navIsVisible = !breakpoint.matches; // visible by default on desktop

    function updateSidebarVisibility() {
        if (breakpoint.matches) {
            // Mobile: use toggle state
            sidebar.style.opacity = navIsVisible ? 1 : 0;
            sidebar.style.pointerEvents = navIsVisible ? 'all' : 'none';
            sidebar.style.zIndex = navIsVisible ? 1000 : -1000;
            sidebar.style.transform = navIsVisible ? 'scale(1)' : 'scale(0.98)';
            sidebar.style.marginBottom = navIsVisible ? '0' : '1rem';
        } else {
            // Desktop: always visible
            sidebar.style.opacity = 1;
            sidebar.style.pointerEvents = 'all';
            sidebar.style.zIndex = 1000;
            sidebar.style.transform = 'none';
            sidebar.style.marginBottom = '0';
        }
    }

    // Mobile nav toggle button
    mobileNavButton.addEventListener('click', function () {
        // Only toggle if in mobile view
        if (breakpoint.matches) {
            navIsVisible = !navIsVisible;
            updateSidebarVisibility();
        }
    });

    // Handle screen resizes
    breakpoint.addEventListener('change', () => {
        navIsVisible = !breakpoint.matches; // reset visibility on mode switch
        updateSidebarVisibility();
    });

    // Initial setup
    updateSidebarVisibility();
});