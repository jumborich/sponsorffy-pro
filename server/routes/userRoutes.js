const {Router} = require('express')
const router = Router();
const {updatePassword} = require('../controllers/authController');
const { updateMe, deleteMe, getMe } = require('../controllers/userController');

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// router.route('/').get(getAllUsers)
// .post(createUser);

// FOR USE BY SPONSORFY TEAM ONLY AND NOT USERS LOGGED IN
// router.route('/:id').get(getUser).delete(deleteUser);
// .get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
