const User = require('../models/employeeAccounts');
const path = require('path');
const fs = require('fs');

exports.getProfilePicture = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id
        });
    
        if (user) {
            if (user.pfp.data === null || user.pfp.data === undefined) {
                const defaultPath = path.join(__dirname, '../public/common/user.png');
                const defaultPfp = fs.readFileSync(defaultPath);
                res.set('Content-Type', 'image/png');
                res.send(defaultPfp);
            } else {
                console.log(user.pfp.contentType);
                res.set('Content-Type', user.pfp.contentType || 'image/png');
                res.send(user.pfp.data);
            }
        } else {
            const defaultPath = path.join(__dirname, '../public/common/user.png');
            const defaultPfp = fs.readFileSync(defaultPath);
            res.set('Content-Type', 'image/png');
            res.send(defaultPfp);
        }
    } catch (e) {
        console.error('Could not get user profile picture. ', e);
        res.status(500).send('Internal Server Error.');
    }
};