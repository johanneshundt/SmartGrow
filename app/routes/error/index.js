const controller = require('../../controller');
const router = require('express').Router();

router.get('/500', controller.error._500);
router.get('/404', controller.error._404);

module.exports = router