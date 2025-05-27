/* 
Allow team members to view and respond to team/event invites.

- view an invite
    - fetch event details
- view people who accepted the invite
- respond to an invite (accept/decline)
- notify the manager of the response
*/

// EventInvitation and Teams have the same PK
// use PO Number to get manager contact number
// use PO Number to get team members

const EventInvitation = require('../models/eventInvitations');
const Team = require('../models/team');

// Get a specific invitation for an employee
exports.viewInvite = async (req, res) => {
  const { poNumber, employeeCN } = req.params;

  try {
    const invite = await EventInvitation.findOne({ _id: poNumber, employeeCN });
    if (!invite) return res.status(404).json({ error: 'Invite not found' });

    res.json(invite);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all employees who accepted the invite
exports.getAcceptedMembers = async (req, res) => {
  const { poNumber } = req.params;

  try {
    const accepted = await EventInvitation.find({ _id: poNumber, response: 'available' });
    res.json(accepted);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Respond to an invitation and notify manager
exports.respondToInvite = async (req, res) => {
  const { poNumber, employeeCN } = req.params;
  const { response } = req.body;

  if (!['available', 'unavailable'].includes(response)) {
    return res.status(400).json({ error: 'Invalid response' });
  }

  try {
    const updated = await EventInvitation.findOneAndUpdate(
      { _id: poNumber, employeeCN },
      { response }, //updates the value of response
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Invite not found' });

    // Notify manager
    const team = await Team.findById(poNumber);
    if (team) {
      console.log(`Notify manager ${team.manager}: Member ${employeeCN} responded "${response}" to invite ${poNumber}.`);
    }

    res.json({ message: 'Response recorded', updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


