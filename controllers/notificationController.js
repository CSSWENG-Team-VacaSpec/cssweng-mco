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
const getEmployeeRole = require('./utils/getEmployeeRole');

// compiles all notification objects for the user/s and sends them
exports.sendNotification = async (req, res) => {
    try {
      const userContact = req.user.contactNumber;
  
      // Get the role of the logged-in user
      const role = await getEmployeeRole(userContact);
      if (!role) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      if (role === 'Manager') {
        const invitations = await getManagerEventInvitations(userContact);
        return res.json({ message: 'Notifications sent to Manager', invitations });
      } else {
        // TODO: Logic for Team Member notifications
        return res.json({ message: 'Notifications sent to Team Member' });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

// helper function: fetches the event invitations for a manager based on their teams and events
async function getManagerEventInvitations(managerContact) {
    // Get teams managed by this manager
    const teams = await Team.find({ manager: managerContact });
  
    // Extract team IDs (assumed equal to event IDs)
    const teamIDs = teams.map(team => team._id);
  
    // Get events related to these teams with relevant statuses
    const events = await Event.find({
      _id: { $in: teamIDs },
      status: { $in: ['planning', 'postponed', 'in progress'] }
    });
  
    const eventIDs = events.map(event => event._id);
  
    // Get EventInvitations with 'available' or 'unavailable' responses
    const invitations = await EventInvitation.find({
      _id: { $in: eventIDs },
      response: { $in: ['available', 'unavailable'] }
    }).select('_id employeeCN response');
  
    return invitations;
  }