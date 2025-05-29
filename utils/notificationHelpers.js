const Team = require('../models/Team');
const Event = require('../models/Event');
const EventInvitation = require('../models/EventInvitation');
const Account = require('../models/Account');

// Gets event invitations for a manager's teams that are in specific statuses: Available and Unavailable
async function getManagerEventInvitations(managerContact) {
  // Find all teams managed by this manager
  const teams = await Team.find({ manager: managerContact });
  const teamIDs = teams.map(team => team._id); // Get the IDs: PO Number

  // Find events linked to these teams in specific statuses
  const events = await Event.find({
    _id: { $in: teamIDs },
    status: { $in: ['planning', 'postponed', 'in progress'] } 
  });

  const eventIDs = events.map(event => event._id); // Get their IDs: PO Number

  // Find invitations to those events with specific responses
  return await EventInvitation.find({
    _id: { $in: eventIDs },
    response: { $in: ['available', 'unavailable'] }
  }).select('_id employeeCN response'); 
}

/* async function getAccountActivationRequests() {
    // Find all accounts that are pending activation
}*/

// (Placeholder) Finds notifications meant for team members
async function getTeamMemberNotifications(userContact) {
  // Logic for team member notifications will go here
  return [];
}

module.exports = {
  getManagerEventInvitations,
  getAccountActivationRequests,
  getTeamMemberNotifications,
};
