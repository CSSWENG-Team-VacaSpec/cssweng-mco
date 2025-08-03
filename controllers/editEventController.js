const EmployeeAccount = require('../models/employeeAccounts');
const Team = require('../models/teams');
const Suppliers = require('../models/suppliers');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');
const Notification = require('../models/notifications');
const { v4: uuidv4 } = require('uuid');


exports.getEditEventPage = async (req, res) => {
    try {

        const userId = req.session.user._id || req.session.user;
        const eventId = req.query.id;
        const user = await User.findById(userId).lean();
    
        if (!user || user.role !== 'Manager') {

            return res.status(403).send('Access denied: Managers only.'); 
        }

        const members = await EmployeeAccount.find({ 
            status: 'active',
            _id: { $ne: userId },
            role: { $ne: 'Manager'}
        }).lean();
        const suppliers = await Suppliers.find({ status: 'active' }).lean();
        const team = await Team.findOne({ _id: eventId }).lean();
        const event = await Event.findById(eventId).lean();

        const memberList = team.teamMemberList;
        const supplierList = team.supplierList;

        // const currentTeamMembers = [];
        // for (const memberId of memberList || []) {
        //     const member = members.find(m => m._id.toString() === memberId.toString());
        //     if (member) {
        //         currentTeamMembers.push({
        //             _id: member._id,
        //             firstName: member.firstName,
        //             lastName: member.lastName,
        //             role: member.role,
        //             pfp: member.pfp,
        //             email: member.email,
        //             bio: member.bio
        //         });
        //     }
        // }

        const currentTeamMembers = await EmployeeAccount.find({
            _id: { $in: memberList || [] }
        }).lean();

        // const currentSuppliers = [];
        // for (const supplierId of supplierList || []) {
        //     const supplier = suppliers.find(m => m._id.toString() === supplierId.toString());
        //     if (supplier) {
        //         currentSuppliers.push({
        //             _id: supplier._id,
        //             name: supplier.companyName,
        //             contactNames: supplier.contactNames,
        //             contactNumbers: supplier.contactNumbers,
        //         });
        //     }
        // }

        const currentSuppliers = await Suppliers.find({
            _id: { $in: supplierList || [] }
        }).lean();

        const otherMembers = members.filter(member => 
            !team.teamMemberList?.some(id => id.toString() === member._id.toString())
        );
        const otherSuppliers = suppliers.filter(supplier => 
            !team.supplierList?.some(id => id.toString() === supplier._id.toString())
        );

        const startDate = event.eventDate ? new Date(event.eventDate) : null;
        const endDate = event.eventEndDate ? new Date(event.eventEndDate) : startDate;
        const formattedEvent = {
            ...event,
            formattedStartDate: startDate ? startDate.toISOString().split('T')[0] : '',
            formattedEndDate: endDate ? endDate.toISOString().split('T')[0] : ''
        };

        console.log("Team Members List:", memberList);
        console.log("Supplier List:", supplierList);
        console.log("Current Team Members:", currentTeamMembers);
        console.log("Current Suppliers:", currentSuppliers);
        res.render('editEvent', {
        user: req.session.user,
        layout: 'form',
        stylesheet: 'editEvent',
        script: 'editEvent',
        title: 'Edit Event',
        page: 'edit-event',
        clientName: `${event.clientFirstName} ${event.clientLastName}`,
        event: formattedEvent,
        currentTeamMembers,
        currentSuppliers,
        otherMembers,
        otherSuppliers,
        members,
        suppliers
    });

    }   catch (error) {
        console.error("Error opening event:", error);
        res.status(500).send("Internal server error");
    }
    
};

exports.editEvent = async (req, res) => {
    
     try {

    const userId = req.session.user
    const user = await User.findById(userId).lean();
    
    if (!user || user.role !== 'Manager') {

         return res.status(403).send('Access denied: Managers only.'); 
    }
    
        const {
            'event-name': eventName,
            'client-name': clientName,
            'event-description': description,
            location,
            'start-date': startDate,
            'end-date': endDate,
            'contact-name': contactName,
            'phone-number': phoneNumber,
            addedMembers,
            addedSuppliers,
            status
        } = req.body;

        const finalEndDate = endDate || startDate;

        const [CPFirstName, ...CPLastNameParts] = contactName.trim().split(' ');
        const CPLastName = CPLastNameParts.join(' ');

        const [clientFirstName, ...clientLastNameParts] = clientName.trim().split(' ');
        const clientLastName = clientLastNameParts.join(' ');

        const eventId = req.query.id;
        const team = await Team.findById(eventId).lean();
            if (!team) {
                return res.status(404).send('Team not found');
            }

        const memberList = team.teamMemberList;

        const currentTeamMembers = await EmployeeAccount.find({
                _id: { $in: memberList || [] }
            }).lean();

        const parsedMembers = addedMembers ? JSON.parse(addedMembers) : [];
        const parsedSuppliers = addedSuppliers ? JSON.parse(addedSuppliers) : [];
        console.log("Current Members:", currentTeamMembers.map(m => m._id.toString()));
        console.log("Parsed Members:", parsedMembers);

        // Compare and find removed ones
        const removedMemberIds = currentTeamMembers
        .map(member => member._id.toString()) // get string IDs
        .filter(id => !parsedMembers.includes(id));


        const removedMemberNotifications = removedMemberIds.map(memberId => ({
            _id: uuidv4(),
            sender: userId, 
            receiver: 'Team Members',
            receiverID: memberId,
            message: `You have been removed from ${eventName}.`,
            date: new Date(),
            hideFrom: []
        }));

        await Notification.insertMany(removedMemberNotifications);
        console.log("Removed Member Notifications:", removedMemberNotifications);

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                eventName,
                clientName,
                description,
                location,
                clientFirstName,
                clientLastName,
                CPFirstName,
                CPLastName,
                CPContactNo: phoneNumber,
                members: parsedMembers,
                suppliers: parsedSuppliers,
                eventDate: new Date(startDate).toISOString().split('T')[0],
                eventEndDate: finalEndDate ? new Date(finalEndDate).toISOString().split('T')[0] : null,
                status: status
            },
            { new: true } 
        );

        if (!updatedEvent) {
            return res.status(404).send('Event not found');
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            eventId,
            {
                teamMemberList: parsedMembers,
                supplierList: parsedSuppliers
            },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(404).send('Team not found');
        }
        
        res.redirect(`/event-details?id=${eventId}&_=${Date.now()}`); //creates a new req 
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).send('Internal server error');
    }
    
};