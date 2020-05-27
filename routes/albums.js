const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albums_controller');

// Get all albums
router.get('/', albumController.index);

// Get specific album
router.get('/:albumId', albumController.show);

// Store new album
// router.post('/', albumController.store);

// Delete specific album
// router.delete('/:albumId', albumController.destroy);

module.exports = router;