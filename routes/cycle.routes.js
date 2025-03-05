const express = require('express');
const router = express.Router();
const cycleController = require('../controller/cycleController');

// Cycle routes
router.post('/cycles', cycleController.createCycle);                  // Create a new cycle
router.get('/cycles/:cycleId', cycleController.getCycleById);         // Get a specific cycle by ID
router.get('/users/:userId/cycles', cycleController.getCyclesByUserId); // Get all cycles for a user
router.put('/cycles/:cycleId', cycleController.updateCycle);          // Update a specific cycle
router.delete('/cycles/:cycleId', cycleController.deleteCycle);       // Delete a specific cycle

// Symptom routes (nested under cycles)
router.post('/cycles/:cycleId/symptoms', cycleController.addSymptom);           // Add a symptom to a cycle
router.put('/cycles/:cycleId/symptoms/:symptomId', cycleController.updateSymptom); // Update a specific symptom
router.delete('/cycles/:cycleId/symptoms/:symptomId', cycleController.deleteSymptom); // Delete a specific symptom

module.exports = router;