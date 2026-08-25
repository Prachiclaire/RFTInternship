const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addComment, getComments } = require('../controllers/commentController');

router.get('/:postId',          getComments);           // GET comments for a post (public)
router.post('/:postId', protect, addComment);           // ADD comment (auth required)

module.exports = router;