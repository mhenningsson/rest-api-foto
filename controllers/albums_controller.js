/**
 * Album Controller
 */

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

module.exports = {
	index,
	show,
}