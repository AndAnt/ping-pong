jQuery(document).ready(function($) {
	$('[data-socket="true"]').on("submit", function(e) {
		e.preventDefault();
		socket_request(
			$(this).attr('action'),
			$(this).serializeObject(),
			$( $(this).attr("rel") ),
			{
				before: preloader.bind( $(this), 'show' ),
				after: preloader.bind(this, 'hide')
			},
			$(this).attr('redirect')
		);
	});
});


var GAME = {}
	,ping = false
	,progressBarInterval
	time = undefined;

//px to %
function getPercent(elem){
	var width = elem.width();
	var parentWidth = elem.offsetParent().width();
	var percent = Math.round(100*width/parentWidth);
	return percent
};

function win() {
	time = new Date() - time;
	$('#time').val(time);
	socket.post('/game/end/', function (res) {});
	$('.addHightScores').css('display', 'block');
	return '<span class="win">You Win :)</span>';
}

function lose() {
	return '<span class="lose">You Lose :(</span>'
}

function progressBar(el) {
	clearInterval(progressBarInterval);
	elName = el;
	el = $('.'+el+' .progressbar');
	el.css('width', '100%');

	progressBarInterval = setInterval(function(){
		var width =  getPercent(el) - (100 / 30) + '%'
		el.css('width', width);
		if ( el.width() == 0 ) {
			clearInterval(progressBarInterval);
			$('.ping-pong').remove();
			$('#message').html(elName=='you' ? lose() : win());
		};
	}, 100)	

	// progressBarInterval = setInterval(function(){
	// 	var width = getPercent(el) - (1500/el.parent().width()) + '%';
	// 	el.css('width', width);
	// 	if ( el.width() == 0 ) {
	// 		clearInterval(progressBarInterval);
	// 		$('.ping-pong').remove();
	// 		$('#message').html(elName=='you' ? lose() : win());
	// 	};
	// }, 30)

};



GAME.playerJoin = function() {
	$('.ping-pong').css('display', 'block');
	$('.ping').css('z-index', '20');
	$('#message').html('');
};

GAME.close = function() {
	$('.ping-pong').css('display', 'none');
	$('#message').html('Connection Closed');
};

GAME.player = function() {
	$('.ping-pong').css('display', 'block');
	$('.pong').css('z-index', '20');
	$('#message').html('');
};

GAME.change = function() {
	if(!time) { time = new Date() }
	clearInterval(progressBarInterval);
	ping ? GAME.pong() : GAME.ping();
};

GAME.ping = function() {
	ping = true;
	$('.pong').css('z-index', '0');
	$('.ping').css('z-index', '20');
	progressBar('you');
};

GAME.pong = function() {
	ping = false;
	$('.pong').css('z-index', '20');
	$('.ping').css('z-index', '0');
	progressBar('opponent')
};


function startGame() {
	socket.on('connect', function () {
		socket.on('message', function (res) {
			console.log(res);
			GAME[Object.keys(res.data)[0]]();
		});
		socket.post('/game/room/', function (res) {
			if(res.player == 'player_two') {
				$('.ping-pong').css('display', 'block');
				$('.pong').css('z-index', '20');
				$('#message').html('');

			}
			else {
				$('#message').html('Waiting for opponent');
			}
			
		});
	});

	$('.ping').click(function(e) {
		ping = true;
		socket.post('/game/startGame/', function (res) {});
	});

};

