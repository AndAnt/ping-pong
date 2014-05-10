/**
 * Game
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'game',
    adapter: 'mysql-adapter',
	attributes: {
		id: {
			type: 'integer',
			autoIncrement: true,
			primaryKey: true
		},
		player_one: {
			type: 'integer'
		},
		player_two: {
			type: 'integer'
		},
		winner: {
			type: 'string'
		},
		time: {
			type: 'integer'
		}
	}
};
