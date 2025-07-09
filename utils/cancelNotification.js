const { v4: uuidv4 } = require('uuid');
const Event = require('../models/events');
const Team = require('../models/teams');
const Notification = require('../models/notifications');
const EmployeeAccount = require('../models/employeeAccounts');


// sends cancellation notifications based on sender's role
async function notifyTeamOfEventCancellation(eventID, senderID) {
  try {
    const event = await Event.findById(eventID);
    if (!event) {
      console.error('Event not found.');
      return;
    }

    const team = await Team.findById(eventID);
    if (!team) {
      console.error('Team not found for this event.');
      return;
    }

    const sender = await EmployeeAccount.findById(senderID).select('role').lean();
    if (!sender) {
      console.error('Sender not found.');
      return;
    }

    let notifications = [];

    if (sender.role == 'Manager') {
      // notify all team members (program lead + team members)
      const allReceivers = [team.programLead, ...team.teamMemberList];

      notifications = allReceivers.map(contact => ({
        _id: uuidv4(),
        sender: senderID,
        receiver: 'Team Members',
        receiverID: contact,
        message: `The event "${event.eventName}" has been cancelled.`,
        date: new Date(),
        hideFrom: []
      }));

    } else {
      // sender is a team member (program lead)
      const managers = await EmployeeAccount.find({ role: 'Manager', status: 'active' }).lean();
      const managerNotifs = managers.map(manager => ({
        _id: uuidv4(),
        sender: senderID,
        receiver: 'Manager',
        receiverID: team.manager,
        message: `The event "${event.eventName}" has been cancelled.`,
        date: new Date(),
        hideFrom: []
      }));

      // notify team members excluding sender (program lead)
      const memberReceivers = [team.programLead, ...team.teamMemberList].filter(contact => contact !== senderID);
      const teamNotifs = memberReceivers.map(contact => ({
        _id: uuidv4(),
        sender: senderID,
        receiver: 'Team Members',
        receiverID: contact,
        message: `The event "${event.eventName}" has been cancelled.`,
        date: new Date(),
        hideFrom: []
      }));

      notifications = [...managerNotifs, ...teamNotifs];
    }

    await Notification.insertMany(notifications);
    console.log('Cancel event notifications sent.');

  } catch (error) {
    console.error('Error notifying team of event cancellation:', error);
  }
}

module.exports = notifyTeamOfEventCancellation;

