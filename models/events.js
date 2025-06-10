const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // [Purchase Order Number]
    eventName: { type: String, required: true },
    description: { type: String},
    eventDate: { type: String, required: true },
    location: { type: String, required: true },
    status: {
        type: String, 
        enum: ['planning', 'in progress', 'cancelled', 'postponed', 'completed'], 
        default: 'planning' 
    }, 
    CPContactNo: { type: String, required: true }, // Contact number of the contact person
    CPLastName: { type: String, required: true }, // Last name of the contact person
    CPFirstName: { type: String, required: true }, // First name of the contact person
    clientLastName: { type: String, required: true }, // Last name of the client
    clientFirstName: { type: String, required: true }, // First name of the client
    companyName: { type: String}, // Name of the company
   
},
{ collection: "events" });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
