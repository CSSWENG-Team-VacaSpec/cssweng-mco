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

const {
  getManagerEventInvRes,
  getForgotPasswordRequests,
  getManagerGeneralNotifications,
  getTeamMemberNotifications
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

    const eventInvites = await getManagerEventInvRes(userContact);
    const changePwRequests = await getForgotPasswordRequests();
    const generalNotifs = await getManagerGeneralNotifications(userContact); 

    const notifications = [
      ...eventInvites.map(inv => ({ type: 'event_invite', data: inv })),
      ...changePwRequests.map(req => ({ type: 'change_pw_request', data: req })),
      ...generalNotifs.map(notif => ({ type: 'general_notif', data: notif }))
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

    const generalNotifs = await getTeamMemberNotifications(userContact);
    const eventInvites = await getTeamMemberEventInvites(userContact);

    const notifications = [
      ...generalNotifs.map(notif => ({ type: 'general_notif', data: notif })),
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
