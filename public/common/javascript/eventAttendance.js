document.addEventListener('DOMContentLoaded', () => {

    const eventId = window.eventId || new URLSearchParams(window.location.search).get('id');

    const teamAttendance = [];
    const supplierAttendance = [];


    const attendanceBoxes = document.querySelectorAll('.attendance-box');
    console.log("Found", attendanceBoxes.length, "attendance boxes");

    attendanceBoxes.forEach(box => {
       const presentBtn = box.querySelector('.present-button');
        const absentBtn = box.querySelector('.absent-button');

        if (!presentBtn || !absentBtn) {
            console.warn("Skipping box - missing buttons");
            return;
        }

    console.log("Binding click events to box:", box);
        const role = box.dataset.role;
        const index = parseInt(box.dataset.index, 10);

        presentBtn?.addEventListener('click', () => {
            console.log(`Clicked PRESENT for ${role} at index ${index}`);
            if (role === 'team') {
                teamAttendance[index] = 'present';
            } else if (role === 'supplier') {
                supplierAttendance[index] = 'present';
            }
            box.remove();
        });

        absentBtn?.addEventListener('click', () => {
            console.log(`Clicked ABSENT for ${role} at index ${index}`);
            if (role === 'team') {
                teamAttendance[index] = 'absent';
            } else if (role === 'supplier') {
                supplierAttendance[index] = 'absent';
            }
            box.remove();
        });
    });

    // Cancel button
    const cancelButton = document.getElementById('form-cancel-button');
    cancelButton?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `/event-details?id=${eventId}`;
    });

    // Submit attendance
    const doneButton = document.getElementById('submit-attendance');
    doneButton?.addEventListener('click', async (e) => {
        e.preventDefault();

        // Fill attendance arrays with nulls for unmarked people
        const maxTeamIndex = Math.max(-1, ...Object.keys(teamAttendance).map(Number));
        const maxSupplierIndex = Math.max(-1, ...Object.keys(supplierAttendance).map(Number));

        const finalTeamAttendance = Array.from({ length: maxTeamIndex + 1 }, (_, i) => teamAttendance[i] ?? null);
        const finalSupplierAttendance = Array.from({ length: maxSupplierIndex + 1 }, (_, i) => supplierAttendance[i] ?? null);

        console.log("📤 Submitting:", {
            eventID: eventId,
            teamAttendance: finalTeamAttendance,
            supplierAttendance: finalSupplierAttendance
        });

        try {
            const response = await fetch('/eventAttendance/finalize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventID: eventId,
                    teamAttendance: finalTeamAttendance,
                    supplierAttendance: finalSupplierAttendance
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
