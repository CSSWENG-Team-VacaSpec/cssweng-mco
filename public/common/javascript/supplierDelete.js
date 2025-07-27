import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    closeModalButton(modalConfirmButton, '/teamList');

    const deleteButton = document.getElementById('deleteSuppliersButton');
    const suppliersContainer = document.getElementById('supplierSearchResults');
    const addedSuppliersContainer = document.getElementById('addedSuppliers');
    const form = deleteButton.closest('form');
    let addedSuppliers = [];

    suppliersContainer.addEventListener('click', (event) => {
        const supplier = event.target.closest('.team-member-mini-card');
        if (!supplier) return;

        let selected = supplier.classList.contains('selected-team-member');
        supplier.classList.toggle('selected-team-member', !selected);
        
        if (!selected) {
            const clone = supplier.cloneNode(true);
            addedSuppliers.push(supplier.dataset.id);
            supplier._cloneRef = clone;

            clone.addEventListener('click', function() {
                addedSuppliersContainer.removeChild(clone);
                supplier.classList.remove('selected-team-member');
                addedSuppliers = addedSuppliers.filter(id => id !== supplier.dataset.id);
            });

            addedSuppliersContainer.appendChild(clone);
        } else {
            if (supplier._cloneRef && addedSuppliersContainer.contains(supplier._cloneRef)) {
                addedSuppliersContainer.removeChild(supplier._cloneRef);
                addedSuppliers = addedSuppliers.filter(id => id !== supplier.dataset.id);
                supplier._cloneRef = null;
            }
        }

        deleteButton.disabled = addedSuppliers.length === 0;
        deleteButton.classList.toggle('disabled-button', deleteButton.disabled);
    });

    form.addEventListener('submit', (e) => {
        addedSuppliers.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'supplierIds';
            input.value = id;
            form.appendChild(input);
        });
    });
});