//Model Object
var model = {
	boardSize : 7,
	numShips : 3,
	shipsSunk : 0,
	shipLength : 3,
	ships: [
		{ locations: ["0", "0", "0"], hits: ["", "", ""] },
		{ locations: ["0","0","0"], hits: ["", "", ""] },
		{ locations: ["0", "0", "0"], hits: ["", "", ""] }
	],
    
    // Method to figure out if the shot is a hit or miss
    fire : function(guess) {
    	for (var i = 0; i < this.numShips; i++) {
    		var ship = this.ships[i];
    		var index = ship.locations.indexOf(guess);
    		if (index >= 0) {
    			ship.hits[index] = "hit";
    			view.displayHit(guess);
    			view.displayMessage("HIT!");
    			if (this.isSunk(ship)) {
    				view.displayMessage("You sank my Battleship!");
    				this.shipsSunk++;
    			}
    			return true;
    		}
    	}
    	view.displayMiss(guess);
    	view.displayMessage("You Missed!");
    	return false;

    },

    // Checks if the ship has sunk
    isSunk : function(ship) {
    	for (var i = 0; i < this.shipLength; i++)
    	{
    		if(ship.hits[i] !== "hit")
    		{
    			return false;
    		}
    	}
    	return true;
    },

    // Generate 
    generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	// generates ship locations on the board randomly
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};
// view object
var view = {

	// takes a string message and displays it in the message area
	displayMessage : function (msg) {
		// body...
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	// sets the class of the element to hit
	displayHit : function (location) {
		// body...
		var cell = document.getElementById(location);
		cell.setAttribute("class","hit");
	},

	// sets the class of the elemnt to miss
	displayMiss : function (location) {
		// body...
		var cell = document.getElementById(location);
		cell.setAttribute("class","miss");
	}

};

// controller object
var controller = {
	guesses : 0,

	// process the player's guess
	processGuess : function(guess) {

	var location = parseGuess(guess);
	if (location) {
		this.guesses ++;
		var hit = model.fire(location);
		if (hit && model.shipsSunk === model.numShips) {
			view.displayMessage("You sank all my battleships, in" + this.guesses + "guesses");
		}

	}
}
};

// helper function to parse a guess from the user
function parseGuess(guess) {
	var alphabet = ["A","B","C","D","E","F","G"];
	if (guess == null || guess.length !==2){
		alert("Oops! please enter a letter and a number on the board")
	}
	else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Oops! that isn't on the board");
		}
		else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Oops! that's off the board");
		}

		else {
			return row + column;
		}
	}

	return null;
};

// event handlers

function handleFireButton()
{
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();
	console.log(guess);
	
	controller.processGuess(guess);

	guessInput.value = "";

}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

// init - called when the page has completed loading
window.onload = init;

function init() {
	var fireButton = document.getElementById("fireButton");
	// Fire! button onclick handler
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	// place the ships on the game board
	model.generateShipLocations();

	}


