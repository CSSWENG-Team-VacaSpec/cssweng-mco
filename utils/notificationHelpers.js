const Team = require('../models/teams');
const Event = require('../models/events');
const EventInvitation = require('../models/eventInvitations');
const Notification = require('../models/notifications');
const EmployeeAccount = require('../models/employeeAccounts');

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

// gets all notifications sent to managers related to password reset requests
// no parameter since ALL managers must receive this notification
async function getForgotPasswordRequests() {
  try {
    // find notifications sent to managers related to password reset
    const notifications = await Notification.find({
      receiver: 'Manager',
      message: { $regex: /password reset/i } // filters only password reset requests
    });

    const enrichedRequests = await Promise.all(
      notifications.map(async notif => {
        const sender = await EmployeeAccount.findById(notif.sender).lean();
        return {
          notifID: notif._id,
          senderCN: notif.sender,
          senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown',
          message: notif.message,
          date: notif.date
        };
      })
    );

    return enrichedRequests;

  } catch (error) {
    console.error('Error fetching forgot password requests:', error);
    throw error;
  }
}



// (Placeholder) Finds notifications meant for team members
async function getTeamMemberNotifications(userContact) {
  // Logic for team member notifications will go here
  return [];
}

module.exports = {
  getManagerEventInvitations,
  getForgotPasswordRequests,
  getTeamMemberNotifications,
};
