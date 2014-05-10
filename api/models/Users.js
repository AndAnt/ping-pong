/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

function hash_password(attrs, next) {
	if(!attrs.password) {
		return next();
	}
    var bcrypt = require('bcrypt');
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(attrs.password, salt, function(err, hash) {
            if (err) return next(err);
            attrs.password = hash;
            next();
        });
    });
};

module.exports = {
    tableName: 'users',
    adapter: 'mysql-adapter',
	attributes: {
		id: {
			type: 'integer',
			autoIncrement: true,
			primaryKey: true
		},
		username: {
			type: 'string',
			minLength: 3,
			maxLength: 25,
			required: true,
			unique: true
		},
		password: {
			type: 'string',
			required: true,
			minLength: 6,
			maxLength: 50
		}
	},
    beforeCreate: hash_password
};
