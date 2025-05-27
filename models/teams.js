const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // teamID [Purchase Order Number]
    manager: { type: String, required: true }, // manager contact number
    programLead: { type: String, required: true },
    teamMemberList: { type: [String], required: true }, // Array of employee contact numbers
    roleList: { type: [String], required: true } // Array of roles corresponding to teamMemberList
},
{ collection: "teams" });

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
