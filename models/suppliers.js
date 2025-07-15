const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    _id: { type: String, required: true },  
    companyName: { type: String, required: true },
    contactNames: { type: [String], required: true },   // Array of roles corresponding to contact persons
    contactNumbers: { type: [String], required: true }, // Array of contact numbers
    notes: { type: String, required: false }            // description or notes about the supplier
},
{ collection: "suppliers" });

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
