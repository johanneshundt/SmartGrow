const controller = require('../../controller');
const router = require('express').Router();

router.get('/', controller.frontend.index);

module.exports = router