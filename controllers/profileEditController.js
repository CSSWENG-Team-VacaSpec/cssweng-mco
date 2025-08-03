const bcrypt = require('bcrypt');
const EmployeeAccount = require('../models/employeeAccounts');

exports.renderPage = async (req, res) => {
    const user = await EmployeeAccount.findOne({
        _id: req.session.user._id
    }).lean();

    try {
        res.render('profileEdit', {
            layout: 'form',
            script: 'profileEdit',
            stylesheet: 'profileEdit',
            page: 'profile-edit',
            title: 'Edit your profile',
            user: user
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
            email,
            bio
        } = req.body;

         if (!firstName?.trim() || !lastName?.trim()) {
            return res.status(400).send("First name and last name are required.");
        }

        const updateFields = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email?.trim(),
            bio: bio?.trim()
        };

        // await EmployeeAccount.findByIdAndUpdate(userId, updateFields);
        

        // res.redirect(`/profile/${userId}`);

        const updatedUser = await EmployeeAccount.findByIdAndUpdate(
            userId, 
            updateFields,
            { new: true }
        ).lean();

        req.session.user.firstName = updatedUser.firstName;
        req.session.user.lastName = updatedUser.lastName;
        req.session.user.email = updatedUser.email;
        
        req.session.save(() => {
            res.redirect(`/profile/${userId}`);
        });

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

exports.changeProfilePicture = async (req, res) => {
  try {
    const userId = req.session.user._id || req.session.user;

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    await EmployeeAccount.findByIdAndUpdate(userId, {
      pfp: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    res.redirect(`/profile/${userId}`);
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    res.status(500).send("Server error");
  }
};



exports.getProfilePicture = async (req, res) => {
  try {
    const userId = req.session.user._id || req.session.user;

    const user = await EmployeeAccount.findById(userId).select('pfp');
    if (!user || !user.pfp || !user.pfp.data) {
      return res.status(404).send('Profile picture not found.');
    }

    res.set('Content-Type', user.pfp.contentType || 'image/png');
    res.send(user.pfp.data); 
  } catch (err) {
    console.error('Error retrieving profile picture:', err);
    res.status(500).send('Internal Server Error');
  }
};
