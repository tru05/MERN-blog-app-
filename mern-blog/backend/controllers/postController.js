const Post = require('../models/Post');

// GET /api/posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// GET /api/posts/:id
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'Title and body required' });
    const post = await Post.create({
      title, body,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      author: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar
    });
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    post.title = req.body.title || post.title;
    post.body = req.body.body || post.body;
    if (req.file) post.image = `/uploads/${req.file.filename}`;
    await post.save();
    res.json(post);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ text: req.body.text, author: req.user._id, authorName: req.user.name, authorAvatar: req.user.avatar });
    await post.save();
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// PUT /api/posts/:id/comments/:commentId
exports.updateComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    comment.text = req.body.text;
    await post.save();
    res.json(post);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// DELETE /api/posts/:id/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    comment.deleteOne();
    await post.save();
    res.json(post);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
