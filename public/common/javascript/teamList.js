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
});