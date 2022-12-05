const controller = require('../../controller');
const router = require('express').Router();

//SETTINGS
router.get('/settings', controller.modal.settings.index);
router.get('/settings/schedule', controller.modal.settings.schedule);
router.get('/settings/layout', controller.modal.settings.layout);
router.get('/settings/widgets', controller.modal.settings.widgets);
//SETTINGS -> INVENTORY
router.get('/settings/inventory', controller.modal.settings.inventory.index);
router.get('/settings/inventory/place', controller.modal.settings.inventory.place);
router.get('/settings/inventory/light', controller.modal.settings.inventory.light);
router.get('/settings/inventory/fan', controller.modal.settings.inventory.fan);
router.get('/settings/inventory/exhaust', controller.modal.settings.inventory.exhaust);
router.get('/settings/inventory/filter', controller.modal.settings.inventory.filter);
router.get('/settings/inventory/pot', controller.modal.settings.inventory.pot);
router.get('/settings/inventory/soil', controller.modal.settings.inventory.soil);
router.get('/settings/inventory/fertilizer', controller.modal.settings.inventory.fertilizer);
router.get('/settings/inventory/water', controller.modal.settings.inventory.water);

//OTHERS
router.get('/costs', controller.modal.costs);
router.get('/stadium/:stadium', controller.modal.stadium);
router.get('/camera', controller.modal.camera);
router.get('/pot/:pot', controller.modal.pot);
router.get('/plant/:plant', controller.modal.plant);

module.exports = router