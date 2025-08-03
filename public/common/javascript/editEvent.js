import { closeModalButton, modalConfirmButton } from './modal.js';

let page = 0;
const MAX_PAGE = 2;
let addedMembers = [];
let addedSuppliers = [];

document.addEventListener('DOMContentLoaded', () => {
    const eventId = window.eventId || new URLSearchParams(window.location.search).get('id');
    const nextButton = document.getElementById('form-next-button');
    const backButton = document.getElementById('form-back-button');
    const submitButton = document.getElementById('form-submit-button');
    const formContainer = document.getElementsByClassName('form-page-container')[0];
    const membersContainer = document.getElementById('memberSearchResults');
    const addedMembersContainer = document.getElementById('addedMembers');
    const suppliersContainer = document.getElementById('supplierSearchResults');
    const addedSuppliersContainer = document.getElementById('addedSuppliers');
    const statusDropdown = document.getElementById('status-dropdown');
    const statusElement = document.getElementById('event-status');
    let statusDropdownOpen = false;

    // addedMembers = currentMembers.map(m => m._id);
    // addedSuppliers = currentSuppliers.map(s => s._id);

    document.getElementById('added-members-input').value = JSON.stringify(addedMembers);
    document.getElementById('added-suppliers-input').value = JSON.stringify(addedSuppliers);

    const statusInput = document.createElement('input');
    statusInput.type = 'hidden';
    statusInput.name = 'status';
    statusInput.value = statusElement.textContent;
    statusDropdown.appendChild(statusInput);

    const dropdownItems = statusDropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const newStatus = item.dataset.status;
            statusElement.textContent = newStatus;
            statusInput.value = newStatus;
            statusDropdownOpen = false;
            updateDropdowns();
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#status-dropdown')) {
            statusDropdownOpen = false;
            updateDropdowns();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#status-dropdown')) {
            statusDropdownOpen = false;
            updateDropdowns();
        }
    });

    statusDropdown.addEventListener('click', (e) => {
        statusDropdownOpen = !statusDropdownOpen;
        updateDropdowns();
    });

    function updateDropdowns() {
        statusDropdown.classList.toggle('dropdown-open', statusDropdownOpen);
    }

    nextButton.addEventListener('click', () => {
        if (page < MAX_PAGE) {
            page++;
            updatePage();
            updateNavigationButtons();
        }
    });

    backButton.addEventListener('click', () => {
        if (page > 0) {
            page--;
            updatePage();
            updateNavigationButtons();
        }
    });

    closeModalButton(modalConfirmButton, `/event-details?id=${eventId}`);

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
    });

    suppliersContainer.addEventListener('click', (event) => {
        const supplier = event.target.closest('.team-member-mini-card');
        let selected = supplier.classList.contains('selected-team-member');
        supplier.classList.toggle('selected-team-member', !selected);
        
        if (!selected) {
            const clone = supplier.cloneNode(true);
            addedSuppliers.push(supplier.dataset.id);

            // satore reference to clone on the original element
            supplier._cloneRef = clone;

            clone.addEventListener('click', function() {
                addedSuppliersContainer.removeChild(clone);
                supplier.classList.remove('selected-team-member');
            });

            addedSuppliersContainer.appendChild(clone);
        } else {
            // remove clone if exists when deselecting
            if (supplier._cloneRef && addedSuppliersContainer.contains(supplier._cloneRef)) {
                addedSuppliersContainer.removeChild(supplier._cloneRef);
                addedSuppliers.pop(supplier.dataset.id);
                supplier._cloneRef = null;
            }
        }
    });

    function initializeAddedItems() {
        currentTeamMembers.forEach(member => {
            const original = membersContainer.querySelector(`.team-member-mini-card[data-id="${member._id}"]`);
            if (original) {
                original.classList.add('selected-team-member');
                const clone = original.cloneNode(true);
                addedMembers.push(original.dataset.id);

                if (!addedMembers.includes(member._id)) {
                    addedMembers.push(member._id);
                }

                original._cloneRef = clone;

                addedMembersContainer.appendChild(clone);

                clone.addEventListener('click', function() {
                    addedMembersContainer.removeChild(clone);
                    original.classList.remove('selected-team-member');
                });
            }
        });

        currentSuppliers.forEach(supplier => {
            const original = suppliersContainer.querySelector(`.team-member-mini-card[data-id="${supplier._id}"]`);
            if (original) {
                original.classList.add('selected-team-member');
                const clone = original.cloneNode(true);
                addedSuppliers.push(original.dataset.id);

                original._cloneRef = clone;

                addedSuppliersContainer.appendChild(clone);

                clone.addEventListener('click', function() {
                    addedSuppliersContainer.removeChild(clone);
                    original.classList.remove('selected-team-member');
                });
            }
        });
    }

    function updatePage() {
        if (page === 0) {
            formContainer.style.transform = `translateX(0%)`;
        } else {
            formContainer.style.transform = `translateX(calc(-${page * 100}% - ${page} * var(--big-gap)))`;
        }
    }

    function updateNavigationButtons() {
        backButton.disabled = page <= 0;
        nextButton.disabled = page >= MAX_PAGE;

        backButton.classList.toggle('disabled-button', backButton.disabled);
        backButton.classList.toggle('bg-button', !backButton.disabled);
        
        nextButton.classList.toggle('disabled-button', nextButton.disabled);
        nextButton.classList.toggle('fg-button', !nextButton.disabled);
        
        nextButton.classList.toggle('form-hidden-button', page >= MAX_PAGE);
    }

    submitButton.addEventListener('click', () => {
        
    });
    
    updateNavigationButtons();
    initializeAddedItems();
});