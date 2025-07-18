const modalContainer = document.getElementsByClassName('modal-container')[0];
const modal = document.getElementsByClassName('modal')[0];

export function cancel() {
    modalContainer.classList.remove('modal-container-hidden');
    modal.classList.remove('modal-hidden');
}

export function closeModal() {
    modalContainer.classList.add('modal-container-hidden');
    modal.classList.add('modal-hidden');
}
