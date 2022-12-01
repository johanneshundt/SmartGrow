const controller = require('../../controller');
const router = require('express').Router();

router.get('/costs', controller.modal.costs);
router.get('/settings', controller.modal.settings);
router.get('/settings/schedule', controller.modal.schedule);
router.get('/settings/layout', controller.modal.layout);
router.get('/settings/widgets', controller.modal.widgets);
router.get('/camera', controller.modal.camera);
router.get('/pot/:pot', controller.modal.pot);
router.get('/plant/:plant', controller.modal.plant);

module.exports = router