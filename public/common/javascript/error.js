document.addEventListener('DOMContentLoaded', () => {
    displayError();
});

function displayError(message="") {
    let error;
    const description = document.getElementById('errorDescription');

    if (description === null) {
        return;
    }
    
    // either display a specific message or display the one sent by backend.
    if (message !== "") {
        description.textContent = message;
    } else {
        if (description.textContent !== "") {
            error = document.querySelector('.error-container');
            error.classList.add('error-show');
        }
    }
}