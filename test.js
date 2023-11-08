let ele;
let button;

function setup() {
  createCanvas(710, 400);
  //Here we create a p5.MediaElement object
  //using the createAudio() function.
  ele = createAudio("assets/beat.mp3");
  ele.loop();
  background(200);

  button = createButton("2x speed");
  button.position(100, 68);
  button.mousePressed(twice_speed);

  button = createButton("half speed");
  button.position(200, 68);
  button.mousePressed(half_speed);

  button = createButton("reverse play");
  button.position(300, 68);
  button.mousePressed(reverse_speed);

  button = createButton("STOP");
  button.position(400, 68);
  button.mousePressed(stop_song);

  button = createButton("PLAY!");
  button.position(500, 68);
  button.mousePressed(play_speed);
}

function twice_speed() {
  ele.speed(2);
}

function half_speed() {
  ele.speed(0.5);
}

function reverse_speed() {
  ele.speed(-1);
}

function stop_song() {
  ele.stop();
}

function play_speed() {
  ele.play();
}
