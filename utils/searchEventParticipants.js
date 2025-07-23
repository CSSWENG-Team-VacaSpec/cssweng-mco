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

    const enrich = (arr, type) =>
        arr.map(p => ({
            ...p,
            fullName: `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim(),
            type
        }));

    const enrichedMembers = enrich(employees, 'member');
    const enrichedSuppliers = enrich(suppliers, 'supplier');

    const fuse = new Fuse([...enrichedMembers, ...enrichedSuppliers], {
        keys: ['firstName', 'lastName', 'email', '_id', 'fullName'],
        threshold: 0.4
    });

    const results = fuse.search(query).map(r => r.item);
    return {
        members: results.filter(p => p.type === 'member'),
        suppliers: results.filter(p => p.type === 'supplier')
    };
}

module.exports = searchEventParticipants;
