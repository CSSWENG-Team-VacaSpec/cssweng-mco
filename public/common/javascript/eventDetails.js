document.addEventListener('DOMContentLoaded', function() {
    const eventData = JSON.parse(sessionStorage.getItem('currentEvent'));
    
    if (eventData) {
        const eventId = eventData?._id
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

        deleteButton.addEventListener('click', () => {
            modalDeleteContainer.classList.remove('modal-container-hidden');
            modalDelete.classList.remove('modal-hidden');
        });

        cancelButton.addEventListener('click', () => {
            modalCancelContainer.classList.remove('modal-container-hidden');
            modalCancel.classList.remove('modal-hidden');
        });

        attendanceButton.addEventListener('click', () => {
            sessionStorage.setItem('currentEvent', JSON.stringify(eventData));
            window.location.href = `/eventAttendance?id=${eventData._id}`;
        });

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


    } else {
        window.location.href = '/eventList';
    }
});