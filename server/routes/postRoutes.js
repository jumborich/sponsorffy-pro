const {Router} = require('express');
const router = Router();
const upvoteRouter = require('./upvoteRoutes');
const {checkMediaID, multerPostUploads, processMedia} = require('../utils/handleMedia');
const { getAllPosts, createPost, getPost, uploadMedia } = require('../controllers/postController');


router.route('/').get(getAllPosts).post(createPost)

router.route('/:id').get(getPost)

// Below is for merging post and upvote routes: CREATE UPVOTE ON POST
router.use('/:postId/upvotes', upvoteRouter);

router.post("/media/upload", checkMediaID, multerPostUploads(), processMedia, uploadMedia)

module.exports = router;
