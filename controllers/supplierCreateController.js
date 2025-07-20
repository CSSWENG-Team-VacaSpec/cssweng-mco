const EmployeeAccount = require('../models/employeeAccounts');   // TODO: replace with a supplier model.
const { v4: uuidv4 } = require('uuid');

exports.renderPage = async (req, res) => {
    try {
        res.render('supplierCreate', {
            layout: 'form',
            script: 'memberSupplierCreate',
            title: 'Add supplier',
            page: 'supplier-create',
            user: req.session.user,
        });
    } catch (error) {

    }
}

exports.createSupplier = async (req, res) => {
    try {
    } catch (error) {
        console.error('Error adding supplier:', error);
        res.status(500).send('Failed to add supplier');
    }
};
