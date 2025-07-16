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
        searchNotifications(e.target.value.trim());
    });
});