/**
 * Album Controller
 */
const { validationResult, matchedData } = require('express-validator');
const models = require('../models');

// Show index of all albums
// GET /albums
const index = async (req, res) => {
	let albums = null;
	try {
		albums = await models.Album.where('user_id', req.user.data.id).fetchAll();
	} catch (error) {
		res.status(404).send({
			status: 'fail',
			data: 'Sorry, could not find any albums for this user.'
		});
		return;
	}

	res.status(200).send({
		status: 'success',
		data: {
			albums,
		}
	});
};

// Show specific album
// GET /albums/:albumId
const show = async (req, res) => {
	let album = null;
	try {
		album = await new models.Album({ id: req.params.albumId }).where('user_id', req.user.data.id).fetch({ withRelated: 'photos' });
	} catch (error) {
		res.status(404).send({
			status: 'fail',
			data: 'Sorry, could not find album for this user.'
		});
		return;
	}

	res.status(200).send({
		status: 'success',
		data: {
			album,
		}
	});
};

// Store new album
// POST /albums
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

	const newAlbum = {
		title: validData.title,
		user_id: req.user.data.id,
	}

	try {
		const album = await models.Album.forge(newAlbum).save();

		res.status(200).send({
			status: 'success',
			data: {album}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Error when trying to store new album.'
		});
		throw error;
	}
}

// Update albums attribute
// PUT /albums/:albumId
const update = async (req, res) => {
	let albumDb = null;
	try {
		albumDb = await new models.Album({ id: req.params.albumId}).where({ 'user_id': req.user.data.id }).fetch();
	} catch (error) {
		res.status(404).send({
			status: 'fail',
			data: 'Sorry, could not find album for user.'
		});
		return;
	}

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
		const album = await albumDb.save(validData);

		res.status(200).send({
			status: 'success',
			data: {album}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Error when trying to store new album.'
		});
		throw error;
	}
}

// Add photo to album
// POST /albums/:albumId/photos
const addPhoto = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({ 
			status: 'fail',
			data: errors.array()
		});
		return;
	}

	const validData = matchedData(req);

	let photoIds = false;
	if (validData.photo_ids) {
		photoIds = validData.photo_ids
	}
	
	try {
			const album = await new models.Album({ id: req.params.albumId }).where({ 'user_id': req.user.data.id }).fetch();

			const result = await album.photos().attach(photoIds);

		res.status(201).send({
			status: 'success',
			data: [...result]
		});

	} catch (error) {
		res.status(500).send({
			status: 'error', 
			data: 'Error when trying to add photo to album.'
		});
		throw error;
	}
}

// Delete an album
// DELETE /albums/:albumId
const destroy = async (req, res) => {
	try {
		const album = await new models.Album({ id: req.params.albumId}).where({ 'user_id': req.user.data.id }).fetch({ withRelated: 'photos'});

		album.photos().detach();
		
		album.destroy();

		res.status(200).send({
			status: 'success',
			data: 'Album successfully deleted.'
		})

	} catch (error) {
		res.status(500).send({
			status: 'error', 
			data: 'Error when trying to delete album.'
		});
		throw error;
	}
};

// Remove photo from album
// DELETE /albums/:albumId/photos/:photoId
const removePhoto = async (req, res) => {
	try {
		const photo = await new models.Photo({ id: req.params.photoId }).where({'user_id': req.user.data.id }).fetch({ withRelated: 'albums'});

		const album = await new models.Album({ id: req.params.albumId }).where({ 'user_id': req.user.data.id }).fetch({ withRelated: 'photos' });

		album.photos().detach(photo);

		res.status(200).send({
			status: 'success',
			data: 'Photo successfully removed from album.',
		});

	} catch (error) {
		res.status(500).send({
			status: 'error', 
			data: 'Error when trying to remove photo from album.'
		});
		throw error;
	}
}

module.exports = {
	index,
	show,
	store,
	update,
	addPhoto,
	destroy,
	removePhoto
}