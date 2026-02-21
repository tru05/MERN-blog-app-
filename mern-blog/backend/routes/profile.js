const router = require('express').Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/profileController');

router.get('/', protect, getProfile);
router.put('/', protect, upload.single('avatar'), updateProfile);
router.delete('/', protect, deleteAccount);

module.exports = router;
