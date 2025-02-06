// define all main variables

let difficulty = "Normal";
let volumeLevel = 0.99;

const buttonColors = ["red", "blue", "green", "yellow"];
let randomMultiplier = 4;

let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 0;
let highScore = 0;

// const highScore = localStorage.getItem(highScore);
// $(".best-score").text(highScore);

// pre-load audio files
const audioFiles = {
  red: new Audio("sounds/red.mp3"),
  blue: new Audio("sounds/blue.mp3"),
  green: new Audio("sounds/green.mp3"),
  yellow: new Audio("sounds/yellow.mp3"),
  orange: new Audio("sounds/orange.mp3"),
  purple: new Audio("sounds/purple.mp3"),
  wrong: new Audio("sounds/wrong.mp3"),
  beep: new Audio("sounds/beep.mp3"),
};

// catch recurrent jQuery selectors by storing them in a variable
const $startBox = $(".start-box");
const $gameBox = $(".game-box");
const $endGameBox = $(".end-game-box");
const $menu = $(".menu");
const $menuBox = $(".menu-box");
const $volumeValue = $(".volume-value");
const $difficultyValue = $(".difficulty-value");
const $dHard = $(".d-hard");
const $restartBox = $(".restart-box");
const $rulesBox = $(".rules-box");
const $levelTitle = $("#level-title");

//when the page is open hide content to pop up in the future
$gameBox.hide();
$endGameBox.hide();
$menuBox.hide();
$dHard.hide();
$restartBox.hide();
$rulesBox.hide();

// make the title blink until enter key is pressed
let intervalId;
intervalId = setInterval(blinkTitle, 1300);

//show the menu box on "menu" click
$menu.click(function () {
  $menuBox.slideToggle();
});

// toggle the menu box for any click outside the menu box
$(document).click(function (e) {
  if (e.target.classList[0] != "set-toggle") {
    $menuBox.slideUp();
  }
});

//toggle the game rules
$(".rules-btn").click(function () {
  if (started === true) {
    $rulesBox.slideDown();
    $menuBox.slideUp();
    $gameBox.slideUp();
  } else {
    $rulesBox.slideDown();
    $menuBox.slideUp();
    $startBox.slideUp();
    $endGameBox.slideUp();
  }
});
$(".back").click(function () {
  if (started === true) {
    $gameBox.slideDown();
    $rulesBox.slideUp();
  } else {
    $startBox.slideDown();
    $rulesBox.slideUp();
  }
});

// DIFFICULTY SETTING
// 1st check if the game already started.
// If so it will hide the game and prompt the user to abort and restart the game with the new difficulty
$difficultyValue.click(function () {
  if (started === true) {
    $menuBox.slideUp();
    $gameBox.slideUp();
    $restartBox.slideDown();

    $(".yes").click(function () {
      console.log("Yes selected");
      changeDifficulty();
      restartGame();
    });

    $(".no").click(function () {
      console.log("No selected");
      $gameBox.slideDown();
      $restartBox.slideUp();
    });
  } else {
    changeDifficulty();
  }
});

// 2nd check the current difficulty and swap between Normal and Hard
function changeDifficulty() {
  if (difficulty === "Normal") {
    $difficultyValue.text("Hard");
    $difficultyValue.addClass("hard");
    difficulty = "Hard";
    $dHard.fadeIn();
    console.log("Change diffifulty to hard");

    buttonColors.push("orange", "purple");
    randomMultiplier = 6;
  } else {
    $difficultyValue.text("Normal");
    $difficultyValue.removeClass("hard");
    difficulty = "Normal";
    $dHard.fadeOut();
    console.log("Change diffifulty to normal");

    buttonColors.length = 4;
    randomMultiplier = 4;
  }
}

// 3rd empty the variables and restart the game
function restartGame() {
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  level = 0;

  $startBox.slideDown();
  $restartBox.slideUp();

  $levelTitle.html("Press <span class='enter'>Enter</span> to Start");
  intervalId = setInterval(blinkTitle, 1300);

  console.log("Game restarted");
}

// VOLUME SETTINGS
// checkbox on/off
$(".volume-checkbox").click(function (e) {
  if (e.target.checked === false) {
    volumeLevel = 0;
    $volumeValue.css("color", "gray");
  } else {
    volumeLevel = $volumeValue.val() / 100;
    $volumeValue.css("color", "orange");
  }
});

// set volume based on the specified value both on clicks and enter press
$volumeValue.click(function () {
  volumeLevel = $volumeValue.val() / 100;
});
$volumeValue.keypress(function () {
  volumeLevel = $volumeValue.val() / 100;
  if (volumeLevel > 1) {
    volumeLevel = 1;
    $volumeValue.val(100);
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
  $levelTitle.css("opacity", "100");

  $gameBox.slideDown(100);
  $levelTitle.show();
  $startBox.hide();
  $rulesBox.slideUp();

  //3
  $levelTitle.html("<span class='lv'>3</span>");
  playSound("beep");
  //2
  setTimeout(function () {
    $levelTitle.html("<span class='lv'>2</span>");
    playSound("beep");
  }, 1000);
  //1
  setTimeout(function () {
    $levelTitle.html("<span class='lv'>1</span>");
    playSound("beep");
  }, 2000);

  setTimeout(function () {
    $levelTitle.html("Level <span class='lv'>" + (level + 1) + "</span>");
    started = true;
    nextSequence();
  }, 3200);
}

// generate the random color sequence
function nextSequence() {
  level++;
  $levelTitle.html("Level <span class='lv'>" + level + "</span>");

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
$gameBox.on("click", ".btn", function (evt) {
  if (started === false) {
    var userChosenColor = evt.target.id;
    animatePress(userChosenColor);
    playSound(userChosenColor);
  } else {
    var userChosenColor = evt.target.id;
    userClickedPattern.push(userChosenColor);

    animatePress(userChosenColor);

    checkAnswer(userClickedPattern.length - 1, userChosenColor);
  }
});

// check answers, game over on wrong sequence
function checkAnswer(currentLevel, userChosenColor) {
  if (userClickedPattern[currentLevel] != gamePattern[currentLevel]) {
    gameOver();
    return;
  }

  playSound(userChosenColor);
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

  $levelTitle.hide();
  $gameBox.slideUp();
  $endGameBox.slideDown();

  gamePattern = [];
  userClickedPattern = [];
  started = false;
  level = 0;
}

//return to home page after losing a game and click on retry
$(".retry-btn").click(function () {
  $levelTitle.html("Press <span class='enter'>Enter</span> to Start");
  intervalId = setInterval(blinkTitle, 1300);
  $endGameBox.hide();
  $levelTitle.show();
  $startBox.slideDown();
});

//UTILITY FUNCTIONS

// set the blinking functions
function blinkTitle() {
  $levelTitle.animate({ opacity: "0" }, "slow");
  $levelTitle.animate({ opacity: "100" }, "slow");
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
  if (audioFiles[color]) {
    audioFiles[color].volume = volumeLevel;
    if (color == "wrong") {
      audioFiles[color].volume = 0.4 * volumeLevel;
    }
    audioFiles[color].currentTime = 0; // Reset the audio to start
    audioFiles[color].play();
  }
}
