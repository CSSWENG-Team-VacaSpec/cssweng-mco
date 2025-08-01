const Supplier = require('../models/suppliers');

exports.renderPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const supplier = await Supplier.findOne({
            _id: req.params.id
        }).lean();

        res.render('supplier', {
            layout: 'main',
            stylesheet: 'profile',
            script: 'profile_supplier',
            title: supplier.companyName || '',
            page: 'supplier',
            user: req.session.user,
            supplier: supplier
        });
    } catch (error) {
        console.error('Error loading supplier page:', error);
        res.status(500).send('Server Error: Unable to load supplier.');
    }
};