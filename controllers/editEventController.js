const EmployeeAccount = require('../models/employeeAccounts');
const Team = require('../models/teams');
const Suppliers = require('../models/suppliers');
const Event = require('../models/events');
const User = require('../models/employeeAccounts');


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
        event,
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
            'start-date': eventDate,
            'end-date': endDate,
            'contact-name': contactName,
            'phone-number': phoneNumber,
            addedMembers,
            addedSuppliers,
            status
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