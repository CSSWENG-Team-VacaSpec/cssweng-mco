const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    _id: { type: String, required: true } //role of the team member in a certain event
},
{ collection: "roles" });

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;