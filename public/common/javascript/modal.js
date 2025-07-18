const modalContainer = document.getElementsByClassName('modal-container')[0];
const modal = document.getElementsByClassName('modal')[0];

export function cancel() {
    modalContainer.classList.remove('modal-container-hidden');
    modal.classList.remove('modal-hidden');
}

/**
 * Closes the modal and redirects if given a URL.
 * @param {string} redirect URL to redirect to after closing the modal. Nothing happens if left blank.
 */
export function closeModal(redirect = null) {
    modalContainer.classList.add('modal-container-hidden');
    modal.classList.add('modal-hidden');

    if (redirect !== null) {
        location.href = redirect;
    }
}
