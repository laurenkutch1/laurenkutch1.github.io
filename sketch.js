let bubbles = [];
let paused = false;
let selectedBubble = null;
let data;
let bgSlider;
 
//Guess mode
let guessInput;
let guessValue = null;
let guessSubmitted = false;
 
function preload() {
  data = loadTable("sleep_health.csv", "csv", "header");
}
 
function setup() {
<<<<<<< HEAD
  createCanvas(windowWidth, windowHeight);
=======
  createCanvas(500, 500);
>>>>>>> 89e4dade38fd0bf3cd36c0f62ff2fcceada4992b
 
  bgSlider = createSlider(0, 255, 220);
  bgSlider.position(190, 50);
  bgSlider.style("width", "120px");
 
  guessInput = createInput("");
  guessInput.position(width / 2 - 30, height / 2 + 10);
  guessInput.size(60);
  guessInput.hide();
 
  let count = min(50, data.getRowCount());
  for (let i = 0; i < count; i++) {
    let row    = data.getRow(i);
    let sleep   = row.getNum("sleep_duration_hrs");
    let stress  = row.getNum("stress_score");
    let quality = row.getNum("sleep_quality_score");
    let occ     = row.getString("occupation");
    let size    = map(quality, 1, 10, 20, 80);
    let col     = lerpColor(
      color(100, 180, 255, 200),
      color(255, 80, 80, 200),
      map(stress, 1, 10, 0, 1)
    );
    bubbles.push({
      x: random(width),
      y: random(height - 40) + 30,
      size,
      speed: map(stress, 1, 10, 0.2, 3),
      sleep, stress, quality, occ, color: col
    });
  }
}
 
//Original function: draws a single bubble with saturation applied
function drawBubble(b, saturation) {
  let s = (b === selectedBubble) ? b.size * 1.8 : b.size;
  noStroke();
  let r  = red(b.color)   * saturation;
  let g  = green(b.color) * saturation;
  let bl = blue(b.color)  * saturation;
  fill(r, g, bl, 180);
  ellipse(b.x, b.y, s);
}
 
function draw() {
  let brightness = bgSlider.value();
  background(brightness);
  let saturation = map(brightness, 0, 255, 0.3, 1);
  let ink = brightness > 128 ? color(0) : color(255);
 
  //Brightness label
  fill(ink);
  textSize(10);
  textAlign(CENTER);
  text(
    brightness < 100 ? "Dim light = rods active, color fades" : "Bright light = cones active, red/blue vivid",
    width / 2, 30
  );
 
  for (let b of bubbles) {
    if (!paused) {
      b.y -= b.speed;
      if (b.y < -b.size) {
        b.y = height + b.size;
        b.x = random(width);
      }
    }
    drawBubble(b, saturation);
  }
 
  //Instructions
  fill(ink);
  textSize(11);
  textAlign(CENTER);
  text("Click a bubble: Guess its stress score", width / 2, height - 10);
 
  //Guess/reveal overlay
  if (paused && selectedBubble) {
    let b = selectedBubble;
 
    //Card background
    fill(brightness > 128 ? color(255, 255, 255, 225) : color(0, 0, 0, 215));
    rect(width / 2 - 120, height / 2 - 80, 240, 175, 8);
 
    fill(brightness > 128 ? color(0) : color(255));
    textAlign(CENTER, CENTER);
 
    if (!guessSubmitted) {
      //Prompt
      textSize(13);
      text("What's this person's stress level?", width / 2, height / 2 - 52);
      textSize(11);
      text("Enter a number from 1 to 10", width / 2, height / 2 - 30);
      guessInput.show();
      textSize(10);
      fill(brightness > 128 ? color(80) : color(180));
      text("Press ENTER to reveal", width / 2, height / 2 + 42);
 
    } else {
      //Reveal
      guessInput.hide();
 
      let err    = abs(guessValue - b.stress);
      let verdict;
      if (err === 0)      verdict = "Exact: color told you everything";
      else if (err <= 1)  verdict = "Close (" + nf(err, 1, 0) + " off): color got you there";
      else if (err <= 3)  verdict = "Off by " + nf(err, 1, 0) + ": color gave a feeling, not a fact";
      else                verdict = "Off by " + nf(err, 1, 0) + ": color misled you";
 
      textSize(13);
      text("You guessed: " + guessValue, width / 2, height / 2 - 55);
      text("Actual stress: " + b.stress, width / 2, height / 2 - 32);
 
      //Verdict line
      textSize(11);
      fill(err <= 1 ? color(60, 160, 80) : color(200, 60, 60));
      text(verdict, width / 2, height / 2 - 8);
 
      //Rest of the data
      fill(brightness > 128 ? color(0) : color(255));
      textSize(12);
      text("Occupation: " + b.occ,       width / 2, height / 2 + 18);
      text("Sleep: " + b.sleep + " hrs", width / 2, height / 2 + 38);
      text("Quality: " + b.quality,      width / 2, height / 2 + 58);
 
      textSize(10);
      fill(brightness > 128 ? color(80) : color(180));
      text("press SPACE to continue", width / 2, height / 2 + 82);
    }
  } else {
    guessInput.hide();
  }
}
 
function mousePressed() {
  for (let b of bubbles) {
    let d = dist(mouseX, mouseY, b.x, b.y);
    if (d < b.size / 2) {
      if (selectedBubble === b && guessSubmitted) {
        break; //Spacebar resumes after reveal
      } else if (selectedBubble === b) {
        //Resume
        paused         = false;
        selectedBubble = null;
        guessValue     = null;
        guessSubmitted = false;
        guessInput.value("");
      } else {
        // select
        paused         = true;
        selectedBubble = b;
        guessValue     = null;
        guessSubmitted = false;
        guessInput.value("");
      }
      break;
    }
  }
}
 
function keyPressed() {
  if (keyCode === ENTER && paused && selectedBubble && !guessSubmitted) {
    let g = float(guessInput.value());
    if (!isNaN(g) && g >= 1 && g <= 10) {
      guessValue     = g;
      guessSubmitted = true;
    }
  }
  if (key === ' ' && (!paused || guessSubmitted)) {
    paused         = false;
    selectedBubble = null;
    guessValue     = null;
    guessSubmitted = false;
    guessInput.value("");
  }
}