module.exports.validator = {
	password: {
		minLength: 'password_minLength_err',
		maxLength: 'password_maxLength_err',
		required: 'password_field_required'
	},
	username: {
		minLength: 'username_minLength_err',
		maxLength: 'username_maxLength_err',
		required: 'username_field_required',
		unique: 'user_already_exist',
	},
	unhandled: {
		unhandled: 'unknown_error'
	}
};