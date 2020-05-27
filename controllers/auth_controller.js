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

   // Check that the Authorization type is Bearer
   if (authType.toLowerCase() !== "bearer") {
	   return false;
   }
   return token;
}

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
	getTokenFromHeaders,
	login,
}