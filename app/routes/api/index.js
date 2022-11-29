const controller = require('../../controller');
const router = require('express').Router();

router.get('/search/strain', controller.api.public.searchStrain);

module.exports = router