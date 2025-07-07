const { v4: uuidv4 } = require('uuid');
const Event = require('../models/events');
const Team = require('../models/teams');
const Notification = require('../models/notifications');

// sends cancellation notifications to all team members of a specific event.
async function notifyTeamOfEventCancellation(eventID, senderID) {
  try {
    // Fetch event
    const event = await Event.findById(eventID);
    if (!event) {
      console.error('Event not found.');
      return;
    }

    // get event team 
    const team = await Team.findById(eventID);
    if (!team) {
      console.error('Team not found for this event.');
      return;
    }

    // all contacts to notify (program lead + members)
    const allReceivers = [team.programLead, ...team.teamMemberList];

    // create notifications
    const notifications = allReceivers.map(contact => ({
      _id: uuidv4(),
      sender: senderID,
      receiver: 'Team Members',
      receiverID: contact,
      message: `The event "${event.eventName}" has been cancelled.`,
      date: new Date(),
      hideFrom: []
    }));

    // save all notifications
    await Notification.insertMany(notifications);
    console.log('Cancel event notifications sent.');

  } catch (error) {
    console.error('Error notifying team of event cancellation:', error);
  }
}

module.exports = notifyTeamOfEventCancellation;
