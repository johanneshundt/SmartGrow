const controller = require('../../controller');
const router = require('express').Router();

router.get('/fertilizer', controller.alert.fertilizer);
router.get('/plant/:plant/cut', controller.alert.cut);
router.get('/plant/:plant/measure', controller.alert.measure);
router.get('/plant/:plant/note', controller.alert.note);

module.exports = router