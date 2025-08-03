document.addEventListener('DOMContentLoaded', function() {
    const eventData = JSON.parse(sessionStorage.getItem('currentEvent'));

    if (eventData) {
        document.getElementById('status').textContent = eventData.status;

        const statusElement = document.getElementById('status');
        statusElement.setAttribute('data-status', eventData.status.toLowerCase());

        const modalContainer = document.getElementsByClassName('modal-container')[0];
        const modal = document.getElementsByClassName('modal')[0];
        const modalDeleteContainer = document.getElementById('modal-container-delete');
        const modalCancelContainer = document.getElementById('modal-container-cancel');
        const modalDelete = document.getElementById('modal-details-delete');
        const modalCancel = document.getElementById('modal-details-cancel');
        //const modalCloseButton = document.getElementById('cancel-modal-no-button');

        const modalConfirmCancelButton = document.getElementById('cancel-modal-yes-button');
        const modalConfirmDeleteButton = document.getElementById('delete-modal-yes-button');
        const modalDeleteCloseButton = document.querySelector('#modal-container-delete #cancel-modal-no-button');
        const modalCancelCloseButton = document.querySelector('#modal-container-cancel #cancel-modal-no-button');

        const deleteButton = document.getElementById('details-delete-button');
        const cancelButton = document.getElementById('cancel-button');
        const attendanceButton = document.getElementById('attendance-check-button');

        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                modalDeleteContainer.classList.remove('modal-container-hidden');
                modalDelete.classList.remove('modal-hidden');
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                modalCancelContainer.classList.remove('modal-container-hidden');
                modalCancel.classList.remove('modal-hidden');
            });
        }

        if (attendanceButton) {
            attendanceButton.addEventListener('click', () => {
                sessionStorage.setItem('currentEvent', JSON.stringify(eventData));
                window.location.href = `/eventAttendance?id=${eventData._id}`;
            });
        }

        modalDeleteCloseButton.addEventListener('click', () => {
            modalDeleteContainer.classList.add('modal-container-hidden');
            modalDelete.classList.add('modal-hidden');
        });

        modalCancelCloseButton.addEventListener('click', () => {
            modalCancelContainer.classList.add('modal-container-hidden');
            modalCancel.classList.add('modal-hidden');
        });

        modalConfirmCancelButton.addEventListener('click', () => {
            modalCancelContainer.classList.add('modal-container-hidden');
            modalCancel.classList.add('modal-hidden')
        });

        modalConfirmDeleteButton.addEventListener('click', () => {
            modalDeleteContainer.classList.add('modal-container-hidden');
            modalDelete.classList.add('modal-hidden')
        });

        const searchInput = document.getElementById('searchInput');
        const memberListContainer = document.querySelector('.team-mini-grid'); // or appropriate container

        function debounce(fn, delay) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn.apply(this, args), delay);
            };
        }

        async function fetchFilteredMembers(query) {
            const eventId = sessionStorage.getItem('currentEvent')
                ? JSON.parse(sessionStorage.getItem('currentEvent'))._id
                : null;

            if (!eventId || !query.trim()) return;

            try {
                const res = await fetch(`/searchEventParticipants?q=${encodeURIComponent(query)}&id=${eventId}`);
                const data = await res.json();

                memberListContainer.innerHTML = '';

                if (data.members.length === 0) {
                    memberListContainer.innerHTML = '<p>No matching team members found.</p>';
                } else {
                    data.members.forEach(member => {
                        const el = document.createElement('div');
                        el.className = 'team-member-mini-card';
                        el.setAttribute('data-id', member._id);
                        el.setAttribute('data-firstName', member.firstName);
                        el.setAttribute('data-lastName', member.lastName);
                        el.setAttribute('data-email', member.email);
                        el.setAttribute('data-role', member.role);

                        el.innerHTML = `
                            <div class="team-member-mini-picture" style="background-image: url('${member.pfp || ''}');"></div>
                            <span id="full-name">${member.firstName} ${member.lastName}</span>
                            <span id="role">${member.role}</span>
                            <i id="teamMiniAddButton" class="lni lni-plus"></i>
                            <i id="teamMiniRemoveButton" class="lni lni-xmark"></i>
                        `;
                        memberListContainer.appendChild(el);
                    });
                }
            } catch (err) {
                console.error('Search failed:', err);
            }
        }

        searchInput.addEventListener('input', debounce((e) => {
            fetchFilteredMembers(e.target.value);
        }, 300));

    } else {
        window.location.href = '/eventList';
    }

    // call browser history back function when clicking on the back link.
    const backLink = document.getElementById('backLink');
    backLink.addEventListener('click', () => {
        history.back();
    });
});