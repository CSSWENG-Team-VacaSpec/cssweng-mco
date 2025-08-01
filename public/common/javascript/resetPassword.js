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

    const errorContainer = document.getElementById('resetPasswordPage');
    const error = errorContainer?.dataset.error;

    if (error) {
        let message = '';
        switch (error) {
            case 'short':
                message = 'Password must be at least 8 characters.';
                break;
            case 'same':
                message = 'New password must not match the old password.';
                break;
            case 'notfound':
                message = 'User not found.';
                break;
            case 'server':
                message = 'Server error. Please try again later.';
                break;
        }

        if (message) alert(message);
    }

    
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