const controller = require('../../controller');
const router = require('express').Router();

router.get('/test', controller.api.public.test);

module.exports = router