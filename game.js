// define all main variables

var difficulty = "Normal";
var volumeLevel = 0.99;

var buttonColors = ["red", "blue", "green", "yellow"];
var randomMultiplier = 4;

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var highScore = 0;

// const highScore = localStorage.getItem(highScore);
// $(".best-score").text(highScore);

//when the page is open hide content to pop up in the future
$(".game-box").hide();
$(".end-game-box").hide();
$(".menu-box").hide();
$(".d-hard").hide();
$(".restart-box").hide();
$(".rules-box").hide();

// make the title blink until enter key is pressed
let intervalId;
intervalId = setInterval(blinkTitle, 1300);

//show the menu box on "menu" click
$(".menu").click(function () {
  $(".menu-box").slideToggle();
});

// toggle the menu box for any click outside the menu box
$(document).click(function (e) {
  if (e.target.classList[0] != "set-toggle") {
    $(".menu-box").slideUp();
  }
});

//toggle the game rules
$(".rules-btn").click(function () {
  if (started === true) {
    $(".menu-box").slideUp();
    $(".rules-box").slideDown();
    $(".game-box").slideUp();
  } else {
    $(".menu-box").slideUp();
    $(".rules-box").slideDown();
    $(".start-box").slideUp();
  }
});
$(".back").click(function () {
  if (started === true) {
    $(".game-box").slideDown();
    $(".rules-box").slideUp();
  } else {
    $(".start-box").slideDown();
    $(".rules-box").slideUp();
  }
});

// DIFFICULTY SETTING
// 1st check if the game already started.
// If so it will hide the game and prompt the user to abort and restart the game with the new difficulty
$(".difficulty-value").click(function () {
  if (started === true) {
    $(".menu-box").slideUp();
    $(".game-box").slideUp();
    $(".restart-box").slideDown();

    $(".yes").click(function () {
      console.log("Yes selected");
      changeDifficulty();
      restartGame();
    });

    $(".no").click(function () {
      console.log("No selected");
      $(".game-box").slideDown();
      $(".restart-box").slideUp();
    });
  } else {
    changeDifficulty();
  }
});

// 2nd check the current difficulty and swap between Normal and Hard
function changeDifficulty() {
  if (difficulty === "Normal") {
    $(".difficulty-value").text("Hard");
    $(".difficulty-value").addClass("hard");
    difficulty = "Hard";
    $(".d-hard").fadeIn();
    console.log("Change diffifulty to hard");

    buttonColors.push("orange", "purple");
    randomMultiplier = 6;
  } else {
    $(".difficulty-value").text("Normal");
    $(".difficulty-value").removeClass("hard");
    difficulty = "Normal";
    $(".d-hard").fadeOut();
    console.log("Change diffifulty to normal");

    buttonColors = ["red", "blue", "green", "yellow"];
    randomMultiplier = 4;
  }
}

// 3rd empty the variables and restart the game
function restartGame() {
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  level = 0;

  $(".game-box").slideDown();
  $(".restart-box").slideUp();

  $("#level-title").html("Press <span class='enter'>Enter</span> to Start");
  intervalId = setInterval(blinkTitle, 1300);

  console.log("Game restarted");
}

// VOLUME SETTINGS
// checkbox on/off
$(".volume-checkbox").click(function (e) {
  if (e.target.checked === false) {
    volumeLevel = 0;
    $(".volume-value").css("color", "gray");
  } else {
    volumeLevel = $(".volume-value").val() / 100;
    $(".volume-value").css("color", "orange");
  }
});

// set volume based on the specified value both on clicks and enter press
$(".volume-value").click(function () {
  volumeLevel = $(".volume-value").val() / 100;
});
$(".volume-value").keypress(function () {
  volumeLevel = $(".volume-value").val() / 100;
  if (volumeLevel > 1) {
    volumeLevel = 1;
    $(".volume-value").val(100);
  }
});

// avoid that pressing "enter" will toggle the menu box
$(".set-btn").keypress(function (evt) {
  if (evt.keyCode === 13) {
    evt.preventDefault();
  }
});

// START THE GAME <====

// identify "enter" keypress and clicks on the Start button
$(document).keypress(function (evt) {
  if (!started && evt.key == "Enter") {
    startGame();
  }
});
$(".start-btn").click(function () {
  startGame();
});

// game initialization
// stop the title blinking, hide/display relevat boxes, intitate countdown and then start rendom sequence generation
function startGame() {
  stopBlinking();
  $("#level-title").css("opacity", "100");

  $(".game-box").slideDown(100);
  $(".start-box").hide();
  $(".rules-box").slideUp();

  //3
  $("#level-title").html("<span class='lv'>3</span>");
  playSound("beep");
  //2
  setTimeout(function () {
    $("#level-title").html("<span class='lv'>2</span>");
    playSound("beep");
  }, 1000);
  //1
  setTimeout(function () {
    $("#level-title").html("<span class='lv'>1</span>");
    playSound("beep");
  }, 2000);

  setTimeout(function () {
    $("#level-title").html("Level <span class='lv'>" + (level + 1) + "</span>");
    started = true;
    nextSequence();
  }, 3200);
}

// generate the random color sequence
function nextSequence() {
  level++;
  $("#level-title").html("Level <span class='lv'>" + level + "</span>");

  var randomNumber = Math.floor(Math.random() * randomMultiplier);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  $("." + randomChosenColor)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);

  playSound(randomChosenColor);
}

// check the buttons clicked by the user
$(".btn").click(function (evt) {
  if (started === false) {
    var userChosenColor = evt.target.id;
    animatePress(userChosenColor);
    playSound(userChosenColor);
  } else {
    var userChosenColor = evt.target.id;
    userClickedPattern.push(userChosenColor);

    animatePress(userChosenColor);
    playSound(userChosenColor);

    checkAnswer(userClickedPattern.length - 1);
  }
});

// check answers, game over on wrong sequence
function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] != gamePattern[currentLevel]) {
    gameOver();
    return;
  }

  if (userClickedPattern.length === gamePattern.length) {
    userClickedPattern = [];

    setTimeout(function () {
      nextSequence();
    }, 1000);
  }
}

// game over animation and game reset
function gameOver() {
  playSound("wrong");

  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);

  if (level >= highScore) {
    highScore = level;
    $(".best-score").text(highScore);

    // localStorage.setItem(highScore, level);
  }

  $(".current-score").text(level);

  $("#level-title").hide();
  $(".game-box").slideUp();
  $(".end-game-box").slideDown();

  gamePattern = [];
  userClickedPattern = [];
  started = false;
  level = 0;
}

//return to home page after losing a game and click on retry
$(".retry-btn").click(function () {
  $("#level-title").html("Press <span class='enter'>Enter</span> to Start");
  intervalId = setInterval(blinkTitle, 1300);
  $(".end-game-box").hide();
  $("#level-title").show();
  $(".start-box").slideDown();
});

//UTILITY FUNCTIONS

// set the blinking functions
function blinkTitle() {
  $("#level-title").animate({ opacity: "0" }, "slow");
  $("#level-title").animate({ opacity: "100" }, "slow");
}
function stopBlinking() {
  clearInterval(intervalId);
  intervalId = null;
}

// flash the chosen button
function animatePress(currentColour) {
  $("." + currentColour).addClass("pressed");
  setTimeout(function () {
    $("." + currentColour).removeClass("pressed");
  }, 100);
}

// play related sound
function playSound(color) {
  var audio = new Audio("sounds/" + color + ".mp3");
  audio.volume = volumeLevel;
  if (color == "wrong") {
    audio.volume = 0.2 * volumeLevel;
  }
  audio.play();
}
