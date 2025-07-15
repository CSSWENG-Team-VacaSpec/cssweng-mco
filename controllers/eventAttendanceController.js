const Team = require('../models/teams');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');

exports.getEventAttendancePage = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user;
        const eventId = req.query.id;

        const event = await Event.findById(eventId).lean();
        if (!event) return res.status(404).send("Event not found");

        const team = await Team.findById(eventId).lean();
        if (!team) return res.status(404).send("Team not found");

        const supplierUsers = await User.find({ _id: { $in: team.supplierList } }).lean();

        const supplierMap = Object.fromEntries(supplierUsers.map(u => [u._id, u]));

        let isManager = String(team.manager) === String(userId);
        let isProgramLead = String(team.programLead) === String(userId);

        const allTeamIds = [team.programLead, ...team.teamMemberList];
        const users = await User.find({ _id: { $in: allTeamIds } }).lean();

        const userMap = Object.fromEntries(users.map(u => [u._id, u]));

        const teamMembers = allTeamIds.map((id, idx) => ({
            ...userMap[id],
            attendance: team.teamMemberAttendance?.[idx],
            index: idx // used for JS syncing later
        }));

        const suppliers = team.supplierList.map((id, idx) => ({
            ...supplierMap[id],
            attendance: team.supplierAttendance?.[idx],
            index: idx // for frontend binding
        }));

        res.render('eventAttendance', {
            user: req.session.user,
            layout: 'main',
            stylesheet: 'eventAttendance',
            script: 'eventAttendance',
            title: 'Event Attendance',
            page: 'event-attendance',
            event,
            team,
            isManager,
            isProgramLead,
            teamMembers,
            suppliers
        });

    } catch (error) {
        console.error("Error opening event:", error);
        res.status(500).send("Internal server error");
    }
};

exports.finalizeAttendance = async (req, res) => {
    try {
        const { eventID, teamAttendance } = req.body;
        const team = await Team.findById(eventID);
        if (!team) return res.status(404).json({ ok: false, msg: 'Team not found' });

        team.teamMemberAttendance = teamAttendance;
        await team.save();
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false });
    }
};
