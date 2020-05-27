/**
 * Auth Controller
 */
const bcrypt = require('bcrypt');
const { matchedData, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const models = require('../models');

// Login user
// POST /login
const login = async (req, res) => {
	const user = await models.User.login(req.body.email, req.body.password);

	if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authentication Required.'
		})
	};

	// Create payload
	const payload = {
		data: {
			id: user.get('id'),
			email: user.get('email'),
		}
	};

	// Sign payload, get accsess-token
	const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1d'});

	res.send({
		status: 'success',
		data: {
			token,
		}
	});
};

module.exports = {
	login,
}