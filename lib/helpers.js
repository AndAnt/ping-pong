var helpers = {}
	,customValidator = require('../config/custom-validator').validator

helpers.uc = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

helpers.validate = function(error) {
	var message = []
		,db_errors = { 'ER_DUP_ENTRY': 'unique'	};

	if(!error.ValidationError) {
		error.ValidationError = {};
		var key = error.toString().match(/key\s'(.*?)'/i);
		error.ValidationError[(key ? key[1] : 'unhandled')] = [{'rule': (err_code = db_errors[(error['code'] ? error['code'] : 'unhandled')] || 'unhandled'), 'message': error}];
	};

	for(err in error.ValidationError) {
		for (var i = 0; i < error.ValidationError[err].length; i++) {
			var rule = error.ValidationError[err][i]['rule'];
			message.push( customValidator[err] ? customValidator[err][rule] || error.ValidationError[err][i]['message'] : error.ValidationError[err][i]['message'] );
		};
	};
	
	return(message.join(', ')); 
};

module.exports = helpers;
