document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.card-list').addEventListener('click', function(e) {
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

    function getInProgressContainer() {
        return document.querySelector('#search-progress-container').content.cloneNode(true);
    }

    function getNoResultsContainer() {
        return document.querySelector('#no-results-container').content.cloneNode(true);
    }

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
    const container = document.querySelector('.card-list');
    
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

    const searchEvents = debounce(function (query) {
        container.innerHTML = '<div class="search-loading">Searching events...</div>';

        const url = query
            ? `/searchEvents?q=${encodeURIComponent(query)}&scope=upcoming` 
            : `/searchEvents?scope=upcoming`; // or `past`

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const events = data.results;
                if (!events || events.length === 0) {
                    container.innerHTML = `
                        <div class="no-results-container">
                            <i class="lni lni-emoji-sad"></i>
                            <p class="no-results-message">No results found</p>
                        </div>
                    `;
                } else {
                    renderEvents(events);
                }
            })
            .catch(err => {
                console.error('Search failed:', err);
                container.innerHTML = '<p class="error-message">Failed to fetch events.</p>';
            });
    }, 300);


    function renderEvents(events) {
        if (events.length === 0) {
            container.innerHTML = '';
            container.appendChild(getNoResultsContainer());
            return;
        }

        container.innerHTML = '';
        events.forEach(event => {
            const eventElement = document.createElement('div');
            container.appendChild(eventElement);
            
            eventElement.outerHTML = `
                <div class="event-box card"
                    data-id="${event._id}"
                    data-cp-first-name="${event.CPFirstName}"
                    data-cp-last-name="${event.CPLastName}"
                    data-cp-contact-no="${event.CPContactNo}"
                >
                    <div class="event-box-top">
                        <div class="main-event-info">
                            <span id="event-name" class="card-title">${event.eventName}</span>
                            <span id="client-name">${event.clientFirstName} ${event.clientLastName}</span>
                        </div>
                        <span id="status" data-status="${event.status}">${event.status}</span>
                    </div>
                    <div class="card-group">
                        <div class="card-description-item card-secondary">
                            <i class="lni lni-calendar-days"></i>
                            <span id="date"> ${event.eventDate}</span>
                        </div>
                        <div class="card-description-item card-secondary">
                            <i class="lni lni-map-pin-5"></i>
                            <span id="location">${event.location}</span>
                        </div>
                    </div>
                    
                    <div class="card-group">
                        <div class="card-description-item">
                            <i class="lni lni-pen-to-square"></i>
                            <span id="description">${event.description || 'No description'}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    document.getElementById('eventSearchInput').addEventListener('input', (e) => {
        searchEvents(e.target.value.trim());
    });
});