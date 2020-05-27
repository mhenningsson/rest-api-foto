const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');

// Get all photos
router.get('/', photoController.index);

// Get specific photo
router.get('/:photoId', photoController.show);

// Store new photo
router.post('/', photoController.store);

// Delete specific photo
// router.delete('/:photoId', photoController.destroy);

module.exports = router;