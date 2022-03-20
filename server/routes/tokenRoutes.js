const {Router} = require('express');
const router = Router();
const tokenController = require('../controllers/tokenController')

router.post('/buyTokens', tokenController.buyToken)
// router.get('/buyTokens', authController.protect, tokenController.buyToken)

module.exports = router;
