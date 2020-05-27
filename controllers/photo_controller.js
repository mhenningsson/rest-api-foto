/**
 * Photo Controller
 */

const models = require('../models');

// Show index of all photos
// GET /photos
const index = async (req, res) => {
	const all_photos = await models.Photo.fetchAll();

	res.send({
		status: 'success',
		data: {
			photos: all_photos
		}
	});
};

// Show specific photo
// GET /photos/:photoId
const show = async (req, res) => {
	const photo = await new models.Photo({ id: req.params.photoId })
		.fetch();

	res.send({
		status: 'success',
		data: {
			photo,
		}
	});
};

module.exports = {
	index,
	show,
}