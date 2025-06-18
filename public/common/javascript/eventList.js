document.addEventListener('DOMContentLoaded', function() {
    const eventBoxes = document.querySelectorAll('.event-box');

    eventBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const eventName = this.querySelector('#event-name').textContent;
            const clientName = this.querySelector('#client-name').textContent;
            const date = this.querySelector('#date').textContent;
            const description = this.querySelector('#description').textContent;

            window.location.href = `/eventDetails?name=${encodeURIComponent(eventName)}&client=${encodeURIComponent(clientName)}&date=${encodeURIComponent(date)}`;

            sessionStorage.setItem('currentEvent', JSON.stringify({
                name: eventName,
                client: clientName,
                date: date,
                description: description
            }));
            window.location.href = '/eventDetails';
        });
    });
});