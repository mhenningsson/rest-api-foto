/**
 * User validation rules
 */
const { body } = require('express-validator');

// Rules when creating new photo
const createNewPhotoRules = [
	body('title').trim().isLength({ min: 2 }).exists(),
	body('url').trim().isLength({ min: 2 }).exists(),
	body('comment').trim()
];

// Rules when updating photo
const updatePhotoRules = [
	body('title').optional().trim().isLength({ min: 2 }),
	body('comment').optional().trim()
]


module.exports = {
	createNewPhotoRules,
	updatePhotoRules
}