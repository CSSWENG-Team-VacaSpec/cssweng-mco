const EmployeeAccount = require('../models/employeeAccounts');   
const Event = require('../models/events');
const Invite = require('../models/eventInvitations');
const Suppliers = require('../models/suppliers');
const Team = require('../models/teams');
const { v4: uuidv4 } = require('uuid');

exports.renderPage = async (req, res) => {
    try {
        const userId = req.session.user
        const user = await EmployeeAccount.findById(userId).lean();
        
        if (!user || user.role !== 'Manager') {
            return res.status(403).send('Access denied: Managers only.'); 
        }

        const members = await EmployeeAccount.find({ status: 'active' }).lean();
        const suppliers = await Suppliers.find({ status: 'active' }).lean();

        res.render('eventCreate', {
            layout: 'form',
            stylesheet: 'eventCreate',
            script: 'eventCreate',
            title: 'Create Event',
            page: 'event-create',
            user: req.session.user,
            members,
            suppliers
        });
    } catch (error) {
        console.error('Could not load event creation page.');
        return res.status(500).send('Could not load event creation page.');
    }
}


exports.createEvent = async (req, res) => {
    try {

    const userId = req.session.user
    const user = await EmployeeAccount.findById(userId).lean();
    
    if (!user || user.role !== 'Manager') {
         return res.status(403).send('Access denied: Managers only.'); 
    }
        const { 
            'event-name': eventName,
            'client-first-name': clientFirstName,
            'client-last-name': clientLastName,
            'event-description': description,
            'start-date': eventDate,
            location,
            'contact-first-name': CPFirstName,
            'contact-last-name': CPLastName,
            'phone-number': CPContactNo,
            addedMembers,
            addedSuppliers
        } = req.body;

        const parsedMembers = JSON.parse(addedMembers || '[]');
        const parsedSuppliers = JSON.parse(addedSuppliers || '[]');
        console.log('Parsed addedMembers:', parsedMembers);

        const newEvent = new Event({
            _id: uuidv4(),
            eventName,
            description,
            eventDate,
            location,
            CPContactNo,
            CPLastName,
            CPFirstName,
            clientLastName,
            clientFirstName,
            companyName: '' // optional, not in form
        });

        await newEvent.save();

         const newTeam = new Team({
            _id: newEvent._id,
            manager: req.session.user._id,
            programLead: req.session.user._id,
            teamMemberList: [],
            roleList: [],
            supplierList: parsedSuppliers,
            teamMemberAttendance: [],
            supplierAttendance: []
        });

    await newTeam.save();

        const invitesToCreate = parsedMembers.map(member => ({
            _id: uuidv4(),
            event: newEvent._id,
            employeeCN: member, // make sure this key matches your frontend
            role: member.role || 'member',    // default role if not given
            inviteDate: new Date(),
            inviteEndDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 day
            response: 'pending'
        }));

        if (invitesToCreate.length > 0) {
            await Invite.insertMany(invitesToCreate);
        }
        console.log('Invites created:', invitesToCreate);

        res.redirect('/eventlist'); // redirect as needed

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send('Failed to create event');
    }
};
