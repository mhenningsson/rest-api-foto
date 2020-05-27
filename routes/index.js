const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
	res.send({status: 'Hello there from index.js!'});
});

// Ability to login
router.post('/login', (req, res) => {
	res.send({data: 'login'})
})

// Ability to register new user
router.post('/register', (req, res) => {
	res.send({data: 'register'})
});

// Routes
router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'));


module.exports = router;
