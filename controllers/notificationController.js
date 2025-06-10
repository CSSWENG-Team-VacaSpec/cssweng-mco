/*
Allow users to view notifications

- view notifications

manager:
- [VOID] account activation request 
- response to event invite - [from eventInvitations]

TM:
- postponement and cancellation of an event
- event invite
*/

// CREATE A function that identifies if the user is Manager or a Team Member

const EventInvitation = require('./models/EventInvitation');
const Team = require('./models/Team');
const Event = require('./models/Event');

exports.getManagerEventInvitations = async (req, res) => {
  try {
    const managerContact = req.user.contactNumber; 

    // Get teams managed by this manager
    const teams = await Team.find({ manager: managerContact });

    // Extract team IDs (same as event IDs)
    const teamIDs = teams.map(team => team._id);

    // Get events with those IDs and relevant statuses
    const events = await Event.find({
      _id: { $in: teamIDs },
      status: { $in: ['planning', 'postponed', 'in progress'] }
    });

    const eventIDs = events.map(event => event._id);

    // Get EventInvitations with response 'available' or 'unavailable' for those events
    const invitations = await EventInvitation.find({
      _id: { $in: eventIDs },
      response: { $in: ['available', 'unavailable'] }
    }).select('_id employeeCN response');

    // Return filtered invitation data
    res.json(invitations);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
