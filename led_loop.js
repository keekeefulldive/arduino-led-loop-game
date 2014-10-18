// you need the johnny-five module to run this code
var five = require('johnny-five'),
	board = new five.Board(),
	leds = [],
	button,
	piezo,
	increment = 1,
	counter = 1,
	interval = 300,
	gameLoop;

// wait for the microcontroller to initialize
board.on('ready', function() {
	// get input and outputs
	button = new five.Button(12);
	piezo = new five.Piezo(13);
	for (var i = 0; i < 7; i++) {
		leds[i] = new five.Led(i + 2);
	}
	
	// start a (slow) game
	newGame(interval);
	
	// on button press
	button.on('down', function() {
		// stop the loop
		clearInterval(gameLoop);
		// play a little tone
		piezo.play({ song: ['F4', 1/32], tempo: 500 });
		
		// if they won...
		if (counter === 4) {
			// start a new (faster) game in 3 seconds
			setTimeout(function() {
				interval *= .8
				counter = 1;
				increment = 1;
				newGame(interval);
			}, 3000);
		// if they lost...
		} else {
			// play a little song
			piezo.play({
				 song: [
				  ["C4", 1/4],
				  ["D4", 1/4],
				  ["F4", 1/4],
				  ["D4", 1/4],
				  ["A4", 1/4],
				  [null, 1/4],
				  ["A4", 1],
				  ["G4", 1],
				  [null, 1/2],
				  ["C4", 1/4],
				  ["D4", 1/4],
				  ["F4", 1/4],
				  ["D4", 1/4],
				  ["G4", 1/4],
				  [null, 1/4],
				  ["G4", 1],
				  ["F4", 1],
				  [null, 1/2]
				],
				tempo: 100
			  });

		}
	});
});

// starts a new game going at an interval of freq milliseconds
function newGame(freq) {
	gameLoop = setInterval(function() {
		for (var i = 0; i < leds.length; i++) {
			leds[i].off();
		}
		counter += increment;
		leds[counter - 1].on();
		if (counter === 1 || counter === leds.length) {
			piezo.play({ song: ['C4', 1/32], tempo: 500 });
		}
		if (counter >= leds.length || counter <= 1) {
			increment = -increment;
		}
		
	}, freq);
}

