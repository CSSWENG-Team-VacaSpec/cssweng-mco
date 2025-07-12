let page = 0;
const MAX_PAGE = 2;

document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('form-next-button');
    const backButton = document.getElementById('form-back-button');
    const cancelButton = document.getElementById('form-cancel-button');
    const pageBackButton = document.getElementById('page-back-button');
    const formContainer = document.getElementsByClassName('form-page-container')[0];
    
    const modalContainer = document.getElementsByClassName('modal-container')[0];
    const modal = document.getElementsByClassName('modal')[0];
    const modalCloseButton = document.getElementById('cancel-modal-no-button');
    const modalConfirmButton = document.getElementById('cancel-modal-yes-button');

    const membersContainer = document.getElementById('memberSearchResults');
    let members = membersContainer ? membersContainer.getElementsByClassName('team-member-mini-card') : [];

    const addedMembersContainer = document.getElementById('addedMembers');
    let addedMembers = [];

    nextButton.addEventListener('click', () => {
        if (page < 2) {
            page++;
            formContainer.style.transform = `translateX(-${page * 100}%)`;
        }
        updateButtons();
    });

    backButton.addEventListener('click', () => {
        if (page > 0) {
            page--;
            formContainer.style.transform = `translateX(-${page * 100}%)`;
        }
        updateButtons();
    });

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
        location.href = '/eventlist';
    });

    membersContainer.addEventListener('click', (event) => {
        const member = event.target.closest('.team-member-mini-card');
        console.log(member);

        const addedMember = `<button class="team-member-mini-card selected-team-member"
                                data-email="${member.dataset.email}"
                                data-bio="${member.dataset.bio}"
                                data-role="${member.dataset.role}"
                                data-id="${member.dataset.id}"
                                data-pfp="${member.dataset.pfp}"
                                data-firstName="${member.dataset.firstname}"
                                data-lastName="${member.dataset.lastname}"
                                type="button"
                            >
                                <div class="team-member-mini-picture" style="background-image: url('${member.dataset.pfp}');"></div>
                                <span id="full-name">${member.dataset.firstname} ${member.dataset.lastname}</span>
                                <span id="role">${member.dataset.role}</span>
                                <span id="contact-no">${member.dataset.id}</span>
                                <i class="lni lni-xmark"></i>
                            </button>`;

        addedMembersContainer.insertAdjacentHTML('beforeend', addedMember);
    });

    function updateButtons() {
        nextButton.disabled = page >= MAX_PAGE;
        nextButton.classList.toggle('disabled-button', nextButton.disabled);
        nextButton.classList.toggle('fg-button', !nextButton.disabled);

        backButton.disabled = page <= 0;
        backButton.classList.toggle('disabled-button', backButton.disabled);
        backButton.classList.toggle('bg-button', !backButton.disabled);
    }

    function cancelEventCreation() {
        modalContainer.classList.remove('modal-container-hidden');
        modal.classList.remove('modal-hidden');
    }

    updateButtons();
});