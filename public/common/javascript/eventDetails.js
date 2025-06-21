document.addEventListener('DOMContentLoaded', function() {
    const eventData = JSON.parse(sessionStorage.getItem('currentEvent'));
    
    if (eventData) {
        document.getElementById('event-name').textContent = eventData.eventName;
        document.getElementById('client-name').textContent = eventData.clientName;
        document.getElementById('date').textContent = eventData.eventDate;
        document.getElementById('location').textContent = eventData.location;
        document.getElementById('description').textContent = eventData.description;
        document.getElementById('contact-name').textContent = 
            `${eventData.CPFirstName} ${eventData.CPLastName}`;
        document.getElementById('contact-info').textContent = eventData.CPContactNo;
        document.getElementById('status').textContent = eventData.status;

        const statusElement = document.getElementById('status');
        statusElement.setAttribute('data-status', eventData.status.toLowerCase());
    } else {
        window.location.href = '/eventList';
    }
});