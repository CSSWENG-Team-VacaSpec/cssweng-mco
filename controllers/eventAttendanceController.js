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
            attendance: team.teamMemberAttendance?.[idx] ?? null,
            index: idx
        }));

        const suppliers = team.supplierList.map((id, idx) => ({
            ...supplierMap[id],
            attendance: team.supplierAttendance?.[idx] ?? null,
            index: idx
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
        const { eventID, teamAttendance, supplierAttendance } = req.body;
        const team = await Team.findById(eventID);
        if (!team) return res.status(404).json({ ok: false, msg: 'Team not found' });

        console.log("Received teamAttendance:", teamAttendance);
        console.log("Received supplierAttendance:", supplierAttendance);

        // Ensure arrays exist
        if (!team.teamMemberAttendance) team.teamMemberAttendance = [];
        if (!team.supplierAttendance) team.supplierAttendance = [];

        // Merge attendance updates by index
        Object.entries(teamAttendance || {}).forEach(([index, value]) => {
            team.teamMemberAttendance[Number(index)] = value;
        });

        Object.entries(supplierAttendance || {}).forEach(([index, value]) => {
            team.supplierAttendance[Number(index)] = value;
        });

        console.log("💾 Saving to DB:", {
            teamMemberAttendance: team.teamMemberAttendance,
            supplierAttendance: team.supplierAttendance
        });

        await team.save();
        res.json({ ok: true });
    } catch (err) {
        console.error("Error in finalizeAttendance:", err);
        res.status(500).json({ ok: false });
    }
};


