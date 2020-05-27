/**
 * Photo Controller
 */

const models = require('../models');

// Show index of all photos
// GET /photos
const index = async (req, res) => {
	const userId = req.user.data.id;

	let photos = null;
	try {
		photos = await models.Photo.where('user_id', userId).fetchAll();
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
	const userId = req.user.data.id;

	let photo = null;
	try {
		photo = await new models.Photo({ id: req.params.photoId }).where('user_id', userId).fetch({ withRelated: 'albums' });
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

module.exports = {
	index,
	show,
}