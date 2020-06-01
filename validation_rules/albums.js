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
	body('photo_ids').isArray().custom(async (values, {req}) => {
		if (!values.every(Number.isInteger)) {
			return Promise.reject('Invalid value in array.');
		}
	
		for (let i = 0; i < values.length; i++) {
			const photo = await new models.Photo({ id: values[i] }).where({ 'user_id': req.user.data.id }).fetch();
	
			if (!photo) {
				return Promise.reject(`Photo ${values[i]} does not exist.`)
			}
		}
	})
 ];

module.exports = {
	createNewAlbumRules,
	updateAlbumRules,
	addPhotoToAlbumRules
}