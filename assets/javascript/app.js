//
// The Trivia Game
//
// The following Javascript implements the Basic Quiz Trivia Game as 
// described in README.md. The game asks the player to answer series of 
// trivia style questions. The player has a set period of time to answer 
// as many questions as possible. After the game clock expires, a score 
// board is shown giving the player game statistics.
//
// The player will have a limited amount of time to finish the quiz. 
//
// The game ends when the time runs out. The page will reveal the number 
// of questions that players answer correctly and incorrectly.
//
// Don't let the player pick more than one answer per question.
//
// Don't forget to include a countdown timer.
//

// Execute in strict mode as defined by the ECMAScript version 5 standard
"use strict";

//
// Mashape APIs require an access key
//
function getMashapeApiKey() {
	return "6cnGhUWtqsmsh27aeRGcQTyea3Yip1hVMHAjsnMMBkGXelIRQZ";
} 

//
// This AJAX query accesses a Mashape music trivia API
// The music trivia provides a set of trivia questions and 
// corresponding answers
//
function getTriviaQuestions(triviaQuestions) {
	$.ajax({
		url: 'https://roomtek-music-trivia-v1.p.mashape.com/getgamelevel?output=json', 
		type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
		data: {}, // Additional parameters here
		dataType: 'json',
		complete: function (jqXHR, textStatus) {
			// Get a reference to the array of trivia questions
			let questions = (JSON.parse(jqXHR.responseText)).question;

			// For each question in the array, add an element to the main container
			for (var i = 0; i < questions.length; i++) {
				let musicTrivia = Object.assign({}, questions[i]);
				//console.log(musicTrivia);
				addQuestion(musicTrivia, triviaQuestions);
			}
		},
		// The Masahape requires the API key to be sent as part of the HTTP  
		// request header
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Mashape-Authorization", getMashapeApiKey()); 
		}
	});
}

//
// Add a music trivia question to the set of trivia questions division 
//
function addQuestion(musicTrivia, triviaQuestions) {
	// Append the text of the question to the trivia questions division
	triviaQuestions.append(
		$("<h1>").append(musicTrivia.text)
	);

	//
	// Create a form to contain the player's answers to this question
	//
	let question = $("<form class='musicTrivia'>");

	//
	// For each answer to the questions, append a radio input to the
	// question form
	//
	for (var i = 0; i < musicTrivia.answers.a.length; i++) {

		let radioInput = {};

		//
		// Create a radio input
		// The correct radio input is visible in the HTML
		//
		if (musicTrivia.answers.a[i].correct == 1) {
			radioInput = $("<input type=\"radio\" value=\"true\">");
		}
		else {
			radioInput = $("<input type=\"radio\" value=\"false\">");
		}

		var answer = Object.assign({}, musicTrivia.answers.a[i]);

		// When an input changes in the form, update the form 
		// with a trivia answer object
		radioInput.change(function() {
			// Uncheck the other answers
			question.children().prop("checked", false);
			radioInput.prop("checked", true);
			// Assign the currently selected answer to the input form
			// console.log(answer);	
			question.data("answer", answer);
		});

		// Get the answer text and append it to the questions form
		let answerText = musicTrivia.answers.a[i].value;
		question.append(radioInput).append(answerText);
		triviaQuestions.append(question);
	}

	// Add some space between this question and the next
	triviaQuestions.append("<br><br>");
}

//
// Returns a jQuery object representing the main containing element
//
function getMain() {
	return $(".maincontainer");
}

//
//  Converts a time inseconds to minutes and seconds 
//
function convertSeconds(t) {

    //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes === 0) {
      minutes = "00";
    }

    else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}

