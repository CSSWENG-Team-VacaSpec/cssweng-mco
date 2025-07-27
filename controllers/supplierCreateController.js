const Supplier = require('../models/suppliers');
const { v4: uuidv4 } = require('uuid');

exports.renderPage = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role?.trim() !== 'Manager') {
            return res.redirect('/login'); 
        }
        res.render('supplierCreate', {
            layout: 'form',
            script: 'memberSupplierCreate',
            title: 'Add supplier',
            page: 'supplier-create',
            user: req.session.user,
        });
    } catch (error) {
        console.error('Render error (supplier):', error);
        res.status(500).send('Failed to load supplier creation page');
    }
};

exports.createSupplier = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role?.trim() !== 'Manager') {
            return res.status(403).send('Unauthorized');
        }
        const { name, ['contact-info']: contactInfo, description } = req.body;

        const newSupplier = new Supplier({
            _id: uuidv4(),
            companyName: name,
            contactNames: [name],        // Single contact name for now
            contactNumbers: [contactInfo],
            notes: description,
        });

        await newSupplier.save();
        res.redirect('/teamList');
    } catch (error) {
        console.error('Error adding supplier:', error);
        res.status(500).send('Failed to add supplier');
    }
};
