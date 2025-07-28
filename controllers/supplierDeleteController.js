const Supplier = require('../models/suppliers');   

exports.renderPage = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role?.trim() !== 'Manager') {
            return res.redirect('/login'); 
        }
        
        const suppliers = await Supplier.find({ status: 'active' }).lean();
        
        res.render('supplierDelete', {
            layout: 'form',
            script: 'supplierDelete',
            title: 'Delete suppliers',
            page: 'supplier-delete',
            user: req.session.user,
            suppliers: suppliers
        });
    } catch (error) {
        console.error('Could not load supplier deletion page.');
    }
}

exports.deleteSupplier = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role?.trim() !== 'Manager') {
            return res.status(403).send('Unauthorized');
        }

        console.log('BODY:', req.body);

        const supplierIds = req.body.supplierIds;
        if (!Array.isArray(supplierIds) || supplierIds.length === 0) {
            return res.status(400).send('No suppliers selected');
        }

        await Supplier.updateMany(
            { _id: { $in: supplierIds } },
            { $set: { status: 'inactive' } } 
        );

        res.redirect('/teamList');
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).send('Failed to delete supplier');
    }
};