import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    // implement link to go back to profile page.
    closeModalButton(modalConfirmButton, true);

    // form buttons
    const changePasswordButton = document.getElementById('changePasswordButton');

    // password fields
    const newPassword = document.getElementById('newPassword');

    // description label that tells the user that the new password must contain
    // at least 8 chars and not match the old one.
    const passwordLengthDescription = document.getElementById('passLengthCheck');

    let validNewPassword = false;
    
    newPassword.addEventListener('input', () => {
        validNewPassword = newPassword.value.length >= 8;
        passwordLengthDescription.classList.toggle('error-text', !validNewPassword);
        updateChangePassButton();
    });

    function updateChangePassButton() {
        changePasswordButton.disabled = !validNewPassword;
        changePasswordButton.classList.toggle('disabled-button', changePasswordButton.disabled);
    }

    updateChangePassButton();
});