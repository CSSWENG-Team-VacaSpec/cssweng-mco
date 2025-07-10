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
        window.location.href = `/event-details?id=${eventData._id}`;
    });

    function getInitialEvents() {
        const eventElements = document.querySelectorAll('.event-box.container');
        return Array.from(eventElements).map(el => ({
            _id: el.dataset.id,
            eventName: el.querySelector('#event-name').textContent,
            clientFirstName: el.querySelector('#client-name').textContent.split(' ')[0],
            clientLastName: el.querySelector('#client-name').textContent.split(' ')[1] || '',
            eventDate: el.querySelector('#date').textContent,
            location: el.querySelector('#location').textContent,
            description: el.querySelector('#description').textContent,
            status: el.querySelector('#status').dataset.status,
            CPFirstName: el.dataset.cpFirstName,
            CPLastName: el.dataset.cpLastName,
            CPContactNo: el.dataset.cpContactNo
        }));
    }

    let originalEvents = getInitialEvents();
    const container = document.querySelector('.upcoming-events-container');
    const noEventsMsg = document.querySelector('.no-events-message');
    
    document.getElementById('eventSearchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('eventSearchInput').value.trim();
        searchEvents(query);
    });

    function debounce(fn, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    const searchEvents = debounce(function(query) {
        if (!query) {
            renderEvents(originalEvents);
            return;
        }

        container.innerHTML = '<div class="search-loading">Searching events...</div>';

        fetch(`/api/events/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    container.innerHTML = '<p class="no-results">No matching events found</p>';
                } else {
                    renderEvents(data);
                }
            })
            .catch(error => {
                console.error('Search failed:', error);
                renderEvents(originalEvents);
            });
    }, 300);

    function renderEvents(events) {
        if (events.length === 0) {
            container.innerHTML = '<p class="no-events-message">No events found</p>';
            return;
        }

        container.innerHTML = '';
        events.forEach(event => {
            const eventElement = document.createElement('div');
            container.appendChild(eventElement);
            
            eventElement.outerHTML = `
                <div class="event-box container"
                    data-id="${event._id}"
                    data-cp-first-name="${event.CPFirstName}"
                    data-cp-last-name="${event.CPLastName}"
                    data-cp-contact-no="${event.CPContactNo}"
                >
                    <div class="event-box-top">
                        <span id="event-name">${event.eventName}</span>
                        <span id="client-name">${event.clientFirstName} ${event.clientLastName}</span>
                    </div>
                    <div class="event-box-bottom">
                        <span id="date">${event.eventDate}</span>
                        <span id="location">${event.location}</span>
                        <span><strong>Description</strong></span>
                        <span id="description">${event.description || 'No description'}</span>
                        <span id="status" data-status="${event.status}"><strong>● Status:</strong> ${event.status}</span>
                    </div>
                </div>
            `;
        });
    }

    document.getElementById('eventSearchInput').addEventListener('input', (e) => {
        searchEvents(e.target.value.trim());
    });
});