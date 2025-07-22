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
const Team = require('../models/teams');
const EmployeeAccount = require('../models/employeeAccounts');
const Notification = require('../models/notifications'); 
const { v4: uuidv4 } = require('uuid'); //UUIDs


// Get a specific invitation for an employee
exports.viewInvite = async (req, res) => {
  const { poNumber, employeeCN } = req.params;

  try {
    const invite = await EventInvitation.findOne({ event: poNumber, employeeCN });
    if (!invite) return res.status(404).json({ error: 'Invite not found' });

    res.json(invite);
  } catch (err) {
    console.error('Error fetching accepted members:', err); // debugging console log
    res.status(500).json({ error: 'An unexpected error occurred while fetching accepted members. Please try again later.' });
  }
};

// Get all employees who accepted the invite
exports.getAcceptedMembers = async (req, res) => {
  const { poNumber } = req.params;

  try {
    const accepted = await EventInvitation.find({ event: poNumber, response: 'available' });
    res.json(accepted);
  } catch (err) {
    console.error('Error fetching accepted members:', err); // debugging console log
    res.status(500).json({ error: 'An unexpected error occurred while fetching accepted members. Please try again later.' });
  }
};

// Get names of employees who accepted the invite
exports.getAcceptedMemberNames = async (req, res) => {
  const { poNumber } = req.params;

  try {
    // get the available employeeCNs
    const acceptedInvites = await EventInvitation.find(
      { event: poNumber, response: 'available' }
    ).select('employeeCN');

    const contactNumbers = acceptedInvites.map(invite => invite.employeeCN);

    // get first and last names of those employees
    if (contactNumbers.length === 0) {
      return res.json([]); // No available members
    }
    const employees = await EmployeeAccount.find(
      { _id: { $in: contactNumbers } }
    ).select('_id firstName lastName');

    res.json(employees);
  } catch (err) {
    console.error('Error fetching accepted member names:', err);
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
    const invite = await EventInvitation.findOne({ event: poNumber, employeeCN });
    if (!invite) return res.status(404).json({ error: 'Invite not found' });

    invite.response = response;
    await invite.save();

    const team = await Team.findById(poNumber);
    if (team) {
      const notif = new Notification({
        _id: uuidv4(),
        sender: employeeCN,
        receiver: 'Manager',
        receiverID: team.manager,
        date: new Date(),
        message: `Member ${employeeCN} responded '${response}' to invite ${poNumber}.`
      });

      await notif.save();
      const team = await Team.findById(poNumber);
      if (!team) {
      console.warn('No team found with ID:', poNumber);
      return res.status(404).json({ error: 'Team not found' });
      }

     
    }
    const updatedTeam = await Team.findById(poNumber);
    console.log('Updated team:', updatedTeam);

    res.json({ message: 'Response recorded', invite });
  } catch (err) {
    console.error('Error responding to invite:', err);
    res.status(500).json({ error: 'An unexpected error occurred while responding to the invite. Please try again later.' });
  }
};