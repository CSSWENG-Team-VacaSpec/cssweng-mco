const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileEditController.js');
const upload = require('../middlewares/upload_pfp');

router.get('/profile', controller.renderPage);
router.post('/edit-profile-details', controller.editProfileDescription);
router.post('/changePassword', controller.changePassword);
router.post('/change-profile-picture', upload.single('pfp-upload'), controller.changeProfilePicture);
router.get('/pfp', controller.getProfilePicture);


module.exports = router;