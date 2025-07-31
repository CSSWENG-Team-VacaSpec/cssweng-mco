// Back button
document.addEventListener('DOMContentLoaded', () => {
    const pageBackButton = document.getElementById('page-back-button');
    pageBackButton?.addEventListener('click', () => {
        history.back();
    });
});