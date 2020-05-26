const express = require('express');
const router = express.Router();

// Get all photos
router.get('/', (req, res) => {
	res.send({data: 'photos'})
});

// Get specific photo
router.get('/:photoId', (req, res) => {
	res.send({data: 'photos', id: req.params.photoId})
});

// Store new photo
router.post('/')

// Delete specific photo
router.delete('/:photoId')

module.exports = router;