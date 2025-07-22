
const Team = require('../models/teams');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');


exports.getEditEventPage = async (req, res) => {
    try {

        const userId = req.session.user._id || req.session.user;
        const eventId = req.query.id;
        
        const team = await Team.findById(eventId).lean();
        const event = await Event.findById(eventId).lean(); 
        let isManager = false;
        let isProgramLead = false;

        if (String (team.manager) === String (userId) ) {
            isManager = true;
        }

        if (String (team.programLead) === String (userId) ) {
            isProgramLead = true;
        }

        const showButtons = isManager || isProgramLead

        const userIds = [
            team.manager,
            team.programLead,
            ...team.teamMemberList
        ];

        const users = await User.find({ _id: { $in: userIds } }).lean();

        res.render('editEvent', {
        user: req.session.user,
        layout: 'main',
        stylesheet: 'editEvent',
        script: 'editEvent',
        title: 'Edit Event',
        page: 'edit-event',
        clientName: `${event.clientFirstName} ${event.clientLastName}`,
        showButtons,
        teamMembers: users,
        team,
        event
    });

    }   catch (error) {
        console.error("Error opening event:", error);
        res.status(500).send("Internal server error");
    }
    
};