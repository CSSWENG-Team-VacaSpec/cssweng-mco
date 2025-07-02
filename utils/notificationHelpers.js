const Team = require('../models/teams');
const Event = require('../models/events');
const EventInvitation = require('../models/eventInvitations');
const Notification = require('../models/notifications');
const EmployeeAccount = require('../models/employeeAccounts');

// Event invite responses (for manager)
/* async function getManagerEventInvRes(managerContact) {
  const teams = await Team.find({ manager: managerContact });
  const teamIDs = teams.map(team => team._id);

  const events = await Event.find({
    _id: { $in: teamIDs },
    status: { $in: ['planning', 'postponed', 'in progress'] }
  });

  const eventIDs = events.map(event => event._id);

  const invites = await EventInvitation.find({
    _id: { $in: eventIDs },
    response: { $in: ['available', 'unavailable'] }
  }).select('_id employeeCN response inviteDate inviteEndDate'); 

  /
  const enrichedInvites = await Promise.all(invites.map(async (inv) => {
    const sender = await EmployeeAccount.findById(inv.employeeCN).lean(); /
    return {
      ...inv.toObject(), 
      senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown'
    };
  }));

  return enrichedInvites; 
}
*/

// Forgot password requests (for manager)
async function getForgotPasswordRequests(managerCN) {
  const notifications = await Notification.find({
    receiver: 'Manager',
    receiverID: managerCN, 
    message: { $regex: /password reset/i }
  });

  const enriched = await Promise.all(
    notifications.map(async notif => {
      const sender = await EmployeeAccount.findById(notif.sender).lean();
      const rawDate = new Date(notif.date);
      const formattedDate = `${String(rawDate.getMonth() + 1).padStart(2, '0')}/${String(rawDate.getDate()).padStart(2, '0')}/${rawDate.getFullYear()}`;

      return {
        notifID: notif._id,
        senderCN: notif.sender,
        senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown',
        message: notif.message,
        date: formattedDate
      };
    })
  );

  return enriched;
}


// General notifications for manager
async function getManagerGeneralNotifications(managerCN) {
  const notifications = await Notification.find({
    receiver: 'Manager',
    receiverID: managerCN,
    hideFrom: { $ne: managerCN },
    message: { $not: /responded/i }
  });

  const enriched = await Promise.all(
    notifications.map(async notif => {
      const sender = await EmployeeAccount.findById(notif.sender).lean();
      const rawDate = new Date(notif.date);
      const formattedDate = `${String(rawDate.getMonth() + 1).padStart(2, '0')}/${String(rawDate.getDate()).padStart(2, '0')}/${rawDate.getFullYear()}`;

      return {
        notifID: notif._id,
        senderCN: notif.sender,
        senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown',
        message: notif.message,
        date: formattedDate
      };
    })
  );

  return enriched;
}

// General + invite notifications for team member
async function getTeamMemberNotifications(memberCN) {
  const [generalNotifsRaw, eventInvitesRaw] = await Promise.all([
    Notification.find({
      receiver: 'Team Members',
      receiverID: memberCN,
      hideFrom: { $ne: memberCN }
    }).sort({ date: -1 }),

    EventInvitation.find({
      employeeCN: memberCN,
      response: 'pending'
    }).select('_id inviteDate inviteEndDate response role event')
  ]);

  const generalNotifs = await Promise.all(
    generalNotifsRaw.map(async notif => {
      const sender = await EmployeeAccount.findById(notif.sender).lean();

      const rawDate = new Date(notif.date);
      const formattedDate = `${String(rawDate.getMonth() + 1).padStart(2, '0')}/${String(rawDate.getDate()).padStart(2, '0')}/${rawDate.getFullYear()}`;

      const isUrgent = notif.message.startsWith('[URGENT]');
      let eventTitle = 'Notification';

      if (isUrgent) {
        // extract "Tech Expo 2025" from "[URGENT] Tech Expo 2025 has been postponed..."
        const match = notif.message.match(/\[URGENT\]\s(.+?)(?=\s(has|was))/);
        if (match) eventTitle = `[URGENT] ${match[1]}`;
      }

      return {
        notifID: notif._id,
        senderCN: notif.sender,
        senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown',
        message: notif.message,
        date: formattedDate,
        isUrgent,
        eventTitle
      };
    })
  );



  const eventInvites = await Promise.all(
  eventInvitesRaw.map(async (inv) => {
    const event = await Event.findById(inv.event).lean();
    const team = await Team.findById(inv.event).lean();
    const manager = team ? await EmployeeAccount.findById(team.manager).lean() : null;

    const inviteDate = new Date(inv.inviteDate);
    const formattedDate = `${String(inviteDate.getMonth() + 1).padStart(2, '0')}/${String(inviteDate.getDate()).padStart(2, '0')}/${inviteDate.getFullYear()}`;

    const inviteEnd = new Date(inv.inviteEndDate);
    const today = new Date();
    const daysLeft = !isNaN(inviteEnd.getTime())
      ? Math.max(0, Math.ceil((inviteEnd - today) / (1000 * 60 * 60 * 24)))
      : 0;

    return {
      inviteID: inv._id,
      eventName: event?.eventName || 'Unnamed Event',
      clientName: manager ? `${manager.firstName} ${manager.lastName}` : 'Unknown Sender',
      date: formattedDate,
      description: `You have been invited to an event as a ${inv.role}.`,
      daysLeft,
      response: inv.response
    };
  })
);

  return {
    general: generalNotifs,
    invites: eventInvites
  };
}

// Event invite responses (for manager)
async function getEventInviteResponses(managerCN) {
  const responses = await Notification.find({
    receiver: 'Manager',
    receiverID: managerCN,
    message: { $regex: /responded/i }
  });

  const enriched = await Promise.all(
    responses.map(async notif => {
      const sender = await EmployeeAccount.findById(notif.sender).lean();
      const rawDate = new Date(notif.date);
      const formattedDate = `${String(rawDate.getMonth() + 1).padStart(2, '0')}/${String(rawDate.getDate()).padStart(2, '0')}/${rawDate.getFullYear()}`;

      return {
        notifID: notif._id,
        senderCN: notif.sender,
        senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown',
        eventName: notif.message.split('to the event')[1]?.trim().replace(/['"]/g, '') || 'Event',
        message: notif.message,
        date: formattedDate
      };
    })
  );

  return enriched;
}


module.exports = {
  getForgotPasswordRequests,
  getManagerGeneralNotifications,
  getTeamMemberNotifications,
  getEventInviteResponses
};
