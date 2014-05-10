module.exports = {
	registration: function(req, res) {
		if( req.session.user) { return res.redirect('/') };
		res.view("registration");
	},
	registrationPost: function(req, res) {
		if( req.session.user) { return };
		var __ = res.i18n
			,validate = require('../../lib/helpers').validate;

		if( (req.body.user.password != req.body.user.confirmPassword)) {
			return res.json({ status: false, message: __('passwords_dont_mutch') } );
		}
		Users.create(req.body.user)
		.exec(function(err, user) {
			res.json( { status: ! err, message: __(err ? validate(err) : '') } )
		})
	},
	login: function(req, res) {
		if( req.session.user) { return res.redirect('/') };
		res.view("login");
	},
	loginPost: function(req, res) {
		if( req.session.user) { return };
		var bcrypt = require('bcrypt')
			, __ = res.i18n;
		Users.findOneByUsername(req.param('username'), function (err, user) {
			if (err) { return res.json({ status: false, message: __('user_find_error') }) };
			if (user) {
				var match = bcrypt.compareSync(req.param('password'), user.password);
				if (match) {
					req.session.user = user.id;
					req.session.username = user.username;
					res.json( { status: true });
				}
				else {
					res.json( { status: false, message: __('invalid_password') });
				}
			} else {
				res.json( { status: false, message: __('user_not_found')});
			}
		});


	},
	logout: function (req, res) {
		req.session.destroy();
		res.redirect('/');
	},
	
	_config: {}
};
