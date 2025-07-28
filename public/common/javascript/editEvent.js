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

    addedMembers = Array.from(addedMembersContainer.querySelectorAll('.team-member-mini-card'))
        .map(el => el.dataset.id);

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

    if (membersContainer) {
        membersContainer.addEventListener('click', (event) => {
            const member = event.target.closest('.team-member-mini-card');
            if (!member) return;
            
            const memberId = member.dataset.id;
            const isSelected = member.classList.contains('selected-team-member');
            
            if (!isSelected) {
                const clone = member.cloneNode(true);
                addedMembers.push(memberId);
                member._cloneRef = clone;
                member.classList.add('selected-team-member');
                
                clone.addEventListener('click', () => {
                    addedMembersContainer.removeChild(clone);
                    member.classList.remove('selected-team-member');
                    addedMembers = addedMembers.filter(id => id !== memberId);
                });
                
                addedMembersContainer.appendChild(clone);
            } else {
                if (member._cloneRef && addedMembersContainer.contains(member._cloneRef)) {
                    addedMembersContainer.removeChild(member._cloneRef);
                    addedMembers = addedMembers.filter(id => id !== memberId);
                }
                member.classList.remove('selected-team-member');
                member._cloneRef = null;
            }
        });
    }

    function initializeAddedItems() {
        document.querySelectorAll('#addedMembers .team-member-mini-card').forEach(addedMember => {
            const memberId = addedMember.dataset.id;
            const originalMember = membersContainer.querySelector(`.team-member-mini-card[data-id="${memberId}"]`);
            if (originalMember) {
                originalMember.classList.add('selected-team-member');
                originalMember._cloneRef = addedMember;
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