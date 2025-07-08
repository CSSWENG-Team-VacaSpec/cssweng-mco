const EmployeeAccount = require('../models/employeeAccounts');
const Event = require('../models/events');
const EventInvitation = require('../models/eventInvitations');
const Notification = require('../models/notifications');
const Team = require('../models/teams');
const mongoose = require('mongoose');


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

    const changePwRequests = await getForgotPasswordRequests(userContact);
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
      layout: 'main',
      page: 'notifications',
      stylesheet: 'notifications',
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

    const { general, invites } = await getTeamMemberNotifications(userContact);

    const notifications = [
      ...general.map(notif => ({ type: 'general_notif', data: notif })),
      ...invites.map(inv => ({ type: 'event_invite', data: inv }))
    ];

    notifications.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

    return res.render('notifications', {
      layout: 'main',
      page: 'notifications',
      stylesheet: 'notifications',
      user,
      notifications

    });
  } catch (error) {
    console.error('Team Member Notification Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Handle invite response
exports.respondInvite = async (req, res) => {
  try {
    const inviteID = req.params.id;
    const { response } = req.body;
    const user = req.session.user;

    console.log("Invite ID:", inviteID);
    console.log("Response:", response);
    console.log("User:", user);

    // Update invite status
    const updated = await EventInvitation.findByIdAndUpdate(inviteID, { response });
    console.log("Updated invite:", updated);

    const invite = await EventInvitation.findById(inviteID);
    console.log("Invite:", invite);

    const team = await Team.findById(invite.event).lean();
    console.log("Team:", team);

    const managerCN = team.manager;

    const userAccount = await EmployeeAccount.findById(user._id).lean();

    const event = await Event.findById(invite.event).lean();
    const eventName = event?.eventName || 'an event';

    const newNotif = new Notification({
      _id: new mongoose.Types.ObjectId(), 
      sender: user._id,
      receiver: 'Manager',
      receiverID: managerCN,
      message: `${userAccount.firstName} ${userAccount.lastName} responded "${response}" to the event '${eventName}'`,
      date: new Date(),
      hideFrom: []
    });


    await newNotif.save();
    console.log("Notification saved.");

    res.redirect('/notifications');
  } catch (error) {
    console.error("Respond Invite Error:", error);
    res.status(500).send("Error processing response.");
  }
};






