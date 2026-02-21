const User = require('../models/User');
const Post = require('../models/Post');

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ user: req.user, posts });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const update = { name: req.body.name, bio: req.body.bio };
    if (req.file) update.avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// DELETE /api/profile
exports.deleteAccount = async (req, res) => {
  try {
    await Post.deleteMany({ author: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
