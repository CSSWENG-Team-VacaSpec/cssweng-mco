document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.upcoming-events-container').addEventListener('click', function(e) {
        const eventBox = e.target.closest('.event-box');
        if (!eventBox) return;

        const eventData = {
            _id: eventBox.dataset.id,
            eventName: eventBox.querySelector('#event-name').textContent,
            clientName: eventBox.querySelector('#client-name').textContent,
            eventDate: eventBox.querySelector('#date').textContent,
            description: eventBox.querySelector('#description').textContent,
            location: eventBox.querySelector('#location').textContent,
            status: eventBox.querySelector('#status').textContent,
            CPContactNo: eventBox.dataset.cpContactNo,
            CPLastName: eventBox.dataset.cpLastName,
            CPFirstName: eventBox.dataset.cpFirstName,
            companyName: eventBox.dataset.companyName
        };

        sessionStorage.setItem('currentEvent', JSON.stringify(eventData));
        window.location.href = `/eventDetails?id=${eventData._id}`;
    });
});