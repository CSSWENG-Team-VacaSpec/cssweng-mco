const Team = require('../models/teams');
const Event = require('../models/events');
const EventInvitation = require('../models/eventInvitations');
const Notification = require('../models/notifications');
const EmployeeAccount = require('../models/employeeAccounts');
const mongoose = require('mongoose');


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
    message: { $not: /(responded|requested)/i }
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
  const now = new Date();

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

  // Format general notifications
  const generalNotifs = await Promise.all(
    generalNotifsRaw.map(async notif => {
      const sender = await EmployeeAccount.findById(notif.sender).lean();
      const rawDate = new Date(notif.date);
      const formattedDate = `${String(rawDate.getMonth() + 1).padStart(2, '0')}/${String(rawDate.getDate()).padStart(2, '0')}/${rawDate.getFullYear()}`;

      const isUrgent = notif.message.startsWith('[URGENT]');
      let eventTitle = 'Notification';

      if (isUrgent) {
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

  const validInvites = [];

  for (const inv of eventInvitesRaw) {
    const inviteEndDate = new Date(inv.inviteEndDate);

    const event = await Event.findById(inv.event).lean();
    const team = await Team.findById(inv.event).lean();
    const manager = team ? await EmployeeAccount.findById(team.manager).lean() : null;

    const managerCN = manager?._id || null;

    if (!event || !team || !manager) continue;

    if (inviteEndDate < now) {
      // set response to 'unavailable'
      await EventInvitation.findByIdAndUpdate(inv._id, { response: 'unavailable' });

      const userAccount = await EmployeeAccount.findById(memberCN).lean();
      const eventName = event.eventName;

      const newNotif = new Notification({
        _id: new mongoose.Types.ObjectId(),
        sender: memberCN,
        receiver: 'Manager',
        receiverID: managerCN,
        message: `${userAccount.firstName} ${userAccount.lastName} responded "unavailable" to the event '${eventName}'`,
        date: new Date(),
        hideFrom: []
      });

      await newNotif.save();
      continue; // Do not include expired invites
    }

    // still valid — include
    const inviteDate = new Date(inv.inviteDate);
    const formattedDate = `${String(inviteDate.getMonth() + 1).padStart(2, '0')}/${String(inviteDate.getDate()).padStart(2, '0')}/${inviteDate.getFullYear()}`;

    const daysLeft = Math.max(0, Math.ceil((inviteEndDate - now) / (1000 * 60 * 60 * 24)));

    validInvites.push({
      inviteID: inv._id,
      eventName: event.eventName || 'Unnamed Event',
      clientName: `${manager.firstName} ${manager.lastName}`,
      date: formattedDate,
      description: `You have been invited to an event as a ${inv.role}.`,
      daysLeft,
      response: inv.response
    });
  }

  return {
    general: generalNotifs,
    invites: validInvites
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
