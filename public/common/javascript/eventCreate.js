import { openModalButton, closeModalButton, modalConfirmButton } from './modal.js';

let page = 0;
const MAX_PAGE = 2;

document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('form-next-button');
    const backButton = document.getElementById('form-back-button');
    const submitButton = document.getElementById('form-submit-button');
    const formContainer = document.getElementsByClassName('form-page-container')[0];

    const eventName = document.getElementById('event-name');
    const clientFirstName = document.getElementById('client-first-name');
    const clientLastName = document.getElementById('client-last-name');
    const description = document.getElementById('event-description');
    const locationInput = document.getElementById('location');
    const contactFirstName = document.getElementById('contact-first-name');
    const contactLastName = document.getElementById('contact-last-name');
    const contactPhoneNumber = document.getElementById('phone-number');

    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    let startDate = new Date();
    let formattedStartDate = startDate.toISOString().split('T')[0];

    // set minimum date to today for both on page load.
    startDateInput.setAttribute('min', formattedStartDate);
    endDateInput.setAttribute('min', formattedStartDate);

    const membersContainer = document.getElementById('memberSearchResults');

    const addedMembersContainer = document.getElementById('addedMembers');
    let addedMembers = [];

    const suppliersContainer = document.getElementById('supplierSearchResults');

    const addedSuppliersContainer = document.getElementById('addedSuppliers');
    let addedSuppliers = [];

    nextButton.addEventListener('click', () => {
        if (page < MAX_PAGE) {
            page++;
            updatePage();
            updateNavigationButtons();
            updateSubmitButton();
        }
    });

    backButton.addEventListener('click', () => {
        if (page > 0) {
            page--;
            updatePage();
            updateNavigationButtons();
            updateSubmitButton();
        }
    });

    closeModalButton(modalConfirmButton, '/eventList');

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
        const valid = validatePage(page);
        nextButton.disabled = !valid;
        backButton.disabled = page <= 0;

        nextButton.classList.toggle('disabled-button', nextButton.disabled);
        nextButton.classList.toggle('form-hidden-button', page >= MAX_PAGE);
        nextButton.classList.toggle('fg-button', !nextButton.disabled);

        backButton.classList.toggle('disabled-button', backButton.disabled);
        backButton.classList.toggle('bg-button', !backButton.disabled);
    }

    function updateSubmitButton() {
        const showSubmit = page === MAX_PAGE;

        submitButton.disabled = !showSubmit;
        submitButton.classList.toggle('disabled-button', !showSubmit);
        submitButton.classList.toggle('form-hidden-button', !showSubmit);
        submitButton.classList.toggle('submit-button', showSubmit);
    }

    const validators = {
        0: () => pageInputs[0].every(input => input.value.trim() !== ''),
        1: () => true,
        2: () => true
    };

    const pageInputs = {
        0: [
            eventName, clientFirstName, clientLastName, description,
            locationInput, contactFirstName, contactLastName,
            contactPhoneNumber, startDateInput, endDateInput
        ]
    };

    function validatePage(page) {
        return validators[page]?.() ?? false;
    }

    Object.values(pageInputs).flat().forEach(input => {
        input.addEventListener('input', () => {
            updateNavigationButtons();
            updateSubmitButton();
        });
    });

    startDateInput.addEventListener('change', () => {
        startDate = startDateInput.value;
        endDateInput.setAttribute('min', startDate);
    });

    submitButton.addEventListener('click', () => {
        const membersInput = document.getElementById('added-members-input');
        const suppliersInput = document.getElementById('added-suppliers-input');

        membersInput.value = JSON.stringify(addedMembers);
        suppliersInput.value = JSON.stringify(addedSuppliers);
    });
});