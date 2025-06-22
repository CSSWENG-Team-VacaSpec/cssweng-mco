const Team = require('../models/teams');
const Event = require('../models/events');
const EventInvitation = require('../models/eventInvitations');
const Notification = require('../models/notifications');
const EmployeeAccount = require('../models/employeeAccounts');

// Event invite responses (for manager)
async function getManagerEventInvRes(managerContact) {
  const teams = await Team.find({ manager: managerContact });
  const teamIDs = teams.map(team => team._id);

  const events = await Event.find({
    _id: { $in: teamIDs },
    status: { $in: ['planning', 'postponed', 'in progress'] }
  });

  const eventIDs = events.map(event => event._id);

  return await EventInvitation.find({
    _id: { $in: eventIDs },
    response: { $in: ['available', 'unavailable'] }
  }).select('_id employeeCN response inviteDate inviteEndDate');
}

// Forgot password requests (for manager)
async function getForgotPasswordRequests() {
  const notifications = await Notification.find({
    receiver: 'Manager',
    message: { $regex: /password reset/i }
  });

  const enriched = await Promise.all(
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

  return enriched;
}

// General notifications for manager
async function getManagerGeneralNotifications(managerCN) {
  return await Notification.find({
    receiver: 'Manager',
    receiverID: managerCN,
    hideFrom: { $ne: managerCN }
  }).sort({ date: -1 }); //newest to oldest notids
}

// General + invite notifications for team member
async function getTeamMemberNotifications(memberCN) {
  const [generalNotifs, eventInvites] = await Promise.all([
    Notification.find({
      receiver: 'Team Members',
      receiverID: memberCN,
      hideFrom: { $ne: memberCN }
    }).sort({ date: -1 }),

    EventInvitation.find({
      employeeCN: memberCN,
      response: 'pending'
    }).select('_id inviteDate inviteEndDate role')
  ]);

  return {
    general: generalNotifs,
    invites: eventInvites
  };
}

module.exports = {
  getManagerEventInvRes,
  getForgotPasswordRequests,
  getManagerGeneralNotifications,
  getTeamMemberNotifications
};
