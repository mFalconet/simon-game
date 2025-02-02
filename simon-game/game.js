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

let intervalId;

// make the title blink until enter key is pressed
intervalId = setInterval(blinkTitle, 1300);

//when the page is open hide content to pop up in the future
$(".end-game-box").hide();
$(".setting-box").hide();
$(".d-hard").hide();
$(".restart").hide();

//show the settings box on "settings" click
$(".settings").click(function () {
  $(".setting-box").slideToggle();
});

// toggle the setting box for any click outside the setting box
$(document).click(function (e) {
  if (e.target.classList[0] != "set-toggle") {
    $(".setting-box").slideUp();
  }
});

// change difficulty
// first check if the game already started.
// If so it will hide the game and prompt the user to abort and restart the game with the new difficulty
$(".difficulty-value").click(function () {
  if (started === true) {
    $(".game-box").slideUp();
    $(".restart").slideDown();

    $(".yes").click(function () {
      console.log("Yes selected");
      changeDifficulty();
      restartGame();
    });

    $(".no").click(function () {
      console.log("No selected");
      $(".game-box").slideDown();
      $(".restart").slideUp();
    });
  } else {
    changeDifficulty();
  }
});

// check the current difficulty and swap between Normal and Hard
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

// empty the variables and restart the game
function restartGame() {
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  level = 0;

  $(".game-box").slideDown();
  $(".restart").slideUp();

  $("#level-title").html("Press <span class='enter'>Enter</span> to Start");
  intervalId = setInterval(blinkTitle, 1300);

  console.log("Game restarted");
}

// Volume
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

$(".set-btn").keypress(function (evt) {
  if (evt.keyCode === 13) {
    evt.preventDefault();
  }
});

// Start the game
$(document).keypress(function (evt) {
  if (!started && evt.key == "Enter") {
    started = true;

    stopBlinking();
    $("#level-title").css("opacity", "100");
    $(".game-box").slideDown(100);
    $(".end-game-box").hide();

    $("#level-title").html("<span class='lv'>3</span>");
    playSound("beep");

    setTimeout(function () {
      $("#level-title").html("<span class='lv'>2</span>");
      playSound("beep");
    }, 1000);

    setTimeout(function () {
      $("#level-title").html("<span class='lv'>1</span>");
      playSound("beep");
    }, 2000);

    setTimeout(function () {
      $("#level-title").html(
        "Level <span class='lv'>" + (level + 1) + "</span>"
      );
      nextSequence();
    }, 3200);
  }
});

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

// check answers
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

  $(".game-box").slideUp();
  $(".end-game-box").slideDown();

  gamePattern = [];
  userClickedPattern = [];
  started = false;
  level = 0;

  // make the title blink until enter key is pressed
  $("#level-title").css("opacity", "0");
  $("#level-title").html("Press <span class='enter'>Enter</span> to Restart");
  intervalId = setInterval(blinkTitle, 1300);
}

// set the blinking functions
function blinkTitle() {
  $("#level-title").animate({ opacity: "0" }, "slow");
  $("#level-title").animate({ opacity: "100" }, "slow");
}
function stopBlinking() {
  clearInterval(intervalId);
  intervalId = null;
}
