import { closeModalButton, modalConfirmButton } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    // implement link to go back to profile page.
    closeModalButton(modalConfirmButton, `/profile/${currNumber}`);

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
    const mobileNumber = document.getElementById('mobileNumber');

    const phoneDescription = document.getElementById('phoneDescription');

    let firstNameFilled = false;
    let lastNameFilled = false;
    let mobileNumberFilled = false;

    firstName.addEventListener('input', () => {
        firstNameFilled = firstName.value !== '';
        updateEditDetailsButton();
    });
    
    lastName.addEventListener('input', () => {
        lastNameFilled = lastName.value !== '';
        updateEditDetailsButton();
    });
    
    mobileNumber.addEventListener('input', () => {
        mobileNumberFilled = mobileNumber.value.match(/^\d{11}$/);
        phoneDescription.classList.toggle('error-text', !mobileNumberFilled);
        updateEditDetailsButton();
    });

    function updateEditDetailsButton() {
        editDetailsButton.disabled = !(firstNameFilled && lastNameFilled && mobileNumberFilled);
        editDetailsButton.classList.toggle('disabled-button', editDetailsButton.disabled);
    }

    updateChangePassButton();
    updateEditDetailsButton();
});