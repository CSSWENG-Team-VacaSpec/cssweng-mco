document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.team-members-container').addEventListener('click', function(e) {
        const teamMember = e.target.closest('.team-member');
        if (!teamMember) return;

    });
});