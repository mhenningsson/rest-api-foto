/**
 * Album Controller
 */
const { validationResult, matchedData } = require('express-validator');
const models = require('../models');

// Show index of all albums
// GET /albums
const index = async (req, res) => {
	const userId = req.user.data.id;

	let albums = null;
	try {
		albums = await models.Album.where('user_id', userId).fetchAll();
	} catch (error) {
		console.error(error)
		res.sendStatus(404);
		return;
	}

	res.send({
		status: 'success',
		data: {
			albums,
		}
	});
};

// Show specific album
// GET /albums/:albumId
const show = async (req, res) => {
	const userId = req.user.data.id;

	let album = null;
	try {
		album = await new models.Album({ id: req.params.albumId }).where('user_id', userId).fetch({ withRelated: 'photos' });
	} catch (error) {
		console.error(error)
		res.sendStatus(404);
		return;
	}

	res.send({
		status: 'success',
		data: {
			album,
		}
	});
};

// Store new album
// POST /albums
const store = async (req, res) => {
	const userId = req.user.data.id;

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

	const newAlbum = {
		title: validData.title,
		user_id: userId
	}

	try {
		const album = await models.Album.forge(newAlbum).save();
		console.log('Successfully created new album: ', album);

		res.send({
			status: 'success',
			data: {album}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Sorry, something went wrong while trying to store new album.'
		});
		throw error;
	}
}

// Update albums attribute
// PUT /albums/:albumId
const update = async (req, res) => {
	const userId = req.user.data.id;

	// Query db for album
	let albumDb = null;
	try {
		albumDb = await new models.Album({ id: req.params.albumId}).where({ 'user_id': userId }).fetch();
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
		const album = await albumDb.save(validData);
		console.log('Successfully updated album: ', album);

		res.send({
			status: 'success',
			data: {album}
		})

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Sorry, something went wrong while trying to store new album.'
		});
		throw error;
	}
}

// Add photo to album
// POST /albums/:albumId/photos
const addPhoto = async (req, res) => {
	// Check if validation failed
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({ 
			status: 'fail',
			data: errors.array()
		});
		return;
	}

	let photoId = req.body.photo_id;

	// Get photo and album for specific user and add photo to album
	try {
		const photo = await new models.Photo({ id: photoId }).where({'user_id': req.user.data.id }).fetch();

		const album = await new models.Album({ id: req.params.albumId }).where({ 'user_id': req.user.data.id }).fetch();

		const result = await album.photos().attach(photo);

		res.status(201).send({
			status: 'success',
			data: result,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error', 
			data: 'Error when trying to add photo to album.'
		});
		throw error;
	}
}

module.exports = {
	index,
	show,
	store,
	update,
	addPhoto
}