import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    closeModalButton(modalConfirmButton, true);
});

document.addEventListener('DOMContentLoaded', () => {
    const name = document.getElementById('name');
    const contactInfo = document.getElementById('contact-info');
    const description = document.getElementById('description');

    const submitButton = document.getElementById('form-submit-button');

    let validName = false;
    let validContactInfo = false;
    let validDescription = false;

    name.addEventListener('input', () => {
        validName = name !== '';
        updateSubmitButton();
    });

    contactInfo.addEventListener('input', () => {
        validContactInfo = contactInfo !== '';
        updateSubmitButton();
    });

    description.addEventListener('input', () => {
        validDescription = description !== '';
        updateSubmitButton();
    });

    function updateSubmitButton() {
        submitButton.disabled = !(validName && validContactInfo && validDescription);
        submitButton.classList.toggle('disabled-button', submitButton.disabled);
    }
});