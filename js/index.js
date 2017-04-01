/* Simon Game Functionality */

class SimonGame {
  constructor() {
    // the sequence and length of the sequence
    this._sequence = [];
    this._length = 0;
  }

  getSequence() {
    return this._sequence;
  }

  reset() {
    // resets the sequence and length of the sequence
    this._sequence = [];
    this._length = 0;
  }

  nextSequence() {
    /* Generates aa random sequence of length one more than previous one. */
    if (this._length >= 20) {
      return false;
    }
    this._length++;

    this._sequence.push(Math.floor(Math.random() * 4));
    return this._sequence;
  }
}

class PlayGame {
  /* Handles the button events of computer side */

  constructor() {
    this.status = false; // whether game is On or Off
    this._strict = false; // Strict mode is On or Off
    this._simon = new SimonGame(); // SimonGame class for game logic
    this.counter = 0; // which button was pressed by user recently
    this.seq = []; // sequence generated so far by user
    this._buttonData = {
      0: {
        audio: "audio4",
        color1: "#094a8f",
        color2: "#1c8cff"
      },
      1: {
        audio: "audio3",
        color1: "#cca707",
        color2: "#fed93f"
      },
      2: {
        audio: "audio2",
        color1: "#9f0f17",
        color2: "#ff4c4c"
      },
      3: {
        audio: "audio1",
        color1: "#00a74a",
        color2: "#13ff7c"
      }
    };
  }

  getStrict() {
    return this._strict;
  }

  switchStrict() {
    this._strict = !this._strict;
  }

  display() {
    $(".count").html(this._simon.getSequence().length);
  }

  _resetUserSequence() {
    this.counter = 0;
    this.seq = [];
  }

  lightUp(id) {
    // Light Up (Change the color of) the button whose id is provided
    var button = $("#" + id);
    var that = this;
    button.css("background-color", this._buttonData[id]["color2"]);
    setTimeout(function() {
      button.css("background-color", that._buttonData[id]["color1"]);
    }, 250);
  }

  playAudio(id) {
    /* Play the audio associated with the provided id */
    var audio = this._buttonData[id]["audio"];
    document.getElementById(audio).play();
  }

  playSequence(sequence) {
    // Plays the given sequence
    var i = 0;
    var that = this;
    var interval = setInterval(function() {
      that.playAudio(sequence[i]);
      that.lightUp(sequence[i]);

      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
      }
    }, 300);
  }

  playNextSequence() {
    // plays the next sequence by getting new sequence from SimonGame Class
    this._resetUserSequence();
    this.turnOffButtons();
    var sequence = this._simon.nextSequence();
    this.display();

    // User Wins!
    if (sequence === false) {
      alert("You Win!");
      this.resetGame();
    }
    // Play the sequence and enable buttons for user to repeat sequence.
    else {
      this.playSequence(sequence);
      var that = this;
      setTimeout(function() {
        that.humanPlay(sequence);
      }, 300 * sequence.length);
    }
  }

  checkInput() {
    // Checks for mismatch
    var sequence = game._simon.getSequence();
    var seq = this.seq;
    var counter = this.counter;

    if (seq[counter - 1] != sequence[counter - 1]) {
      this.turnOffButtons();

      // if strict mode is on
      if (this._strict === true) {
        alert("Start from beginning!");
        this.resetGame();
      }
      // repeat the sequence.
      else {
        this.playSequence(sequence);
        this.humanPlay(sequence);
        alert("Wrong Button Pressed!");
      }
    }
    // user has successfully cleared the current level
    else if (seq.length === sequence.length) {
      this.turnOffButtons();
      this._resetUserSequence();
      this.playNextSequence();

    }

  }

  humanPlay(sequence) {
    // enables buttons for user to repeat sequence.
    this._resetUserSequence();
    this.turnOnButtons();
  }

  turnOffButtons() {
    // Disables all the game buttons
    $("#0").css("pointer-events", "none");
    $("#1").css("pointer-events", "none");
    $("#2").css("pointer-events", "none");
    $("#3").css("pointer-events", "none");
    $("#0").removeClass("clickable").addClass("unclickable");
    $("#1").removeClass("clickable").addClass("unclickable");
    $("#2").removeClass("clickable").addClass("unclickable");
    $("#3").removeClass("clickable").addClass("unclickable");
  }

  turnOnButtons() {
    // Enables all the game buttons
    $("#0").css("pointer-events", "auto");
    $("#1").css("pointer-events", "auto");
    $("#2").css("pointer-events", "auto");
    $("#3").css("pointer-events", "auto");
    $("#0").removeClass("unclickable").addClass("clickable");
    $("#1").removeClass("unclickable").addClass("clickable");
    $("#2").removeClass("unclickable").addClass("clickable");
    $("#3").removeClass("unclickable").addClass("clickable");
  }

  stopGame() {
    // stop the game and turn off all play buttons
    this.turnOffButtons();
    this._resetUserSequence();
    $(".count").removeClass("led-on").addClass("led-off");
    $(".switch").removeClass("sw-on");
    this.status = false;
    this._strict = false;
  }

  resetGame() {
    // resets the game
    this._simon.reset();
    this.display();
    this._resetUserSequence();
    this.turnOffButtons();
    $(".count").removeClass("led-off").addClass("led-on");
  }

  switchGameOn() {
    /* Switches On the game when the slider is turned On. */
    this._simon.reset();
    $(".switch").addClass("sw-on");
    $(".count").removeClass("led-off", "led-on").addClass("led-on");
    this.status = true;
  }

  startGame() {
    /* Starts the game when start button is clicked */
    this._simon.reset();
    $(".count").removeClass("led-off", "led-on").addClass("led-on");
    this.playNextSequence();
  }
}

var game = new PlayGame();

$(document).ready(function() {
  $(".sw-slot").on("click", function() {
    if (game.status === false) {
      game.switchGameOn();
    } else {
      game.stopGame();
    }
  });

  $("#start").on("click", function() {
    if (game.status === true) {
      game.startGame();
    }
  });

  $("#mode").on("click", function() {
    if (game.status === true) {
      if (game.getStrict() === true) {
        $("#mode-led").removeClass("led-on").addClass("led-off");
      } else {
        $("#mode-led").removeClass("led-off").addClass("led-on");
      }
      game.switchStrict();
    }

  });

  // button events for user chance.
  $("#0").on("click", function() {
    game.counter++;
    game.seq.push(0);
    game.playAudio(0);
    game.lightUp(0);
    game.checkInput();
  });
  $("#1").on("click", function() {
    game.counter++;
    game.seq.push(1);
    game.playAudio(1);
    game.lightUp(1);
    game.checkInput();
  });
  $("#2").on("click", function() {
    game.counter++;
    game.seq.push(2);
    game.playAudio(2);
    game.lightUp(2);
    game.checkInput();
  });
  $("#3").on("click", function() {
    game.counter++;
    game.seq.push(3);
    game.playAudio(3);
    game.lightUp(3);
    game.checkInput();
  });

});