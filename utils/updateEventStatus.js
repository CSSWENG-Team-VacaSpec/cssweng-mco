const { v4: uuidv4 } = require('uuid');
const Event = require('../models/events');
const Team = require('../models/teams');
const Notification = require('../models/notifications');

/**
 * Updates the status of an event and notifies team members if cancelled or postponed.
 * 
 * @param {string} eventId - event ID (Purchase Order Number)
 * @param {string} newStatus - new status to apply.
 * @param {string} managerContact - contact number of the manager making the change.
 */
async function updateEventStatus(eventId, newStatus, managerContact) {
  const validStatuses = ['planning', 'in progress', 'cancelled', 'postponed', 'completed'];
  const notifyStatuses = ['cancelled', 'postponed'];

  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
  }

  // get the event
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error(`Event with ID "${eventId}" not found.`);
  }

  // update the status
  event.status = newStatus;
  await event.save();

  // notify TMs if status is 'cancelled' or 'postponed'
  if (notifyStatuses.includes(newStatus)) {

    // find the event team
    const team = await Team.findById(eventId);
    if (!team) {
      throw new Error(`Team with ID "${eventId}" not found.`);
    }

    const message = `The event "${event.eventName}" has been ${newStatus}.`;

    const receivers = [team.programLead, ...team.teamMemberList];

    const notifications = receivers.map(receiverID => ({
      _id: uuidv4(),
      sender: managerContact,
      receiver: 'Team Members',
      receiverID,
      message,
    }));

    await Notification.insertMany(notifications);
  }

  return event;
}

module.exports = updateEventStatus;
