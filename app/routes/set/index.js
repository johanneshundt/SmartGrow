const controller = require('../../controller');
const router = require('express').Router();

//TOGGLES
router.get('/fan', controller.set.arduino.toggleFan);
router.get('/exhaust', controller.set.arduino.toggleExhaust);
router.get('/water', controller.set.arduino.toggleWater);
router.get('/light', controller.set.arduino.toggleLight);

//SET DB DATA
router.post('/settings/:settings', controller.set.settings);
router.post('/layout/:layout', controller.set.layout);
router.post('/plant/:plant/history/:type', controller.set.plantHistory);
router.post('/plant/:plant', controller.set.plant);

router.delete('/plant/:plant/history/:id', controller.set.removePlantHistory);

module.exports = router