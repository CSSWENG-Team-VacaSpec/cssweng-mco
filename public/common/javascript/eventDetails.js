document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventData = JSON.parse(sessionStorage.getItem('currentEvent'));
    const eventName = document.getElementById('event-name');
    const clientName = document.getElementById('client-name');
    const date = document.getElementById('date');
    const contactName = document.getElementById('contact-name');
    const contactInfo = document.getElementById('contact-info');
    const description = document.getElementById('description');

    if (description) {
        description.style.webkitLineClamp = 'unset';
        description.style.lineClamp = 'unset';
        description.style.overflow = 'visible';
        description.style.display = 'block';
    }

    if (eventData) {
        eventName.innerText = eventData.name;
        clientName.textContent = eventData.client;
        date.textContent = eventData.date;
        description.textContent = eventData.description;
    }
    else if (urlParams.has('name')) {
        eventName.textContent = decodeURIComponent(urlParams.get('name'));
        clientName.textContent = decodeURIComponent(urlParams.get('client'));
        date.textContent = decodeURIComponent(urlParams.get('date'));
    }
});