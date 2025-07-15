document.addEventListener('DOMContentLoaded', function() {
    const eventData = JSON.parse(sessionStorage.getItem('currentEvent'));

    const eventName = eventData?.eventName || document.getElementById('event-name').dataset.serverValue;
    const eventId = eventData?._id;
    
    if (eventName) {
        document.getElementById('event-name').textContent = eventName;

    } else {
        window.location.href = '/eventList';
    }

    const attendanceBoxes = document.querySelectorAll('.attendance-box');
    attendanceBoxes.forEach(box => {
        const presentBtn = box.querySelector('#present-button');
        const absentBtn = box.querySelector('#absent-button');

        presentBtn.addEventListener('click', function() {
            presentBtn.classList.remove('selected');
            absentBtn.classList.remove('selected');
            presentBtn.classList.add('selected');

            //add backend
        });

        absentBtn.addEventListener('click', function() {
            presentBtn.classList.remove('selected');
            absentBtn.classList.remove('selected');
            absentBtn.classList.add('selected');
            
            // add backend
        });
    });

    const modalContainer = document.getElementsByClassName('modal-container')[0];
    const modal = document.getElementsByClassName('modal')[0];
    const modalCloseButton = document.getElementById('cancel-modal-no-button');
    const modalConfirmButton = document.getElementById('cancel-modal-yes-button');
    const pageBackButton = document.getElementById('page-back-button');
    const cancelButton = document.getElementById('form-cancel-button');

    cancelButton.addEventListener('click', () => {
        cancelEventCreation();
    });

    pageBackButton.addEventListener('click', () => {
        cancelEventCreation();
    });

    modalCloseButton.addEventListener('click', () => {
        modalContainer.classList.add('modal-container-hidden');
        modal.classList.add('modal-hidden');
    });

    modalConfirmButton.addEventListener('click', () => {
        modalContainer.classList.add('modal-container-hidden');
        modal.classList.add('modal-hidden');
        //to go back to the event details of event id, i will fix
        //location.href = `/eventdetails?id=${eventData._id}`;
        this.location.href = '/eventlist';
    });

    function cancelEventCreation() {
        modalContainer.classList.remove('modal-container-hidden');
        modal.classList.remove('modal-hidden');
    }
});