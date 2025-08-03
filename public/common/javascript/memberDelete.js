import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    closeModalButton(modalConfirmButton, true);

    const deleteButton = document.getElementById('deleteMembersButton');
    const membersContainer = document.getElementById('memberSearchResults');
    const addedMembersContainer = document.getElementById('addedMembers');
    const searchInput = document.getElementById('memberSearchInput');
    const searchForm = document.getElementById('memberSearchForm');
    const deleteForm = deleteButton.closest('form');
    let addedMembers = [];

    // Prevent default form submit on Enter
    searchForm.addEventListener('submit', (e) => e.preventDefault());

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();

        if (query === '') {
            window.location.reload(); // Reload to show original list
            return;
        }

        try {
            const res = await fetch(`/searchEmployees?q=${encodeURIComponent(query)}`);
            const data = await res.json();

            membersContainer.innerHTML = '';

            if (data.results.length === 0) {
                membersContainer.innerHTML = '<p>No members found.</p>';
                return;
            }

            data.results.forEach(member => {
                const button = document.createElement('button');
                button.className = 'team-member-mini-card';
                button.type = 'button';
                button.dataset.id = member._id;
                button.dataset.email = member.email || '';
                button.dataset.bio = member.bio || '';
                button.dataset.role = member.role || '';
                button.dataset.firstName = member.firstName || '';
                button.dataset.lastName = member.lastName || '';
                button.dataset.pfp = `/api/avatar/${member._id}`;

                button.innerHTML = `
                    <img class="team-member-mini-picture" src="/api/avatar/${member._id}" />
                    <span id="full-name">${member.firstName} ${member.lastName}</span>
                    <span id="role">${member.role}</span>
                    <i id="teamMiniAddButton" class="lni lni-plus"></i>
                    <i id="teamMiniRemoveButton" class="lni lni-xmark"></i>
                `;

                membersContainer.appendChild(button);
            });
        } catch (err) {
            console.error('Search error:', err);
            membersContainer.innerHTML = '<p>Something went wrong during search.</p>';
        }
    });

    // Selection logic
    membersContainer.addEventListener('click', (event) => {
        const member = event.target.closest('.team-member-mini-card');
        if (!member) return;

        const selected = member.classList.contains('selected-team-member');
        member.classList.toggle('selected-team-member', !selected);

        if (!selected) {
            const clone = member.cloneNode(true);
            addedMembers.push(member.dataset.id);
            member._cloneRef = clone;

            clone.addEventListener('click', () => {
                addedMembersContainer.removeChild(clone);
                member.classList.remove('selected-team-member');
                addedMembers = addedMembers.filter(id => id !== member.dataset.id);
            });

            addedMembersContainer.appendChild(clone);
        } else {
            if (member._cloneRef && addedMembersContainer.contains(member._cloneRef)) {
                addedMembersContainer.removeChild(member._cloneRef);
                addedMembers = addedMembers.filter(id => id !== member.dataset.id);
                member._cloneRef = null;
            }
        }

        deleteButton.disabled = addedMembers.length === 0;
        deleteButton.classList.toggle('disabled-button', deleteButton.disabled);
    });

    // Add hidden inputs on delete submit
    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent native form submission

        deleteForm.querySelectorAll('input[name="memberIds"]').forEach(el => el.remove());

        addedMembers.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'memberIds';
            input.value = id;
            deleteForm.appendChild(input);
        });

        deleteForm.submit(); 
    });

});
