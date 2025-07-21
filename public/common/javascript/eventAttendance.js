document.addEventListener('DOMContentLoaded', () => {
    const eventId = window.eventId || new URLSearchParams(window.location.search).get('id');

    const teamAttendance = {};
    const supplierAttendance = {};

    const attendanceBoxes = document.querySelectorAll('.attendance-box');
    console.log("Found", attendanceBoxes.length, "attendance boxes");

    attendanceBoxes.forEach(box => {
        const presentBtn = box.querySelector('.present-button');
        const absentBtn = box.querySelector('.absent-button');

        if (!presentBtn || !absentBtn) {
            console.warn("Skipping box - missing buttons");
            return;
        }

        const role = box.dataset.role;
        const index = parseInt(box.dataset.index, 10);

        // Restore previous selection (via pre-rendered "selected" class from HBS)

        presentBtn.addEventListener('click', () => {
            console.log(`Clicked PRESENT for ${role} at index ${index}`);
            
            presentBtn.classList.add('selected');
            absentBtn.classList.remove('selected');

            if (role === 'team') {
                teamAttendance[index] = 'present';
            } else if (role === 'supplier') {
                supplierAttendance[index] = 'present';
            }
        });

        absentBtn.addEventListener('click', () => {
            console.log(`Clicked ABSENT for ${role} at index ${index}`);
            
            absentBtn.classList.add('selected');
            presentBtn.classList.remove('selected');

            if (role === 'team') {
                teamAttendance[index] = 'absent';
            } else if (role === 'supplier') {
                supplierAttendance[index] = 'absent';
            }
        });
    });

    // Cancel button
    const cancelButton = document.getElementById('form-cancel-button');
    cancelButton?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `/event-details?id=${eventId}`;
    });

    // Done / Submit button
    const doneButton = document.getElementById('submit-attendance');
    doneButton?.addEventListener('click', async (e) => {
        e.preventDefault();

        console.log("📤 Submitting attendance:", {
            eventID: eventId,
            teamAttendance,
            supplierAttendance
        });

        try {
            const response = await fetch('/eventAttendance/finalize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventID: eventId,
                    teamAttendance,
                    supplierAttendance
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

    // Back button
    const pageBackButton = document.getElementById('page-back-button');
    pageBackButton?.addEventListener('click', () => {
        window.location.href = `/event-details?id=${eventId}`;
    });
});
