import { closeModalButton, modalConfirmButton } from './modal.js';

let page = 0;
const MAX_PAGE = 2;

document.addEventListener('DOMContentLoaded', () => {

    const eventId = new URLSearchParams(window.location.search).get('id');
    document.getElementById('event-name').textContent = eventData.eventName;
    document.getElementById('client-name').textContent = eventData.clientName;
    document.getElementById('date').textContent = eventData.eventDate;
    document.getElementById('location').textContent = eventData.location;
    document.getElementById('description').textContent = eventData.description;
    document.getElementById('contact-name').textContent = 
        `${eventData.CPFirstName} ${eventData.CPLastName}`;
    document.getElementById('contact-info').textContent = eventData.CPContactNo;
    document.getElementById('status').textContent = eventData.status;

    const statusElement = document.getElementById('status');

    const nextButton = document.getElementById('form-next-button');
    const backButton = document.getElementById('form-back-button');
    const submitButton = document.getElementById('form-submit-button');
    const formContainer = document.getElementsByClassName('form-page-container')[0];

    const membersContainer = document.getElementById('memberSearchResults');
    let members = membersContainer ? membersContainer.getElementsByClassName('team-member-mini-card') : [];

    const addedMembersContainer = document.getElementById('addedMembers');
    let addedMembers = [];

    const suppliersContainer = document.getElementById('supplierSearchResults');
    let suppliers = suppliersContainer ? suppliersContainer.getElementsByClassName('team-member-mini-card') : [];

    const addedSuppliersContainer = document.getElementById('addedSuppliers');
    let addedSuppliers = [];

    const statusDropdown = document.getElementById('status-dropdown');
    let statusDropdownOpen = false;

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#status-dropdown')) {
            statusDropdownOpen = false;
        }
        updateDropdowns();
    });

    statusDropdown.addEventListener('click', () => {
        statusDropdownOpen = !statusDropdownOpen;
        updateDropdowns();
    });

    function updateDropdowns(){
        statusDropdown.classList.toggle('dropdown-open', statusDropdownOpen);
    }

    nextButton.addEventListener('click', () => {
        if (page < MAX_PAGE) {
            page++;
            updatePage();
            updateNavigationButtons();
            //updateSubmitButton();
        }
    });

    backButton.addEventListener('click', () => {
        if (page > 0) {
            page--;
            updatePage();
            updateNavigationButtons();
            //updateSubmitButton();
        }
    });

    closeModalButton(modalConfirmButton, '/event-details?id=${eventId}');
    
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
                addedMembersContainer.removeChild(clone);
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
        const membersInput = document.getElementById('added-members-input');
        const suppliersInput = document.getElementById('added-suppliers-input');

        membersInput.value = JSON.stringify(addedMembers);
        suppliersInput.value = JSON.stringify(addedSuppliers);
    });
    
    updateNavigationButtons();
});