$(document).ready(function() {

  let countdown;
  let timerOn = false;
  let onBreak = false;
  let sessionTime = "25:00";
  let breakTime = "5:00";
  let volumeLevel = 5;
  let buttonPressedInterval;
  let buttonPressedTimeout;
  let mousedownIntervalDelay = 50;
  let mousedownTimeoutDelay = 500;

  // Button that reduces break duration text.
  // If on break, main timer text also decreases by 1.
  $("#break_less_button").click(function() {
    let breakDuration = parseInt($("#break_duration").text());
    if (!timerOn && breakDuration > 1) {
      $("#break_duration").text(--breakDuration);
      breakTime = breakDuration + ":00";
      if (onBreak) {
        $("#timer").text(breakTime);
      }
    }
  });

  // Button that increases break time.
  $("#break_more_button").click(function() {
    if (!timerOn) {
      let breakDuration = parseInt($("#break_duration").text());
      $("#break_duration").text(++breakDuration);
      breakTime = breakDuration + ":00";
      if (onBreak) {
        $("#timer").text(breakTime);
      }
    }
  });

  // Decrease session duration text by 1
  $("#session_less_button").click(function() {
    let sessionDuration = parseInt($("#session_duration").text());
    if (!timerOn && sessionDuration > 1) {
      $("#session_duration").text(--sessionDuration);
      sessionTime = sessionDuration + ":00";
      if (!onBreak) {
        $("#timer").text(sessionTime);
      }
    }
  });

  // Increase session duration text by 1
  $("#session_more_button").click(function() {
    if (!timerOn) {
      let sessionDuration = parseInt($("#session_duration").text());
      $("#session_duration").text(++sessionDuration);
      sessionTime = sessionDuration + ":00";
      if (!onBreak) {
        $("#timer").text(sessionTime);
      }
    }
  });

  // Hold down mouse click on - + buttons to quickly add or remove time
  // mousedownTimeoutDelay is how long it takes for button press to start working.
  // mousedownIntervalDelay is how fast the time increases or decreases.
  $("#break_less_button").mousedown(function() {
    buttonPressedTimeout = setTimeout(function() {
      buttonPressedInterval = setInterval(function() {
        let breakDuration = parseInt($("#break_duration").text());
        if (!timerOn && breakDuration > 1) {
          $("#break_duration").text(--breakDuration);
          breakTime = breakDuration + ":00";
          if (onBreak) {
            $("#timer").text(breakTime);
          }
        }
      }, mousedownIntervalDelay);
    }, mousedownTimeoutDelay);

    return false;

  });

  $("#break_more_button").mousedown(function() {
    buttonPressedTimeout = setTimeout(function() {
      buttonPressedInterval = setInterval(function() {
        if (!timerOn) {
          let breakDuration = parseInt($("#break_duration").text());
          $("#break_duration").text(++breakDuration);
          breakTime = breakDuration + ":00";
          if (onBreak) {
            $("#timer").text(breakTime);
          }
        }
      }, mousedownIntervalDelay);
    }, mousedownTimeoutDelay);

    return false;

  });

  $("#session_less_button").mousedown(function() {
    buttonPressedTimeout = setTimeout(function() {
      buttonPressedInterval = setInterval(function() {
        let sessionDuration = parseInt($("#session_duration").text());
        if (!timerOn && sessionDuration > 1) {
          $("#session_duration").text(--sessionDuration);
          sessionTime = sessionDuration + ":00";
          // Show new session duration in timer if in session and not on break
          if (!onBreak) {
            $("#timer").text(sessionTime);
          }
        }
      }, mousedownIntervalDelay);
    }, mousedownTimeoutDelay);

    return false;
  });

  $("#session_more_button").mousedown(function() {
    buttonPressedTimeout = setTimeout(function() {
      buttonPressedInterval = setInterval(function() {
        if (!timerOn) {
          let sessionDuration = parseInt($("#session_duration").text());
          $("#session_duration").text(++sessionDuration);
          sessionTime = sessionDuration + ":00";
          if (!onBreak) {
            $("#timer").text(sessionTime);
          }
        }
      }, mousedownIntervalDelay);
    }, mousedownTimeoutDelay);

    return false;
  });

  // Clear timeout and interval when mousebutton is no longer held.
  $(document).mouseup(function() {
    clearInterval(buttonPressedInterval);
    clearInterval(buttonPressedTimeout);
    $("#timer").css("background-color", "#677077");
    return false;
  });

  // Change timer button color when it is pressed.
  $("#timer").mousedown(function() {
    $("#timer").css("background-color", "	#f2b632");
  });

  // Reset timer value to break or session duration.  
  $("#reset_button").click(function() {
    if (timerOn) {
      clearInterval(countdown);
      timerOn = false;
    }
    if (onBreak) {
      $("#timer").text(breakTime);
    } else {
      $("#timer").text(sessionTime);
    }
  });

  // Change to break
  $("#break_button").click(function() {
    if (timerOn) {
      clearInterval(countdown);
      timerOn = !timerOn;
    }
    $("#timer").text(breakTime);
    onBreak = true;
  });

  // Change to session
  $("#session_button").click(function() {
    if (timerOn) {
      clearInterval(countdown);
      timerOn = !timerOn;
    }
    $("#timer").text(sessionTime);
    onBreak = false;
  });

  $("#lower_volume_button").click(function() {
    if (volumeLevel === 1) {
      volumeLevel--;
      $("#volume_level").text("Mute");
    } else if (volumeLevel > 1) {
      volumeLevel--;
      let currVolume = $("#volume_level").text();
      $("#volume_level").text(currVolume.substring(1));
    }
  });

  $("#raise_volume_button").click(function() {
    if (volumeLevel === 0) {
      volumeLevel++;
      $("#volume_level").text("|");
    } else if (volumeLevel < 10) {
      volumeLevel++;
      let currVolume = $("#volume_level").text();
      $("#volume_level").text(currVolume + "|");
    }
  });

  $("#test_beep_button").click(function() {
    console.log(volumeLevel);
    for (let i = 0; i < volumeLevel * 2; i++) {
      beepSelector();
    }
  });

  // Main timer button.
  $("#timer").mousedown(function() {
    if (timerOn) {
      clearInterval(countdown);
      timerOn = !timerOn;
    } else {
      countdown = setInterval(decrementBySecond, 1000);
      timerOn = !timerOn;
    }
  })

  // This uses string manipulation, but it might be better to store time
  // values as integers instead.
  function decrementBySecond() {
    let currentTimeRemaining = $("#timer").text();
    let colonIndex = currentTimeRemaining.indexOf(":");
    let minRemaining = currentTimeRemaining.substring(0, colonIndex);
    let secRemaining = currentTimeRemaining.substring(colonIndex + 1);
    if (parseInt(secRemaining) === 0) {
      secRemaining = "59";
      minRemaining = parseInt(minRemaining) - 1;
      minRemaining = minRemaining.toString();
    } else {
      secRemaining = parseInt(secRemaining) - 1;
      secRemaining = secRemaining.toString();
    }
    if (secRemaining.length === 1) {
      secRemaining = "0" + secRemaining;
    }
    let newTimeRemaining = minRemaining + ":" + secRemaining;
    $("#timer").text(newTimeRemaining);
    if (newTimeRemaining === "0:00") {
      // Turn old countdown off since no more time is left in session or break.
      clearInterval(countdown);
      if (onBreak) {
        $("#timer").text(sessionTime);
        beepSelector();
        onBreak = false;
      } else {
        $("#timer").text(breakTime);
        beepSelector();
        onBreak = true;
      }
      // Turn countdown back on since you changed to a new session or break.
      countdown = setInterval(decrementBySecond, 1000);
    }
  }

  function beepSelector() {
    if (onBreak) {
      // 3 beeps in a row when session begins.
      beep();
      setTimeout(beep, 250);
      setTimeout(beep, 500);
    } else {
      // Just one beep when break begins.
      beep();
    }
  }

  // Beep function from http://jsfiddle.net/7EAgz/
  // Subitted by Paul Fournel in http://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep
  // This is a base64 file imported as data URI.
  // More info at http://caniuse.com/datauri
  function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
  }

});