const express = require('express');
const router = express.Router();

// Get all albums
router.get('/', (req, res) => {
	res.send({data: 'albums'})
})

// Get specific album
router.get('/:albumId', (req, res) => {
	res.send({data: 'album', id: req.params.albumId})
})

// Store new album
router.post('/')

// Delete specific album
router.delete('/:albumId')

module.exports = router;