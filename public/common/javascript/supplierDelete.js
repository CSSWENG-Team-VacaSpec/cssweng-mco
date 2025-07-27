import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    closeModalButton(modalConfirmButton, '/teamList');

    const deleteButton = document.getElementById('deleteSuppliersButton');
    const suppliersContainer = document.getElementById('supplierSearchResults');
    const addedSuppliersContainer = document.getElementById('addedSuppliers');
    let addedSuppliers = [];

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
        
        deleteButton.disabled = addedSuppliers.length === 0;
        deleteButton.classList.toggle('disabled-button', deleteButton.disabled);
    });
});