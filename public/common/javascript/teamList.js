document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.team-members-container').addEventListener('click', function(e) {
        const teamMember = e.target.closest('.team-member');
        if (!teamMember) return;

    });

    const addDropdown = document.getElementById('addDropdown');
    const removeDropdown = document.getElementById('removeDropdown');

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

    addDropdown.addEventListener('click', () => {
        addDropdownOpen = !addDropdownOpen;
        removeDropdownOpen = false;
        updateDropdowns();
    });
    
    removeDropdown.addEventListener('click', () => {
        removeDropdownOpen = !removeDropdownOpen;
        addDropdownOpen = false;
        updateDropdowns();
    });

    function updateDropdowns() {
        addDropdown.classList.toggle('dropdown-open', addDropdownOpen);
        removeDropdown.classList.toggle('dropdown-open', removeDropdownOpen);
    }
});