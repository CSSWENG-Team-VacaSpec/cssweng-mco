document.addEventListener('DOMContentLoaded', () => {
    const eventId = window.eventId || new URLSearchParams(window.location.search).get('id');
    const attendanceStatus = [];

    console.log('Event ID from URL:', eventId);

    // Highlight buttons on click
    const attendanceBoxes = document.querySelectorAll('.attendance-box');
    attendanceBoxes.forEach((box, idx) => {
        const presentBtn = box.querySelector('.present-button');
        const absentBtn = box.querySelector('.absent-button');

        presentBtn.addEventListener('click', () => {
            presentBtn.classList.add('selected');
            absentBtn.classList.remove('selected');
            attendanceStatus[idx] = 'present';
        });

        absentBtn.addEventListener('click', () => {
            absentBtn.classList.add('selected');
            presentBtn.classList.remove('selected');
            attendanceStatus[idx] = 'absent';
        });
    });

    // Cancel button
    const cancelButton = document.getElementById('form-cancel-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `/event-details?id=${eventId}`;
        });
    }

    // Done button
    const doneButton = document.getElementById('submit-attendance');
    if (doneButton) {
        doneButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const finalizedAttendance = attendanceBoxes.length === 0
                ? []
                : Array.from({ length: attendanceBoxes.length }).map((_, i) => attendanceStatus[i] || 'absent');

            try {
                const response = await fetch('/eventAttendance/finalize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        eventID: eventId,
                        teamAttendance: finalizedAttendance
                    })
                });

                const result = await response.json();
                if (result.ok) {
                    alert('Attendance saved!');
                    window.location.href = `/event-details?id=${eventId}`;
                } else {
                    alert('Failed to save attendance');
                }
            } catch (err) {
                console.error('Error submitting attendance:', err);
                alert('Error submitting attendance');
            }
        });
    }

    // Back button (optional)
    const pageBackButton = document.getElementById('page-back-button');
    if (pageBackButton) {
        pageBackButton.addEventListener('click', () => {
            window.location.href = `/event-details?id=${eventId}`;
        });
    }
});
