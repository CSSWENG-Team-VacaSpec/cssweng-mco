import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    // implement link to go back to profile page.
    closeModalButton(modalConfirmButton, true);

    // form buttons
    const changePasswordButton = document.getElementById('changePasswordButton');

    // password fields
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const reenterNewPassword = document.getElementById('reenterNewPassword');

    // description label that tells the user to match the passwords.
    const matchPasswordDescription = document.getElementById('matchPassDesc')

    // description label that tells the user that the new password must contain
    // at least 8 chars and not match the old one.
    const passwordLengthDescription = document.getElementById('passLengthCheck');

    let validCurrentPassword = false;
    let validNewPassword = false;
    let matchNewPassword = false;

    // validate password input.
    currentPassword.addEventListener('input', () => {
        validCurrentPassword = currentPassword.value.length >= 8;
        updateChangePassButton();
    });
    
    newPassword.addEventListener('input', () => {
        validNewPassword = newPassword.value.length >= 8 && (newPassword.value !== currentPassword.value);
        passwordLengthDescription.classList.toggle('error-text', !validNewPassword);
        updateChangePassButton();
    });
    
    reenterNewPassword.addEventListener('input', () => {
        matchNewPassword = newPassword.value === reenterNewPassword.value;
        matchPasswordDescription.classList.toggle('error-text', !matchNewPassword);
        updateChangePassButton();
    });

    function updateChangePassButton() {
        changePasswordButton.disabled = !(validCurrentPassword && validNewPassword && matchNewPassword);
        changePasswordButton.classList.toggle('disabled-button', changePasswordButton.disabled);
    }

    // validate profile details.
    const editDetailsButton = document.getElementById('editDetailsButton');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');

    let firstNameFilled = false;
    let lastNameFilled = false;
    let mobileNumberFilled = false;

    firstName.addEventListener('input', () => {
        firstNameFilled = firstName.value !== '';
        firstName.classList.toggle('error-field', !firstNameFilled);
        updateEditDetailsButton();
    });
    
    lastName.addEventListener('input', () => {
        lastNameFilled = lastName.value !== '';
        lastName.classList.toggle('error-field', !lastNameFilled);
        updateEditDetailsButton();
    });
    function updateEditDetailsButton() {
        editDetailsButton.disabled = !(firstNameFilled && lastNameFilled);
        editDetailsButton.classList.toggle('disabled-button', editDetailsButton.disabled);
    }

    function initializeInputStates() {
        firstNameFilled = firstName.value.trim() !== '';
        firstName.classList.toggle('error-field', !firstNameFilled);

        lastNameFilled = lastName.value.trim() !== '';
        lastName.classList.toggle('error-field', !lastNameFilled);
    }

    // check that profile picture is uploaded.
    const pfpUpload = document.getElementById('pfpUpload');
    const editPfpButton = document.getElementById('editPfpButton');

    pfpUpload.addEventListener('input', () => {
        editPfpButton.classList.toggle('disabled-button', pfpUpload.value === '');
    })

    initializeInputStates();
    updateChangePassButton();
    updateEditDetailsButton();
});