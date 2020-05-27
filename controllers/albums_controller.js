/**
 * Album Controller
 */

const models = require('../models');

// Show index of all photos
// GET /photos
const index = async (req, res) => {
	const all_albums = await models.Album.fetchAll();

	res.send({
		status: 'success',
		data: {
			albums: all_albums
		}
	});
};

// Show specific photo
// GET /photos/:photoId
const show = async (req, res) => {
	const album = await new models.Album({ id: req.params.albumId })
		.fetch();

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