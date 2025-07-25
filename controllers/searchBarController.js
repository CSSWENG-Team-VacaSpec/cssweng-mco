const EmployeeAccount = require('../models/employeeAccounts');
const searchEmployees = require('../utils/searchEmployees');
const searchEvents = require('../utils/searchEvents');
const Team = require('../models/teams');
const Events = require('../models/events');


// This function handles the search request for employees
exports.searchEmployees = async (req, res) => {
  try {
    const query = req.query.q || '';

    // fetch all active employees
    const employees = await EmployeeAccount.find({ status: 'active' }).lean();

    // search employees using the search utility
    const results = searchEmployees(employees, query);

    return res.status(200).json({ results });
    
  } catch (error) {
    console.error('Employee search failed:', error);
    return res.status(500).json({ error: 'Server error during employee search' });
  }
};

exports.searchTeamMembers= async (req, res) => {
  try {
    const query = req.query.q || '';
    const eventId = req.query.id;

    const team = await Team.findById(eventId).lean();
     if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // fetch all team members
     const teamMembers = [
            team.manager,
            team.programLead,
            ...team.teamMemberList
        ];

      const members = await EmployeeAccount.find({ _id: { $in: teamMembers } }).lean();

    // search team member using the search utility
    const results = searchEmployees(members, query);
 
    return res.status(200).json({ results });
    
  } catch (error) {
    console.error('Employee search failed:', error);
    return res.status(500).json({ error: 'Server error during member search' });
  }
};

exports.searchEvents = async (req, res) => {
  try {
    const query = req.query.q?.trim() || '';
    const scope = req.query.scope;
    const userId = req.session.user._id || req.session.user;

    const teams = await Team.find({
      $or: [
        { manager: userId },
        { programLead: userId },
        { teamMemberList: userId }
      ]
    });

    if (!teams || teams.length === 0) {
      return res.status(200).json({ results: [] });
    }

    const teamIds = teams.map(team => team._id);
    let userEvents = await Events.find({ _id: { $in: teamIds } }).lean();

    // 💡 Add this:
    if (scope === 'past') {
      userEvents = userEvents.filter(e => ['completed', 'cancelled'].includes(e.status));
    } else if (scope === 'upcoming') {
      userEvents = userEvents.filter(e => ['planning', 'in progress', 'postponed'].includes(e.status));
    }

    const results = query
      ? searchEvents(userEvents, query, scope)
      : userEvents;

    return res.status(200).json({ results });

  } catch (error) {
    console.error('Event search failed:', error);
    return res.status(500).json({ error: 'Server error during event search' });
  }
};
