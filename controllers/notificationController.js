/*
Allow users to view notifications

- view notifications

manager:
- response to event invite - [from eventInvitations]

TM:
- postponement and cancellation of an event
- event invite
*/


const getEmployeeRole = require('../utils/getEmployeeRole');

const {
  getManagerEventInvitations,
  getAccountActivationRequests,
  getTeamMemberNotifications,
} = require('../utils/notificationHelpers');

// Controller to send all applicable notifications based on the user role
exports.sendNotification = async (req, res) => {
  try {
    const userContact = req.user.contactNumber;

    // Determine if the logged-in user is a Manager or Team Member
    const role = await getEmployeeRole(userContact);

    if (!role) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    let notifications = [];

    // If Manager, gather all manager-specific notifications
    if (role === 'Manager') {
      const eventInvites = await getManagerEventInvitations(userContact);
      const changePwRequests = await getPasswordRequests();

  
      notifications = [
        ...eventInvites.map(inv => ({ type: 'event_invite', data: inv })),
        ...changePwRequests.map(req => ({ type: 'change_pw_request', data: req })),
      ];

    } else {
      // If Team Member, get their specific notifications
      const teamMemberNotifs = await getTeamMemberNotifications(userContact);

      notifications = [
        ...teamMemberNotifs.map(notif => ({ type: 'team_member_notif', data: notif })),
      ];

    }

    // Send full list of notif
    return res.json({ message: 'Notifications sent', notifications });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
