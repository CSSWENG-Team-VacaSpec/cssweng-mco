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
 * @param {boolean} back True if button should move user to previous page.
 */
function closeModal(redirect = null) {
    modalContainer.classList.add('modal-container-hidden');
    modal.classList.add('modal-hidden');

    if (redirect) {
        history.back()
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
 * @param {boolean} back True if modal should also move user back upon closing.
 */
export function closeModalButton(button, back) {
    button.addEventListener('click', () => {
        closeModal(back);
    });
}

openModalButton(pageBackButton);
closeModalButton(modalCloseButton);