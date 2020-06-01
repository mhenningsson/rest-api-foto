const express = require('express');
const router = express.Router();
const auth = require('../controllers/middleware/auth');
const authController = require('../controllers/auth_controller');
const validationRules = require('../validation_rules/user');

/* GET home page. */
router.get('/', (req, res, next) => {
	res.send({status: 'Hello! You need to login or register a new user.'});
});

// Ability to login
router.post('/login', authController.login);

// Ability to register new user
router.post('/register', [validationRules.createUserRules], authController.register);

// Routes
router.use('/albums', [auth.validateJwtToken], require('./albums'));
router.use('/photos', [auth.validateJwtToken], require('./photos'));


module.exports = router;
