document.addEventListener('DOMContentLoaded', () => {
    let error;
    try {
        error = document.querySelector('.error-container');
        error.classList.add('error-show');
    } catch (e) {

    }
});