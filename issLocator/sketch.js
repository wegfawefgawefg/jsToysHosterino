// var dataURL = 'http://api.open-notify.org/iss-now.json';
// a proxy server has been setup at https://toys.dickrippers.org/api_proxy_server/iss-now
var iss_positions_api_url = 'https://toys.dickrippers.org/api_proxy_server/iss-now';
// var data2URL = 'http://api.open-notify.org/astros.json';
// a proxy server has been setup at https://toys.dickrippers.org/api_proxy_server/astros
var iss_astronauts_api_url = 'https://toys.dickrippers.org/api_proxy_server/astros';

var iss_positions_data;
var iss_astronauts_data;

var longitude = 0;
var latitude = 0;

var mapX;
var mapY;
var mapWidth;
var mapHeight;

var earthTexture;

var shorterDimension;
var ellipseWidth;

var context2d;
var c2dDim;

var longitudeP;
var latitudeP;
const readout = document.getElementById('readout');

function preload() {
  longitudeP = select('#longitude');
  latitudeP = select('#latitude');

  update_iss_positions();
  update_iss_astronauts();
  earthTexture = loadImage('earthERPLLSmall.gif');
}

function update_iss_positions() {
  iss_positions_data = loadJSON(iss_positions_api_url, iss_pos_data_rcvd_callback);
}

function update_iss_astronauts() {
  iss_astronauts_data = loadJSON(iss_astronauts_api_url, astronaut_data_rcvd_callback);
}

function setup() {
  frameRate(1000);
  var canvas3D = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas3D.style('z-index', '-2');
  canvas3D.position(0, 0);

  setInterval(update_iss_positions, 2000);
  setInterval(update_iss_astronauts, 10000);

  colorMode(HSB, 360, 100, 100, 1);

  //  //   which is shorter height or width
  shorterDimension = min(height, width);
  ellipseWidth = shorterDimension / 2;

  //  set map variables
  mapX = 0;
  mapY = 0;
  mapWidth = width / 2;
  mapHeight = height / 2;

  //
  c2sDim = shorterDimension / 2;
  context2d = createGraphics(500, 500);
}
function draw() {
  background(0);
  fill(255);

  //  mouse rotation
  // var verticalRotNormalized = map( mouseY, 0, height, 0, 1 );
  // var horizontalRotNormalized = map( mouseX, 0, width, 1, 0 );
  // var mxRot = map( verticalRotNormalized, 0, 1, HALF_PI, -HALF_PI );
  // var myRot = map( horizontalRotNormalized, 0, 1, 0, TWO_PI );

  //  iss rotation
  var issNormalizedX = map(longitude, -180, 180, 1, 0);
  var issNormalizedY = map(latitude, -90, 90, 0, 1);
  var xRot = map(issNormalizedY, 0, 1, HALF_PI, -HALF_PI);
  var yRot = map(issNormalizedX, 0, 1, 0, TWO_PI);

  //  draw the earth
  //  //   which is shorter height or width
  var shorterDimension = min(height, width);
  var earthRadius = shorterDimension / 4;

  //  draw earth
  push();
  stroke(255);
  translate(0, 0);
  rotateX(xRot);
  rotateY(yRot);
  texture(earthTexture);
  sphere(earthRadius);
  pop();

  //  draw ISS
  push();
  noStroke();
  fill(0, 100, 100, 1.0);
  translate(0, 0, earthRadius * 2);
  sphere(2, 5, 5);

  stroke(0, 100, 100, 1.0);
  strokeWeight(1);
  var lineLength = shorterDimension / 10;
  line(0, 0, -windowWidth, 0);
  translate(lineLength, -height / 8);
  pop();

  push();
  var lineStartX = windowWidth / 10 + mouseX;
  var lineStartY = windowHeight / 10;
  var lineEndY = lineStartY;
  var lineEndX = windowWidth / 5;
  //resetMatrix();
  translate(-windowWidth / 2, -windowHeight / 2);
  strokeWeight(5);
  line(0, windowHeight / 4, windowWidth / 10, windowHeight / 4);
  line(3, windowHeight / 4, 3, windowHeight / 2);

  pop();
}


function iss_pos_data_rcvd_callback(data) {
  longitude = data.iss_position.longitude;
  longitudeP.html('Longitude: ' + longitude);
  latitude = data.iss_position.latitude;
  latitudeP.html('Latitude: ' + latitude);
}

//  distribute the data into variables
function astronaut_data_rcvd_callback(data) {
  astronaut_div = select('#astronauts');
  astronaut_div.html('');
  astronaut_div.children = [];
  data.people.forEach((astronaut) => {
    var p = createP(astronaut.name);
    p.parent(astronaut_div);
  });

}
