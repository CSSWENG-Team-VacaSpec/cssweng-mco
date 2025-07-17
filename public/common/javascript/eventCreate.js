let page = 0;
const MAX_PAGE = 2;

document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('form-next-button');
    const backButton = document.getElementById('form-back-button');
    const cancelButton = document.getElementById('form-cancel-button');
    const submitButton = document.getElementById('form-submit-button');
    const pageBackButton = document.getElementById('page-back-button');
    const formContainer = document.getElementsByClassName('form-page-container')[0];
    
    const modalContainer = document.getElementsByClassName('modal-container')[0];
    const modal = document.getElementsByClassName('modal')[0];
    const modalCloseButton = document.getElementById('cancel-modal-no-button');
    const modalConfirmButton = document.getElementById('cancel-modal-yes-button');

    const membersContainer = document.getElementById('memberSearchResults');
    let members = membersContainer ? membersContainer.getElementsByClassName('team-member-mini-card') : [];

    const addedMembersContainer = document.getElementById('addedMembers');
    let addedMembers = [];

    const suppliersContainer = document.getElementById('supplierSearchResults');
    let suppliers = suppliersContainer ? suppliersContainer.getElementsByClassName('team-member-mini-card') : [];

    const addedSuppliersContainer = document.getElementById('addedSuppliers');
    let addedSuppliers = [];

    nextButton.addEventListener('click', () => {
        if (page < MAX_PAGE) {
            page++;
            formContainer.style.transform = `translateX(-${page * 100}%)`;
        }
        updateButtons();
    });

    backButton.addEventListener('click', () => {
        if (page > 0) {
            page--;
            formContainer.style.transform = `translateX(-${page * 100}%)`;
        }
        updateButtons();
    });

    cancelButton.addEventListener('click', () => {
        cancelEventCreation();
    });

    pageBackButton.addEventListener('click', () => {
        cancelEventCreation();
    });

    modalCloseButton.addEventListener('click', () => {
        modalContainer.classList.add('modal-container-hidden');
        modal.classList.add('modal-hidden');
    });

    modalConfirmButton.addEventListener('click', () => {
        modalContainer.classList.add('modal-container-hidden');
        modal.classList.add('modal-hidden');
        location.href = '/eventlist';
    });

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

    function updateButtons() {
        submitButton.disabled = page < MAX_PAGE // TODO: frontend form validation.
        submitButton.classList.toggle('disabled-button', submitButton.disabled);
        submitButton.classList.toggle('form-hidden-button', submitButton.disabled);
        submitButton.classList.toggle('submit-button', !submitButton.disabled);

        nextButton.disabled = page >= MAX_PAGE;
        nextButton.classList.toggle('disabled-button', nextButton.disabled);
        nextButton.classList.toggle('form-hidden-button', nextButton.disabled);
        nextButton.classList.toggle('fg-button', !nextButton.disabled);

        backButton.disabled = page <= 0;
        backButton.classList.toggle('disabled-button', backButton.disabled);
        backButton.classList.toggle('bg-button', !backButton.disabled);
    }

    function cancelEventCreation() {
        modalContainer.classList.remove('modal-container-hidden');
        modal.classList.remove('modal-hidden');
    }

    submitButton.addEventListener('click', () => {
        const membersInput = document.getElementById('added-members-input');
        const suppliersInput = document.getElementById('added-suppliers-input');

        membersInput.value = JSON.stringify(addedMembers);
        suppliersInput.value = JSON.stringify(addedSuppliers);
    });
    
    updateButtons();
});