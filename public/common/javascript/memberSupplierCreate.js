import { openModalButton, closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    const cancelButton = document.getElementById('form-cancel-button');

    openModalButton(cancelButton);
    closeModalButton(modalConfirmButton, '/teamList');
});