/**
 * User validation rules
 */
const { body } = require('express-validator');
const models = require('../models');

const createUserRules = [
	body('email').trim().isEmail().exists().custom(async value => {
		const user = await new models.User({ email: value }).fetch({ require: false });
		if (user) {
			return Promise.reject('Email already exists.');
		}

		return Promise.resolve();
	}),
	body('password').trim().isLength({ min: 4 }).withMessage('must be at least 4 chars long').exists(),
	body('first_name').trim().isLength({ min: 2 }).exists(),
	body('last_name').trim().isLength({ min: 2 }).exists(),
];

const createNewAlbumRules = [
	body('title').trim().isLength({ min: 2 }).exists()
];

const createNewPhotoRules = [
	body('title').trim().isLength({ min: 2 }).exists(),
	body('url').trim().isLength({ min: 2 }).exists(),
	body('comment').trim()
];

module.exports = {
	createUserRules,
	createNewAlbumRules,
	createNewPhotoRules
}