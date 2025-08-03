document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.team-members-container').addEventListener('click', function(e) {
        const teamMember = e.target.closest('.team-member');
        if (!teamMember) return;
    });

    const addDropdown = document.querySelectorAll('#addDropdown');
    const removeDropdown = document.querySelectorAll('#removeDropdown');

    let addDropdownOpen = false;
    let removeDropdownOpen = false;

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#addDropdown')) {
            addDropdownOpen = false;
        }

        if (!e.target.closest('#removeDropdown')) {
            removeDropdownOpen = false;
        }

        updateDropdowns();
    });

    addDropdown.forEach(el => {
        el.addEventListener('click', () => {
            addDropdownOpen = !addDropdownOpen;
            removeDropdownOpen = false;
            updateDropdowns();
        });
    });

    removeDropdown.forEach(el => {
        el.addEventListener('click', () => {
            removeDropdownOpen = !removeDropdownOpen;
            addDropdownOpen = false;
            updateDropdowns();
        });
    });

    function updateDropdowns() {
        addDropdown.forEach(el => {
            el.classList.toggle('dropdown-open', addDropdownOpen);
        });

        removeDropdown.forEach(el => {
            el.classList.toggle('dropdown-open', removeDropdownOpen);
        });
    }

    // --- LIVE SEARCH FIX (Issues #03 & #04) ---
    const searchInput = document.querySelector('.search-bar input[name="q"]');
    const searchForm = document.querySelector('.search-bar');

    if (searchInput && searchForm) {
        function debounce(func, delay) {
            let timer;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(this, args), delay);
            };
        }

        const handleSearch = debounce(() => {
            searchForm.submit();
        }, 300);

        searchInput.addEventListener('input', () => {
            // Submit form when typing stops
            handleSearch();

            // Immediately submit if field becomes empty (e.g., CTRL+Delete)
            if (searchInput.value.trim() === '') {
                searchForm.submit();
            }
        });
    }
});
