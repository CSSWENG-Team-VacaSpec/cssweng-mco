let page = 0;
const MAX_PAGE = 2;

document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('form-next-button');
    const backButton = document.getElementById('form-back-button');
    const formContainer = document.getElementsByClassName('form-page-container')[0];


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

    function updateButtons() {
        nextButton.disabled = page >= MAX_PAGE;
        nextButton.classList.toggle('disabled-button', nextButton.disabled);
        nextButton.classList.toggle('fg-button', !nextButton.disabled);

        backButton.disabled = page <= 0;
        backButton.classList.toggle('disabled-button', backButton.disabled);
        backButton.classList.toggle('bg-button', !backButton.disabled);
    }

    updateButtons();
});