const mongoose = require('mongoose');

const eventInvitationSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // [Purchase Order Number]
    employeeCN: { type: String, required: true }, // Contact Number of the employee being invited
    inviteDate: { type: Date, default: Date.now }, // Date of the invitation
    inviteEndDate: { type: Date, required: true }, // End date for the invitation
    response: { 
        type: String, 
        enum: ['available', 'unavailable', 'pending'], // Possible responses to the invitation
        default: 'pending' // Default response is pending
    },
   
},
{ collection: "eventInvitations" });

const EventInvitation = mongoose.model("EventInvitation", eventInvitationSchema);
module.exports = EventInvitation;
