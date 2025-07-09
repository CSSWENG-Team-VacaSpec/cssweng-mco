const { v4: uuidv4 } = require('uuid');
const Event = require('../models/events');
const Team = require('../models/teams');
const Notification = require('../models/notifications');

// sends deletion notifications to all team members of a specific event.
async function notifyTeamOfEventDeletion(eventID, senderID) {
  try {
    console.log("🔔 notifyTeamOfEventDeletion triggered for event:", eventID, "by", senderID);

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

    const allReceivers = [team.programLead, ...team.teamMemberList];
    console.log("Notifying receivers:", allReceivers);

    const notifications = allReceivers.map(contact => ({
      _id: uuidv4(),
      sender: senderID,
      receiver: 'Team Members',
      receiverID: contact,
      message: `The event "${event.eventName}" has been deleted.`,
      date: new Date(),
      hideFrom: []
    }));

    const result = await Notification.insertMany(notifications);
    console.log('Delete event notifications saved:', result);

  } catch (error) {
    console.error('Error notifying team of event cancellation:', error);
  }
}


module.exports = notifyTeamOfEventDeletion;
