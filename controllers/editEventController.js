
const Team = require('../models/teams');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');


exports.getEditEventPage = async (req, res) => {
    try {

        const userId = req.session.user._id || req.session.user;
        const eventId = req.query.id;
        
        const team = await Team.findById(eventId).lean();
        const event = await Event.findById(eventId).lean(); 
        let isManager = false;
        let isProgramLead = false;

        if (String (team.manager) === String (userId) ) {
            isManager = true;
        }

        if (String (team.programLead) === String (userId) ) {
            isProgramLead = true;
        }

        const showButtons = isManager || isProgramLead

        const userIds = [
            team.manager,
            team.programLead,
            ...team.teamMemberList
        ];

        const users = await User.find({ _id: { $in: userIds } }).lean();

        res.render('editEvent', {
        user: req.session.user,
        layout: 'form',
        stylesheet: 'editEvent',
        script: 'editEvent',
        title: 'Edit Event',
        page: 'edit-event',
        clientName: `${event.clientFirstName} ${event.clientLastName}`,
        showButtons,
        teamMembers: users,
        team,
        event
    });

    }   catch (error) {
        console.error("Error opening event:", error);
        res.status(500).send("Internal server error");
    }
    
};

exports.editEvent = async (req, res) => {
    
     try {
        const {
            'event-name': eventName,
            'client-name': clientName,
            'event-description': description,
            location,
            'start-date': eventDate,
            'end-date': endDate,
            'contact-name': contactName,
            'phone-number': phoneNumber,
            addedMembers,
            addedSuppliers,
        } = req.body;

        const [CPFirstName, ...CPLastNameParts] = contactName.trim().split(' ');
        const CPLastName = CPLastNameParts.join(' ');

        const [clientFirstName, ...clientLastNameParts] = clientName.trim().split(' ');
        const clientLastName = clientLastNameParts.join(' ');

        const eventId = req.query.id;
      

        const parsedMembers = addedMembers ? JSON.parse(addedMembers) : [];
        const parsedSuppliers = addedSuppliers ? JSON.parse(addedSuppliers) : [];

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                eventName,
                clientName,
                description,
                location,
                eventDate,
                clientFirstName,
                clientLastName,
                CPFirstName,
                CPLastName,
                CPContactNo: phoneNumber,
                members: parsedMembers,
                suppliers: parsedSuppliers
            },
            { new: true } 
        );

        if (!updatedEvent) {
            return res.status(404).send('Event not found');
        }

        res.redirect(`/event-details?id=${eventId}&_=${Date.now()}`); //creates a new req 
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).send('Internal server error');
    }
    
};