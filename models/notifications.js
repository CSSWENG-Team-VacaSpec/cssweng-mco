const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // notifID
    sender: { type: String, required: true }, // contactNumber of the sender
    receiver: { 
        type: String, 
        enum: ['Manager', 'Team Members'], // Type of receiver
    },
    receiverID: { type: String, required: true }, // contactNumber of the receiver
    message: { type: String, required: true }, // Notification message
    date: { type: Date, default: Date.now }, // Date of the invitation
    hideFrom: { type: [String], required: false } // Array of contact numbers to hide the notification from
   
},
{ collection: "notifications" });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
