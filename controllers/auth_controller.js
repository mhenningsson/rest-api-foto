/**
 * Auth Controller
 */
const bcrypt = require('bcrypt');
const { matchedData, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const models = require('../models');

// Get token from HTTP headers
const getTokenFromHeaders = (req) => {
	// Check if auth header exists
   if (!req.headers.authorization) {
	   return false;
   }

   // Split authorization header into its pieces
   const [authType, token] = req.headers.authorization.split(' ');

   // Check that the authType is Bearer
   if (authType.toLowerCase() !== "bearer") {
	   return false;
   }
   return token;
};

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

// Register account
// POST /register
const register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({
			status: 'fail',
			data: errors.array()
		});
		return;
	}

	const validData = matchedData(req);

	// Hashing password
	try {
		validData.password = await bcrypt.hash(validData.password, models.User.hashSaltRounds);
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Error when trying to hash password'
		});
	};

	// Saving new user
	try {
		const user = await models.User.forge(validData).save();
		console.log('Successfully created new user: ', user);

		res.status(201).send({
			status: 'success',
			data: user
		})
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Error when trying to register new user.'
		});
		throw error;
	}
}

module.exports = {
	getTokenFromHeaders,
	login,
	register,
}