document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link-wrapper');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // toggle mobile nav bar visibility.
    let navIsVisible = false;
    const sidebar = document.getElementById('global-sidebar');

    document.getElementById('mobile-nav-button').addEventListener('click', function() {
        navIsVisible = !navIsVisible;

        if (navIsVisible) {
            sidebar.style.opacity = 1;
            sidebar.style.pointerEvents = 'all';
            sidebar.style.marginBottom = 0;
            sidebar.style.transform = 'scale(1)';
        } else {
            sidebar.style.opacity = 0;
            sidebar.style.pointerEvents = 'none';
            sidebar.style.marginBottom = '1rem';
            sidebar.style.transform = 'scale(0.98)';
        }
    });

    // toggle mobile nav menu/sidebar visibility on breakpoint.
    const breakpoint = window.matchMedia('(max-width: 800px)');

    breakpoint.addEventListener('change', function() {
        // make sidebar visible when screen is wide enough.
        if (breakpoint.matches) {
            navIsVisible = true;
            sidebar.style.opacity = 0;
            sidebar.style.pointerEvents = 'none';
            sidebar.style.zIndex = -1000;
        } else { // hide sidebar by default when screen is too narrow.
            navIsVisible = false;
            sidebar.style.opacity = 1;
            sidebar.style.pointerEvents = 'all';
            sidebar.style.zIndex = 1000;
        }
    });
});