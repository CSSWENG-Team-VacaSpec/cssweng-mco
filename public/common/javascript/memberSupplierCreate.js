import { openModalButton, closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    closeModalButton(modalConfirmButton, true);
});