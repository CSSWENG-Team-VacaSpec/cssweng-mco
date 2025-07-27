const Supplier = require('../models/suppliers');   

exports.renderPage = async (req, res) => {
    try {
        const suppliers = await Supplier.find({}).lean();
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
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).send('Failed to delete team supplier');
    }
};
