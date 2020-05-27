/**
 * User model
 */
const bcrypt = require('bcrypt');

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
		album() {
			return this.belongsToMany('Album');
		},
		photo() {
			return this.belongsToMany('Photo');
		}
	}, {
		hashSaltRounds: 10,

		login: async function(email, password) {
			// check if user exists
			const user = await new this({email}).fetch({require: false});
			if (!user) {
				return false;
				};

			// get hashed password from db
			const hash = user.get('password');

			// compare new hash with db, return if match
			return (await bcrypt.compare(password, hash))
			? user
			: false;
		}
	});
};