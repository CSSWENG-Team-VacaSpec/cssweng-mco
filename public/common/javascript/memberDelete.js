import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    closeModalButton(modalConfirmButton, '/teamList');

    const deleteButton = document.getElementById('deleteMembersButton');
    const membersContainer = document.getElementById('memberSearchResults');
    const addedMembersContainer = document.getElementById('addedMembers');
    let addedMembers = [];

    membersContainer.addEventListener('click', (event) => {
        const member = event.target.closest('.team-member-mini-card');
        let selected = member.classList.contains('selected-team-member');
        member.classList.toggle('selected-team-member', !selected);
        
        if (!selected) {
            const clone = member.cloneNode(true);
            addedMembers.push(member.dataset.id);
            
            
            // satore reference to clone on the original element
            member._cloneRef = clone;
            
            clone.addEventListener('click', function() {
                addedMembersContainer.removeChild(clone);
                member.classList.remove('selected-team-member');
            });
            
            addedMembersContainer.appendChild(clone);
        } else {
            // remove clone if exists when deselecting
            if (member._cloneRef && addedMembersContainer.contains(member._cloneRef)) {
                addedMembersContainer.removeChild(member._cloneRef);
                addedMembers.pop(member.dataset.id);
                member._cloneRef = null;
            }
        }
        
        deleteButton.disabled = addedMembers.length === 0;
        deleteButton.classList.toggle('disabled-button', deleteButton.disabled);
        console.log(addedMembers);
    });
});