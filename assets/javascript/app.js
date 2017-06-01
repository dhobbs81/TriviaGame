//
// The CrystalsCollector Game
//
// The following Javascript implements the CrystalsCollector Game as 
// described in README.md. The game asks the player to accumulate 
// crystals to reach a total crystal value. The player wins if their total 
// score matches the random number generated at the beginning of the game. 
//

// Execute in strict mode as defined by the ECMAScript version 5 standard
"use strict";

//
// Returns a random integer between min (inclusive) and max (inclusive)
// Using Math.round() will give you a non-uniform distribution!
//
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


//
// Returns a jQuery object representing the main containing element
//
function getMain() {
	return $(".maincontainer");
}

//
// The game state is stored by a crystalsCollector object Game state includes 
// wins, losses, and the set of guesses input by the user
//
var crystalsCollector = { 
	//
	// Game state properties
	//
	wins: 			0,
	losses: 		0, 
	totalScore: 		0,
	currentScore: 	0,
	crystals: 		{ red: 0, blue: 0, yellow: 0, green: 0, },

	// 
	// The reset function returns this object to an initial state
	//
	reset: function() {
		// Generate a random totalScore in the range from 19 to 120 inclusive
		this.totalScore = getRandomInt(19, 120);
		// Generate random crystal value in the range from 1 to 12 inclusive
		this.crystals.red = getRandomInt(1, 12);
		this.crystals.blue = getRandomInt(1, 12);
		this.crystals.yellow = getRandomInt(1, 12);
		this.crystals.green = getRandomInt(1, 12);
		this.currentScore = 0;
		this.display();
	},

	// 
	// Log pertinent state information to the console
	//
	log: function() {
		console.log("Total Score: " + this.totalScore);
		console.log("Current Score: " + this.currentScore);
		console.log(this.crystals);
	},

	//
	// Output game state to the display
	//
	display: function() {
		$("#totalScore").text(this.totalScore);
		$("#currentScore").text(this.currentScore);
		$("#wins").text(this.wins);
		$("#losses").text(this.losses);
		this.log();
	},

	//
	// Change the game state based on color of crystal selected
	//
	add: function(color) {
		switch (color) {
			case "red":
				this.currentScore += this.crystals.red;
				break;
			case "blue":
				this.currentScore += this.crystals.blue;
				break;
			case "yellow":
				this.currentScore += this.crystals.yellow;
				break;
			case "green":
				this.currentScore += this.crystals.green;
				break;
			default:
				break;
		}

		if (this.currentScore == this.totalScore) {
			this.wins++;
			this.reset();
		}
		else if (this.currentScore > this.totalScore) {
			this.losses++;
			this.reset();
		}
		this.display();
	}
};

// MAIN PROCESS
// ==============================================================================

//
// $(document).ready() will run once the page DOM is ready for Javascript code to execute	
//
$(function() {

	//
	// Add a background image to the main container
	//
	getMain().css({
		"position" : "absolute",
		"top" : "0",
		"left" : "0",
		"width" : "100%",
		"padding" : "0",
		"margin" : "0",
		"background-image" : "url(assets/images/tiledbackground.jpg)", 
		"background-position" : "center top", 
	});

	//
	// Create a heading and add to the main container
	//
	var heading = $("<h1>").text("Crystals Collector!").css ({
		"float" : "left",
		"margin" : "10px",
		"padding" : "20px",
		"background-color" : "orange",
		"color" : "white"
	});

	getMain().prepend(heading);

	//
	// Create an instructions paragraph and add to the main container
	//
	var instructions = $("<div>")
	.css ({
		"clear" : "both",
		"float" : "left",
		"width" : "50%",
		"margin" : "10px",
		"padding" : "20px",
		"background-color" : "pink",
		"color" : "green"
	})
	.append(
		$("<p>").text (
			"You will be given a 	random number at the start of the game."
		)
	)
	.append(
		$("<p>").text (
			"There are four crystals below. By clicking on a crystal you will add a specific amount of points to your total score."
		)
	)
	.append(
		$("<p>").text (
			"You win the game by matching your total score to random number, you lose the game if your total score goes above the random number."
		)
	)
	.append(
		$("<p>").text (
			"The value of each crystal is hidden from you until you click on it."
		)
	)
	.append(
		$("<p>").text (
			"Each time when the game starts, the game will change the values of each crystal."
		)
	);
	getMain().append(instructions);

	//
	// Create a score board to display the total score
	//
	var totalScore = $('<h1 id = "totalScore">')
	.text ("0")
	.css ({
		"clear" : "both",
		"float" : "left",
		"width" : "30%",
		"margin" : "10px",
		"padding" : "20px",
		"background-color" : "green",
		"color" : "black"
	});
	getMain().append(totalScore);

	//
	// Create a score board to display the wins and losses 
	//
	var winsLosses = $('<div>')
	.css ({
		"float" : "left",
		"width" : "20%",
		"margin" : "10px",
		"padding" : "0px",
		"background-color" : "aqua",
		"color" : "black",
	})
	.append(
		$('<p>').text("Wins: ").append(
			$('<div id = "wins">').text("0").css( { "display" : "inline" })
		)
	).append(
		$('<p>').text("Losses: ").append(
			$('<div id = "losses">').text("0").css( { "display" : "inline" })
		)
	);
	getMain().append(winsLosses);

	//
	// Create a series of image to represent the crystals
	// When clicked, update the game state
	//
	var redCrystal = $('<img src = "assets/images/red.png">')
	.css ({
		"clear" : "both",
		"float" : "left",
		"margin" : "0px",
		"padding" : "0px",
		"margin-left" : "20px",
		"width" : "100px",
		"height" : "100px",
	});
	getMain().append(redCrystal);
	redCrystal.on('click', function() { crystalsCollector.add("red"); });

	var blueCrystal = $('<img src = "assets/images/blue.png">')
	.css ({
		"float" : "left",
		"margin" : "0px",
		"padding" : "0px",
		"width" : "100px",
		"height" : "100px",
	});
	getMain().append(blueCrystal);
	blueCrystal.on('click', function() { crystalsCollector.add("blue"); });

	var yellowCrystal = $('<img src = "assets/images/yellow.png">')
	.css ({
		"float" : "left",
		"margin" : "0px",
		"width" : "100px",
		"height" : "100px",
		"padding" : "0px",
	});
	getMain().append(yellowCrystal);
	yellowCrystal.on('click', function() { crystalsCollector.add("yellow"); });

	var greenCrystal = $('<img src = "assets/images/green.png">')
	.css ({
		"float" : "left",
		"margin" : "0px",
		"margin-left" : "20px",
		"padding" : "0px",
		"width" : "100px",
		"height" : "100px",
	});
	getMain().append(greenCrystal);
	greenCrystal.on('click', function() { crystalsCollector.add("green"); });

	//
	// Create a section to display the current score text
	//
	var currentScoreText = $('<p>')
	.text ("Your total score is: ")
	.css ({
		"clear" : "both",
		"float" : "left",
		"width" : "30%",
		"margin" : "10px",
		"padding" : "20px",
		"background-color" : "LightSlateGray",
		"color" : "white"
	});
	getMain().append(currentScoreText);

	//
	// Create a score board to display the current score
	//
	var currentScore = $('<h1 id="currentScore">')
	.text ("0")
	.css ({
		"clear" : "both",
		"float" : "left",
		"width" : "30%",
		"margin" : "10px",
		"padding" : "20px",
		"background-color" : "LightSlateGray",
		"color" : "white"
	});
	getMain().append(currentScore);

	// Initialize a Game object
	crystalsCollector.reset();
 });
