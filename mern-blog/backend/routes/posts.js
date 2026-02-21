const router = require('express').Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getAllPosts, getPost, createPost, updatePost, deletePost,
  addComment, updateComment, deleteComment
} = require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/:id', getPost);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

router.post('/:id/comments', protect, addComment);
router.put('/:id/comments/:commentId', protect, updateComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
