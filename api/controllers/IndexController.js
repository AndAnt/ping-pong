module.exports = {
	index: function(req, res) {
		var user = req.session.user;
		 res.view( user ? "home/index" : "index" );
	},
	_config: {}
  
};
