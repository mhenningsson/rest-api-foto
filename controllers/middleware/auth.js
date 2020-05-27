/**
 * Auth Middleware
 */
const jwt = require('jsonwebtoken');
const { getTokenFromHeaders } = require('../auth_controller');

const validateJwtToken = async (req, res, next) => {
	const token = getTokenFromHeaders(req);

	if (!token) {
		res.status(401).send({
			status: 'fail',
			data: 'No token found in request headers.',
		});
	}

	// Validate token, extract payload
	let payload = null;
	try {
		payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
	} catch (error) {
		res.status(403).send({
			status: 'fail',
			data: 'Authentication Failed.'
		})
		throw error;
	}

	// Attach payload to request.user
	req.user = payload;
	next();
}

module.exports = {
	validateJwtToken,
}