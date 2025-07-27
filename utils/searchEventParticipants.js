const Fuse = require('fuse.js');
const Team = require('../models/teams');
const EmployeeAccount = require('../models/employeeAccounts');
const Supplier = require('../models/suppliers');

async function searchEventParticipants(eventId, query) {
    const team = await Team.findById(eventId).lean();
    if (!team) return { members: [], suppliers: [] };

    const employeeIds = [team.manager, team.programLead, ...team.teamMemberList];
    const supplierIds = team.supplierList;

    const employees = await EmployeeAccount.find({ _id: { $in: employeeIds } }, '-password').lean();
    const suppliers = await Supplier.find({ _id: { $in: supplierIds } }).lean();

    // Enrich employee data
    const enrichedMembers = employees.map(p => ({
        ...p,
        fullName: `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim(),
        type: 'member'
    }));

    // Enrich supplier data
    const enrichedSuppliers = suppliers.map(s => ({
        ...s,
        fullName: s.companyName,  // Needed for searching
        type: 'supplier'
    }));

    // Combine both for search
    const all = [...enrichedMembers, ...enrichedSuppliers];

    // Add `companyName` as searchable key
    const fuse = new Fuse(all, {
        keys: ['firstName', 'lastName', 'email', '_id', 'fullName', 'companyName'],
        threshold: 0.4
    });

    const results = fuse.search(query).map(r => r.item);
    return {
        members: results.filter(p => p.type === 'member'),
        suppliers: results.filter(p => p.type === 'supplier')
    };
}

module.exports = searchEventParticipants;
