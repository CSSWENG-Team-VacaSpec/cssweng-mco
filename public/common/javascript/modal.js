const modalContainer = document.getElementsByClassName('modal-container')[0];
const modal = document.getElementsByClassName('modal')[0];
const pageBackButton = document.getElementById('page-back-button');
const modalCloseButton = document.getElementById('cancel-modal-no-button');
export const modalConfirmButton = document.getElementById('cancel-modal-yes-button');

/**
 * Opens the modal.
 */
function openModal() {
    modalContainer.classList.remove('modal-container-hidden');
    modal.classList.remove('modal-hidden');
}

/**
 * Closes the modal and redirects if given a URL.
 * @param {string} redirect URL to redirect to after closing the modal. Nothing happens if left blank.
 */
function closeModal(redirect = null) {
    modalContainer.classList.add('modal-container-hidden');
    modal.classList.add('modal-hidden');

    if (redirect !== null) {
        location.href = redirect;
    }
}

/**
 * Maps a button to open the modal.
 * @param {HTMLElement} button Button to map to open the modal.
 */
export function openModalButton(button) {
    button.addEventListener('click', () => {
        openModal();
    });
}

/**
 * 
 * @param {HTMLElement} button Button to map to close the modal.
 * @param {*} redirect URL to redirect to.
 */
export function closeModalButton(button, redirect) {
    button.addEventListener('click', () => {
        closeModal(redirect);
    });
}

openModalButton(pageBackButton);
closeModalButton(modalCloseButton);