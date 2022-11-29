const controller = require('../../controller');
const router = require('express').Router();

router.get('/settings', controller.modal.settings);
router.get('/camera', controller.modal.camera);
router.get('/schedule', controller.modal.schedule);
router.get('/pot/:pot', controller.modal.pot);
router.get('/plant/:plant', controller.modal.plant);

module.exports = router