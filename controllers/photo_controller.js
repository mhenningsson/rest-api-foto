/**
 * Photo Controller
 */
const { validationResult, matchedData } = require('express-validator');
const models = require('../models');

// Show index of all photos
// GET /photos
const index = async (req, res) => {
	let photos = null;
	try {
		photos = await models.Photo.where('user_id', req.user.data.id).fetchAll();
	} catch (error) {
		res.status(404).send({
			status: 'fail',
			data: 'Sorry, could not find any photos for this user.'
		});
		return;
	}

	res.status(200).send({
		status: 'success',
		data: {
			photos,
		}
	});
};

// Show specific photo
// GET /photos/:photoId
const show = async (req, res) => {
	let photo = null;
	try {
		photo = await new models.Photo({ id: req.params.photoId }).where('user_id', req.user.data.id).fetch({ withRelated: 'albums' });
	} catch (error) {
		res.status(404).send({
			status: 'fail',
			data: 'Sorry, could not find photo for this user.'
		});
		return;
	}

	res.status(200).send({
		status: 'success',
		data: {
			photo,
		}
	});
};

// Store new photo
// POST /photos
const store = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({ 
			status: 'fail',
			data: errors.array()
		});
		return;
	}

	const validData = matchedData(req);

	const newPhoto = {
		title: validData.title,
		url: validData.url,
		comment: validData.comment,
		user_id: req.user.data.id
	}

	try {
		const photo = await models.Photo.forge(newPhoto).save();

		res.status(200).send({
			status: 'success',
			data: {photo}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Error when trying to store new photo.'
		});
		throw error;
	}
}

// Update photos attribute
// PUT /photos/:photoId
const update = async (req, res) => {
	let photoDb = null;
	try {
		photoDb = await new models.Photo({ id: req.params.photoId}).where({ 'user_id': req.user.data.id }).fetch();
	} catch (error) {
		res.status(404).send({
			status: 'fail',
			data: 'Sorry, could not find photo for this user.'
		});
		return;
	}

	// Check if validation failed
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({ 
			status: 'fail',
			data: errors.array()
		});
		return;
	}

	const validData = matchedData(req);

	try {
		const photo = await photoDb.save(validData);

		res.status(200).send({
			status: 'success',
			data: {photo}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Error when trying to update photo.'
		});
		throw error;
	}
}

// Delete a photo
// DELETE /photos/:photoId
const destroy = async (req, res) => {
		try {
			const photo = await new models.Photo({ id: req.params.photoId}).where({ 'user_id': req.user.data.id }).fetch({ withRelated: 'albums'});

			photo.albums().detach();
			
			photo.destroy();

			res.status(200).send({
				status: 'success',
				data: 'Photo successfully deleted.'
			})

		} catch (error) {
			res.status(500).send({
				status: 'error', 
				data: 'Error when trying to delete photo.'
			});
			throw error;
		}
}

module.exports = {
	index,
	show,
	store,
	update,
	destroy
}