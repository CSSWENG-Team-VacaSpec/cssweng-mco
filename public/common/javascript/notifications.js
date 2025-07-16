document.addEventListener('DOMContentLoaded', function() {
    let originalNotifs = getInitialEvents();
    const container = document.querySelector('.card-list');
    
    function debounce(fn, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    const searchNotifications = debounce(function(query) {
        if (!query) {
            renderNotifications(originalNotifs);
            return;
        }

        container.innerHTML = '<div class="search-loading">Searching notifications...</div>';

        fetch(`/searchNotifications?q=${encodeURIComponent(query)}`)
            .then(response => response.text())
            .then(data => {
                let notifs = JSON.parse(data);
                notifs = notifs.results;

                if (data.length === 0) {
                    container.innerHTML = `<p class="no-results"><i class="lni lni-emoji-sad"></i>No notifications found</p>`;
                } else {
                    renderNotifications(notifs);
                }
            })
            .catch(error => {
                console.error('Search failed:', error);
                renderNotifications(originalNotifs);
            });
    }, 300);

    function renderNotifications(notifs) {
        if (notifs.length === 0) {
            container.innerHTML = '<p class="no-results"><i class="lni lni-emoji-sad"></i>No notifications found</p>';
            return;
        }

        notifs.forEach(event => {
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
                            <span class="card-title">${event.eventName}</span>
                            <span id="client-name">${event.clientFirstName} ${event.clientLastName}</span>
                        </div>
                        <span id="status" data-status="${event.status}">${event.status}</span>
                    </div>
                    <div class="card-group">
                        <div class="card-description-item">
                            <i class="lni lni-calendar-days"></i>
                            <span id="date"> ${event.eventDate}</span>
                        </div>
                        <div class="card-description-item">
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
        searchNotifications(e.target.value.trim());
    });
});