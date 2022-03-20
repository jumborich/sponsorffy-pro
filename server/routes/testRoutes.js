const {Router} = require('express');
const router = Router();
const testController = require('../controllers/testController');

// For currently logged in user's consumption
router.get('/getUserSavedAns', testController.getUserSavedAns) //Gets a previously taken test
router.get('/getAllTests', testController.getAllTests);//Gets all the user's previously taken tests
router.get('/getNewTest', testController.getNewTest); //Gets the user a fresh test to take

// router.post('/createNewTest', testController.createNewTest);
router.post("/markTest",testController.markTest)

router.patch("/updateTest", testController.uploadTestMedia, testController.updateTest) //updates the answers for a given test

// Below is only to be used by the sponsorfy team
// router.route('/').get(testController.getAllUsersTests);
// router.route('/:id').get(testController.getUserTest).delete(testController.deleteUserTest);

module.exports = router;
