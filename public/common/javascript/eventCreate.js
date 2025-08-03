import { closeModalButton, modalConfirmButton } from './modal.js';

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
    const memberSearchInput = document.getElementById('memberSearchInput');
    const supplierSearchInput = document.getElementById('supplierSearchInput');

    // needed for ios.
    function getLocalDateString(date) {
        const offset = date.getTimezoneOffset();
        const local = new Date(date.getTime() - (offset * 60000));
        return local.toISOString().split('T')[0];
    }

    let startDate = new Date();
    
    let formattedStartDate = getLocalDateString(new Date());

    // set minimum date to today for both on page load.
    startDateInput.setAttribute('min', formattedStartDate);
    endDateInput.setAttribute('min', formattedStartDate);

    const membersContainer = document.getElementById('memberSearchResults');

    const addedMembersContainer = document.getElementById('addedMembers');
    let addedMembers = [];

    const suppliersContainer = document.getElementById('supplierSearchResults');

    const addedSuppliersContainer = document.getElementById('addedSuppliers');
    let addedSuppliers = [];

//     function debounce(fn, delay) {
//     let timeout;
//     return function (...args) {
//         clearTimeout(timeout);
//         timeout = setTimeout(() => fn.apply(this, args), delay);
//     };
// }
//     async function fetchFilteredMembers(query) {
//         const eventId = sessionStorage.getItem('currentEvent')
//             ? JSON.parse(sessionStorage.getItem('currentEvent'))._id
//             : null;

//         if (!eventId || !query.trim()) return;

//         try {
//             const res = await fetch(`/searchEmployees?q=${encodeURIComponent(query)}`);
//             const data = await res.json();

//             membersContainer.innerHTML = '';

//             if (data.members.length === 0) {
//                 membersContainer.innerHTML = '<p>No matching members found.</p>';
//             } else {
//                 data.members.forEach(member => {
//                     if (addedMembers.includes(member._id)) return;

//                     const el = document.createElement('div');
//                     el.className = 'team-member-mini-card';
//                     el.setAttribute('data-id', member._id);
//                     el.setAttribute('data-firstName', member.firstName);
//                     el.setAttribute('data-lastName', member.lastName);
//                     el.setAttribute('data-email', member.email);
//                     el.setAttribute('data-role', member.role);
//                     el.setAttribute('data-pfp', member.pfp || '');
//                     el.setAttribute('data-status', member.status || '');

//                     el.innerHTML = `
//                         <div class="team-member-mini-picture" style="background-image: url('${member.pfp || ''}');"></div>
//                         <span id="full-name">${member.firstName} ${member.lastName}</span>
//                         <span id="role">${member.role}</span>
//                         <i id="teamMiniAddButton" class="lni lni-plus"></i>
//                         <i id="teamMiniRemoveButton" class="lni lni-xmark"></i>
//                     `;

//                     membersContainer.appendChild(el);
//                 });
//             }
//         } catch (err) {
//             console.error('Member search failed:', err);
//         }
//     }

//     async function fetchFilteredSuppliers(query) {
//         const eventId = sessionStorage.getItem('currentEvent')
//             ? JSON.parse(sessionStorage.getItem('currentEvent'))._id
//             : null;

//         if (!eventId || !query.trim()) return;

//         try {
//             const res = await fetch(`/search/suppliers?q=${encodeURIComponent(query)}`);
//             const data = await res.json();

//             suppliersContainer.innerHTML = '';

//             if (data.suppliers.length === 0) {
//                 suppliersContainer.innerHTML = '<p>No matching suppliers found.</p>';
//             } else {
//                 data.suppliers.forEach(supplier => {
//                     if (addedSuppliers.includes(supplier._id)) return;

//                     const el = document.createElement('button');
//                     el.className = 'team-member-mini-card';
//                     el.setAttribute('data-id', supplier._id);
//                     el.setAttribute('data-company', supplier.companyName);
//                     el.setAttribute('data-status', supplier.status || '');
//                     el.setAttribute('type', 'button');

//                     el.innerHTML = `
//                         <span id="full-name">${supplier.companyName}</span>
//                         <i id="teamMiniAddButton" class="lni lni-plus"></i>
//                         <i id="teamMiniRemoveButton" class="lni lni-xmark"></i>
//                     `;

//                     suppliersContainer.appendChild(el);
//                 });
//             }
//         } catch (err) {
//             console.error('Supplier search failed:', err);
//         }
//     }


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

    closeModalButton(modalConfirmButton, true);

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

        updateNavigationButtons();
        updateSubmitButton();
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
        updateNavigationButtons();
        updateSubmitButton();
    });

    function updatePage() {
        if (page === 0) {
            formContainer.style.transform = `translateX(0%)`;
        } else {
            formContainer.style.transform = `translateX(calc(-${page * 100}% - ${page} * var(--big-gap)))`;
        }

        const pages = document.querySelectorAll('.form-page');
        pages.forEach((p, index) => {
            const isActive = index === page;
            
            // Enable or disable tabbing for inputs in each page
            const focusable = p.querySelectorAll('input, select, textarea, button, [tabindex]');
            focusable.forEach(el => {
                el.tabIndex = isActive ? 0 : -1;
            });
        });
    }

    const form = document.querySelector('.form');

    form.addEventListener('keydown', (e) => {
        const isEnter = e.key === 'Enter';
        const isTextInput = ['input', 'textarea'].includes(e.target.tagName) &&
                            e.target.type !== 'textarea'; // allow enter in textarea

        if (isEnter && isTextInput) {
            e.preventDefault(); // block enter key from submitting
        }
    });


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

    const validPhoneNumber = /^\d{4} ?\d{3} ?\d{4}|\+\d{2} ?\d{3} ?\d{3} ?\d{4}$/;

    const validators = {
        0: () => pageInputs[0].every(input => input.value.trim() !== '') &&
                 pageInputs[0][7].value.match(validPhoneNumber), // check for valid phone number.
        1: () => addedMembers.length > 0,
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
        input.addEventListener('input', (e) => {
            e.preventDefault();
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

    memberSearchInput.addEventListener('input', debounce((e) => {
        fetchFilteredMembers(e.target.value);
    }, 300));

    supplierSearchInput.addEventListener('input', debounce((e) => {
        fetchFilteredSuppliers(e.target.value);
    }, 300));


    updatePage();
});