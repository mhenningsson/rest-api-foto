/**
 * User validation rules
 */
const { body } = require('express-validator');
const models = require('../models');

// Rules when creating new album
const createNewAlbumRules = [
	body('title').trim().isLength({ min: 2 }).exists()
];

// Rules when updating album
const updateAlbumRules = [
	body('title').trim().isLength({ min: 2 }).exists()
];

// Rules when adding photo to album
const addPhotoToAlbumRules = [
	body('photo_id').custom(value => new models.Photo({ id: value }).fetch())
 ];

module.exports = {
	createNewAlbumRules,
	updateAlbumRules,
	addPhotoToAlbumRules
}