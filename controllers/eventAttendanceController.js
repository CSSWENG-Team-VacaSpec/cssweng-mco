const Team = require('../models/teams');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');

exports.getEventAttendancePage = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user;
        const eventId = req.query.id;
        
        const event = await Event.findById(eventId).lean();
        if (!event) {
            return res.status(404).send("Event not found");
        }

        const team = await Team.findById(eventId).lean();
        if (!team) {
            return res.status(404).send("team not found");
        }

        let isManager = false;
        let isProgramLead = false;

        if (String (team.manager) === String (userId) ) {
            isManager = true;
        }

        if (String (team.programLead) === String (userId) ) {
            isProgramLead = true;
        }

        const userIds = [
            team.manager,
            team.programLead,
            ...team.teamMemberList
        ];

        const users = await User.find({ _id: { $in: userIds } }).lean();

        res.render('eventAttendance', {
            user: req.session.user,
            layout: 'main',
            stylesheet: 'eventAttendance',
            script: 'eventAttendance',
            title: 'Event Attendance',
            page: 'event-attendance',
            event,
            team,
            teamMembers: users
        });

    } catch (error) {
        console.error("Error opening event:", error);
        res.status(500).send("Internal server error");
    }
};