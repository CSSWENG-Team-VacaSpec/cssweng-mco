import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    closeModalButton(modalConfirmButton, true);
});

document.addEventListener('DOMContentLoaded', () => {
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const mobileNumber = document.getElementById('mobile-number');
    const password = document.getElementById('password');

    const submitButton = document.getElementById('form-submit-button');

    let validFirstName = false;
    let validLastName = false;
    let validNumber = false;
    let validPassword = false;

    const validPhoneNumberPattern = /^\d{4} ?\d{3} ?\d{4}|\+\d{2} ?\d{3} ?\d{3} ?\d{4}$/;

    firstName.addEventListener('input', () => {
        validFirstName = firstName !== '';
        updateSubmitButton();
    });
    
    lastName.addEventListener('input', () => {
        validLastName = lastName !== '';
        updateSubmitButton();
    });
    
    mobileNumber.addEventListener('input', () => {
        validNumber = mobileNumber.value.match(validPhoneNumberPattern);
        updateSubmitButton();
    });

    password.addEventListener('input', () => {
        validPassword = password.value.length >= 8;
        updateSubmitButton();
    });

    function updateSubmitButton() {
        submitButton.disabled = !(validFirstName && validLastName && validNumber && validPassword);
        submitButton.classList.toggle('disabled-button', submitButton.disabled);
    }
});