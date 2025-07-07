
const Team = require('../models/teams');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');



exports.getEventDetailsPage = async (req, res) => {
    try {

        const userId = req.session.user._id || req.session.user;
        const eventId = req.query.id;
        
        const team = await Team.findById(eventId).lean();

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

        res.render('eventDetails', {
        user: req.session.user,
        layout: 'main',
        stylesheet: 'eventDetails',
        script: 'eventDetails',
        title: 'Event Details',
        page: 'event-details',
        showButtons,
        teamMembers: users,
        team
       

    });

    }   catch (error) {
        console.error("Error opening event:", error);
        res.status(500).send("Internal server error");
    }
    
};