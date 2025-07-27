const bcrypt = require('bcrypt');
const EmployeeAccount = require('../models/employeeAccounts');


exports.renderPage = async (req, res) => {
    try {
        res.render('profileEdit', {
            layout: 'form',
            script: 'profileEdit',
            stylesheet: 'profileEdit',
            page: 'profile-edit',
            title: 'Edit your profile',
            user: req.session.user
        });
    } catch (error) {
        console.error('Could not load profile editor.', error);
    }
};

exports.editProfileDescription = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user;

        const {
            'first-name': firstName,
            'last-name': lastName,
            'mobile-number': mobileNumber,
            email,
            bio
        } = req.body;

        if (!firstName || !lastName || !mobileNumber) {
        return res.status(400).send("First name, last name, and mobile number are required.");
         }

        const phonePattern = /^0\d{10}$/; //checking of profile mobile number
        if (!phonePattern.test(mobileNumber)) {
            return res.status(400).send("Invalid phone number. It must be 11 digits, start with 0, and contain no spaces or country code.");
        }

        const updateFields = {
            firstName,
            lastName,
            email,
            bio
        };

        if (mobileNumber !== userId) { //create new acc to update the acc and delete the old one since it has a new ID 
            const existing = await EmployeeAccount.findById(mobileNumber);
            if (existing) {
                return res.status(400).send("That phone number is already in use.");
            }

            const user = await EmployeeAccount.findById(userId);
            const updatedUser = new EmployeeAccount({
                ...user.toObject(),
                _id: mobileNumber,
                ...updateFields
            });

            await EmployeeAccount.deleteOne({ _id: userId });
            await updatedUser.save();
            req.session.user = updatedUser;

        } else {
            await EmployeeAccount.findByIdAndUpdate(userId, updateFields);
        }

        res.redirect(`/profile/${userId}`);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.session.user._id || req.session.user;
        const user = await EmployeeAccount.findById(userId);

        const {
            'current-password': currentPassword,
            'new-password': newPassword,
            'reenter-new-password': reenterPassword
        } = req.body;
        
        if (newPassword.length < 8) {
         return res.status(400).send("Your new password must be at least 8 characters long.");
        }   

        if (!user) return res.status(404).send("User not found");

        const passwordMatch = await bcrypt.compare(currentPassword, user.password); //check if current pw field matches user pw

        if (!passwordMatch) return res.status(400).send("Incorrect current password");

        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).send("New password must be different from current"); //check if new pw is the same with old pw
        }

        if (newPassword !== reenterPassword) return res.status(400).send("Passwords do not match"); //check new pw field and re-enterpw field

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        req.session.destroy((err) => {
            if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).send("Password changed but failed to log out");
        }
        res.redirect('/'); 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};