const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const validationRules = require('../validation_rules/user');

// Get all photos
router.get('/', photoController.index);

// Get specific photo
router.get('/:photoId', photoController.show);

// Store new photo
router.post('/', validationRules.createNewPhotoRules, photoController.store);

// Update photo
router.put('/:photoId', validationRules.updatePhotoRules,  photoController.update);

// Delete specific photo
// router.delete('/:photoId', photoController.destroy);

module.exports = router;