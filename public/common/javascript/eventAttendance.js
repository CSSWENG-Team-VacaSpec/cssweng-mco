document.addEventListener('DOMContentLoaded', () => {
    const eventId = window.eventId || new URLSearchParams(window.location.search).get('id');
    const MAX_PAGE = 1;
    let page = 0;

    const teamAttendance = {};
    const supplierAttendance = {};

    const nextButton = document.getElementById('form-next-button');
    const backButton = document.getElementById('form-back-button');
    const submitButton = document.getElementById('submit-attendance');
    const formContainer = document.querySelector('.event-attendance.card');
    const attendanceForms = document.querySelectorAll('.attendance-form');

    // Initialize page visibility
    updatePage();

    nextButton.addEventListener('click', () => {
        if (page < MAX_PAGE) {
            page++;
            updatePage();
            updateNavigationButtons();
        }
    });

    backButton.addEventListener('click', () => {
        if (page > 0) {
            page--;
            updatePage();
            updateNavigationButtons();
        }
    });

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
        history.back();
    });

    function updatePage() {
        if (page === 0) {
            formContainer.style.transform = `translateX(0%)`;
        } else {
            formContainer.style.transform = `translateX(calc(-${page * -0.5}% - ${page} * var(--big-gap)))`;
        }

        attendanceForms.forEach(form => {
            form.style.display = 'none';
        });

        const currentForm = document.querySelector(`.attendance-form[data-page="${page}"]`);
        if (currentForm) {
            currentForm.style.display = 'block';
        }

        submitButton.style.display = page === MAX_PAGE ? 'block' : 'none';
        nextButton.style.display = page === MAX_PAGE ? 'none' : 'block';
    }

    function updateNavigationButtons() {
        backButton.disabled = page === 0;
        nextButton.disabled = page === MAX_PAGE;

        backButton.classList.toggle('disabled-button', backButton.disabled);
        nextButton.classList.toggle('disabled-button', nextButton.disabled);
    }
});
