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
		console.error(error)
		res.sendStatus(404);
		return;
	}

	res.send({
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
		console.error(error)
		res.sendStatus(404);
		return;
	}

	res.send({
		status: 'success',
		data: {
			photo,
		}
	});
};

// Store new photo
// POST /photos
const store = async (req, res) => {
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

	const newPhoto = {
		title: validData.title,
		url: validData.url,
		comment: validData.comment,
		user_id: req.user.data.id
	}

	try {
		const photo = await models.Photo.forge(newPhoto).save();
		console.log('Successfully created new photo: ', photo);

		res.send({
			status: 'success',
			data: {photo}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Sorry, something went wrong while trying to store new photo.'
		});
		throw error;
	}
}

// Update photos attribute
// PUT /photos/:photoId
const update = async (req, res) => {
	// Query db for photo
	let photoDb = null;
	try {
		photoDb = await new models.Photo({ id: req.params.photoId}).where({ 'user_id': req.user.data.id }).fetch();
	} catch (error) {
		console.error(error)
		res.sendStatus(404);
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
		console.log('Successfully updated photo: ', photo);

		res.send({
			status: 'success',
			data: {photo}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Sorry, something went wrong while trying to update photo.'
		});
		throw error;
	}
}

// Delete a photo
// DELETE /photos/:photoId
const destroy = async (req, res) => {
		try {
			const photo = await new models.Photo({ id: req.params.photoId}).where({ 'user_id': req.user.data.id }).fetch({ withRelated: 'albums'});

			// detach photos from assocciated albums
			photo.albums().detach();
			
			// delete photo from db
			photo.destroy();

			res.status(204).send({
				status: 'success',
				data: 'Photo deleted successfully.'
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