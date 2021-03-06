const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const router = Router();

const quoteController = require('../controller/dislocation_controller');

router.post('/', quoteController.GetDislocation);

module.exports = router;