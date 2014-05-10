module.exports = {
	joinPost: function(req, res) {
		if( ! req.session.user) { return };
		var __ = res.i18n;
		req.session.started = undefined;
		req.session.game = undefined;
		function update_game(game) {
			game.player_two = req.session.user;
			game.save(function(err, game) {})
		};
		Game.findOne({
			id: req.body.game_id
		}).exec(function(err, game) {
			if(game) { req.session.game = game.id };
			res.json({ status: ! err && game, message: __(game ? (err? 'Error please try later' : update_game(game)) : 'Invalid game id')  })
		})
	},
	start: function(req, res) {
		if( ! req.session.user) { return res.redirect('/') };
		if( req.session.started && req.session.game ) {
			Game.publishUpdate(req.session.game , { close: true });
			// Game.update({ id: req.session.game },{
			// 	winner: 0
			// }, function(err, game){});
			req.session.started = undefined;
			req.session.game = undefined;
		};
		req.session.started = true;
		if(! req.session.game) {
			Game.create({ player_one: req.session.user, que: req.session.user })
			.exec(function(err, game) {
				req.session.game = game.id;
				req.session.que = req.session.user;
				res.view('start', { game: req.session.game } );
			});
		}
		else {
			Game.publishUpdate(req.session.game , { playerJoin: req.session.user });
			res.view('start', { game: req.session.game } );
		}
	},
	roomPost: function(req, res) {
		if( ! req.session.user || ! req.session.game ) { return };
		Game.findOne(req.session.game, function (err, game) {
			Game.subscribe(req.socket, game);
			res.json({ player: (req.session.user == game.player_one ? 'player_one' : 'player_two' ) })
		});
	},

	startGamePost: function(req, res) {
		if( ! req.session.user || ! req.session.game ) { return };
		Game.publishUpdate(req.session.game , { change: true });
	},

	endPost: function(req, res) {
		if( ! req.session.user || ! req.session.game ) { return };
		Game.publishDestroy(req.session.game);
		var winner = req.session.username;
		Game.update({ id: req.session.game },{
			winner: winner
		}, function(err, game){});
	},
	addHighscorePost: function(req, res) {
		if( ! req.session.user || ! req.session.game ) { return };
		var time = req.body.time;
		Game.update({ id: req.session.game },{
			time: time
		}, function(err, game){
			res.json({status:true})
		});
	},
	highscore: function(req, res) {
		Game.find()
		.where({ time: { '>': 0 }})
		.limit(10)
		.sort('time DESC')
		.exec(function(err, game) {
			res.render('highscore', { highscore: game });
		});
	},	
	_config: {}
};
