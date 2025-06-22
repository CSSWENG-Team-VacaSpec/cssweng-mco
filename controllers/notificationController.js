/*
Allow users to view notifications

- view notifications

manager:
- response to event invite - [from eventInvitations]

TM:
- postponement and cancellation of an event
- event invite
*/
const EmployeeAccount = require('../models/employeeAccounts');
const Event = require('../models/events');


const {
  //getManagerEventInvRes,
  getForgotPasswordRequests,
  getManagerGeneralNotifications,
  getTeamMemberNotifications,
  getEventInviteResponses
} = require('../utils/notificationHelpers');

// Main Notification Page Router (decides based on role)
exports.getNotificationPage = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');

  const role = user.role;

  if (role === 'Manager') {
    return exports.getManagerNotifications(req, res);
  } else {
    return exports.getTeamMemberNotifications(req, res);
  }
};

// Manager-specific notifications
exports.getManagerNotifications = async (req, res) => {
  try {
    const userContact = req.session.user._id;
    const user = await EmployeeAccount.findById(userContact).lean();

    const changePwRequests = await getForgotPasswordRequests();
    const generalNotifs = await getManagerGeneralNotifications(userContact);
    const inviteResponses = await getEventInviteResponses(userContact);

    const notifications = [
      ...changePwRequests.map(req => ({ type: 'change_pw_request', data: req })),
      ...generalNotifs.map(notif => ({ type: 'general_notif', data: notif })),
      ...inviteResponses.map(resp => ({ type: 'event_invite_response', data: resp })) // 👈 add this
    ];

    // Sort by date descending if they all contain date
    notifications.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

    return res.render('notifications', {
      layout: 'notificationsLayout',
      page: 'notifications',
      user,
      notifications
    });
  } catch (error) {
    console.error('Manager Notification Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Team Member-specific notifications
exports.getTeamMemberNotifications = async (req, res) => {
  try {
    const userContact = req.session.user._id;
    const user = await EmployeeAccount.findById(userContact).lean();

    const { general, invites } = await getTeamMemberNotifications(userContact); // updated destructuring

    const eventInvites = await Promise.all(invites.map(async inv => {
      const event = await Event.findById(inv._id).lean(); // fetch event details
      const today = new Date();
      const daysLeft = Math.max(0, Math.ceil((new Date(inv.inviteEndDate) - today) / (1000 * 60 * 60 * 24)));

      const sender = await EmployeeAccount.findById(event?.CPContactNo).lean(); // fetch contact person name

      return {
        eventName: event?.eventName || 'Unnamed Event',
        clientName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown Sender',
        description: 'You have been invited to an event.',
        date: inv.inviteDate,
        daysLeft,
        response: inv.response
      };
    }));

    const notifications = [
      ...general.map(notif => ({ type: 'general_notif', data: notif })),
      ...eventInvites.map(inv => ({ type: 'event_invite', data: inv }))
    ];

    notifications.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

    return res.render('notifications', {
      layout: 'notificationsLayout',
      page: 'notifications',
      user,
      notifications
    });
  } catch (error) {
    console.error('Team Member Notification Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

