const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albums_controller');
const validationRules = require('../validation_rules/user');

// Get all albums
router.get('/', albumController.index);

// Get specific album
router.get('/:albumId', albumController.show);

// Store new album
router.post('/', validationRules.createNewAlbumRules, albumController.store);

// Update specific album
router.put('/:albumId', validationRules.updateAlbumRules, albumController.update);

// Add photo to album
router.post('/:albumId/photos', validationRules.addPhotoToAlbumRules, albumController.addPhoto);

// Delete specific album
router.delete('/:albumId', albumController.destroy);

// Delete specific photo from specific album
router.delete('/:albumId/photos/:photoId', albumController.removePhoto);


module.exports = router;