//
// The timer object can counts down in seconds
//
var timer = {
	// Reset the timer display and countdown
	reset: function(countdown) {
		timer.seconds = countdown;
		timer.running = false;
		timer.display = convertSeconds(timer.seconds);
	},
	// Start the timer interval and set the callbacks
	start: function(countCallback, expiredCallback) {
		if (!timer.running) {
			timer.interval = setInterval(timer.count, 1000);
			timer.running = true;
			timer.countCallback = countCallback;
			timer.expiredCallback = expiredCallback;
		}
	},
	// Clears the timer interval
	stop: function() {
		if (timer.running) {
			clearInterval(timer.interval);
			timer.running = false;
		}
	},
	// Count down the remaining time and call count callback
	// When the timer expires, stop the time and call the expired callback
	count: function() {
		if (timer.running == false) {
			return;
		}

		timer.seconds--;
		timer.display = convertSeconds(timer.seconds);
		timer.countCallback();

		if (timer.seconds == 0) {
			timer.stop();
			timer.expiredCallback();	
		}
	},
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
		"background-size" : "100%"
	});

	//
	// Create a heading and add to the main container
	//
	var heading = $("<h1>").text("Totally Trivia Trivia!").css ({
		"float" : "none",
		"width" : "80%",
		"margin" : "0 auto",
		"padding" : "20px",
		"background-color" : "LightCyan",
		"color" : "blue",
		"font-family" : '"Comic Sans MS", cursive, sans-serif',
		"font-size" : "300%",
	});
	getMain().prepend(heading);

	//
	// Create a timer display and add to the main container
	//
	var timerDisplay = $('<h1>').text("Time Remaining: ").css ({
		"float" : "none",
		"width" : "80%",
		"margin" : "0 auto",
		"margin-top" : "10px",
		"padding" : "20px",
		"background-color" : "LightCyan",
		"font-family" : 'Courier',
		"color" : "blue",
	})
	.append(
		$('<div id = "timerDisplay">').text("00:00").css( { "display" : "inline" })
	);
	getMain().append(timerDisplay);

	//
	// Create a scoreboard to display game statistics
	//
	var scoreBoard = $('<div>')
	.css ({
		"float" : "none",
		"width" : "80%",
		"margin" : "0 auto",
		"margin-top" : "10px",
		"margin-bottom" : "10px",
		"padding" : "20px",
		"background-color" : "LightCyan",
		"color" : "black"
	})
	.append(
		$('<h2>').text("All Done!")
	).append(
		$('<h3>').text("Correct Answers: ").append(
			$('<div id = "correct">').text("0").css( { "display" : "inline" })
		)
	).append(
		$('<h3>').text("Incorrect Answers: ").append(
			$('<div id = "incorrect">').text("0").css( { "display" : "inline" })
		)
	).append(
		$('<h3>').text("Unanswered: ").append(
			$('<div id = "unanswered">').text("0").css( { "display" : "inline" })
		)
	);
	getMain().append(scoreBoard);
	scoreBoard.hide();

	//
	// The trivia questions division contains questions and the users answers
	//
    	var triviaQuestions = $("<div class='triviaQuestions'>")
	.css ({
		"float" : "none",
		"width" : "80%",
		"margin" : "0 auto",
		"margin-top" : "10px",
		"padding" : "20px",
		"background-color" : "LightCyan",
		"color" : "black"
	});
	getMain().append(triviaQuestions);

	// Get a set of trivia questions from the trivia questions API
	getTriviaQuestions(triviaQuestions);

    	// Initialize and start the game timer
    	timer.reset(5);
    	timer.start(
    		// When a timer event occurs display the remaining time
    		function() {
    			$("#timerDisplay").text(timer.display);
    		},
    		// When the timer expires, show the scoreboard
    		// Hide the trivia questions and tally the player's
    		// score
	    	function() {
	    		triviaQuestions.hide();
	    		scoreBoard.show();
			getMain().css({
				"width" : "100%",
				"height" : "100%",
			});

			var correct = 0;
			var incorrect = 0;
			var unanswered = 0;

			// Get the player's answers and tally his score
			$(".musicTrivia").each(function() {
				let answer = $(this).data("answer");

				if (answer === undefined) {
					unanswered++;
				}
				else if (answer.correct == 1) {
					correct++;
				}
				else {
					incorrect++;
				}
			});

			// Display the tally
			$("#correct").text(correct);
			$("#incorrect").text(incorrect);
			$("#unanswered").text(unanswered);
	    	}
    	);
 });
