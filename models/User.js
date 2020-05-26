/**
 * User model
 */
const bcrypt = require('bcrypt');

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
		albums() {
			return this.belongsToMany('Album');
		},
		photos() {
			return this.belongsToMany('Photos');
		}
	});
};