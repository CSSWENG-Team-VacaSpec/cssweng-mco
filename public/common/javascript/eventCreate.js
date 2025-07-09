let page = 0;
const MAX_PAGE = 2;

document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('form-next-button');
    const backButton = document.getElementById('form-back-button');
    const cancelButton = document.getElementById('form-cancel-button');
    const pageBackButton = document.getElementById('page-back-button');
    const formContainer = document.getElementsByClassName('form-page-container')[0];
    
    const modalContainer = document.getElementsByClassName('modal-container')[0];
    const modal = document.getElementsByClassName('modal')[0];
    const modalCloseButton = document.getElementById('cancel-modal-no-button');
    const modalConfirmButton = document.getElementById('cancel-modal-yes-button');

    nextButton.addEventListener('click', () => {
        if (page < 2) {
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

    function updateButtons() {
        nextButton.disabled = page >= MAX_PAGE;
        nextButton.classList.toggle('disabled-button', nextButton.disabled);
        nextButton.classList.toggle('fg-button', !nextButton.disabled);

        backButton.disabled = page <= 0;
        backButton.classList.toggle('disabled-button', backButton.disabled);
        backButton.classList.toggle('bg-button', !backButton.disabled);
    }

    function cancelEventCreation() {
        modalContainer.classList.remove('modal-container-hidden');
        modal.classList.remove('modal-hidden');
    }

    updateButtons();
});