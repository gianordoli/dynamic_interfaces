var connect = require('connect'),
		 fs = require('fs'),
	   util = require('util'),
		 io = require('socket.io').listen(9001), // WS port
	   port = 9000, // HTTP port
	
	// define a class
 SerialPort = require("serialport").SerialPort,
	  sPort = "/dev/tty.usbmodem1411",
	// create an instance (object)
	arduino = new SerialPort(sPort, {
	baudrate: 9600
	});

// create web server using connect 
connect.createServer(connect.static(__dirname + '/public')).listen(port);
util.log('the server is running on port: ' + port);

// init socket.io
io.set('log level', 1);

var data;		//list of PVectors with latest readings
var maxSize;	//size of the list
var average;	//normalized PVector based on AVERAGE
var threshold;	//Minimun value to add to data
var myCursor;

var inString;

setup();

function setup() {
  
  data = new Array();
  maxSize = 60;
  average = { x: 0, y: 0 };
  threshold = 10;
}

// receive data from serial (arduino)
arduino.on('data', function(data) { // data comes in Buffer <   >

	// console.log(data);
	inString += data.toString();
	// console.log(inString);
	var slicedString;

	//Checking if there is a B and an E in the data
	if(inString.indexOf('E') >= 0 && inString.indexOf('B') >= 0){
		//Chopping the string to get only the value btw the B and the E
		slicedString = inString.substring(inString.indexOf('B') + 1, inString.indexOf('E'));
		// console.log(slicedString);
		inString = '';

		var currentReading = { x: 0, y: 0};
		currentReading.x = slicedString.substring(0, slicedString.indexOf('\t'));
		currentReading.x = parseInt(currentReading.x);
		currentReading.y = slicedString.substring(slicedString.indexOf('\t') + 1, slicedString.length);
		currentReading.y = parseInt(currentReading.y);
		// console.log(currentReading);
		addData(currentReading);        
	}
});	

function draw() {
  // background(0);
  // debug();
  // myCursor.update();
  // myCursor.display();
}

function debug(){
  //Mean average
  console.log('AVERAGE > x: ' + average.x + ', y: ' + average.y);

  //Direction
  console.log('DIRECTION > x: ' + myCursor.dir.x + ', y: ' + myCursor.dir.x);
}

function addData(currentReading){  
  if(data.length >= maxSize){
    data.shift();
  }

  if(Math.abs(currentReading.x) >= threshold &&
    Math.abs(currentReading.y) >= threshold){
    currentReading = normalize(currentReading);
	currentReading.x = roundTo2Decimals(currentReading.x);
	currentReading.y = roundTo2Decimals(currentReading.y);
	// console.log(currentReading.x);
    data.push(currentReading);
  }else{
    var neutral = {x: 0, y: 0 };
    // console.log(neutral.x);
    data.push(neutral);
  }
 // console.log(data.length);

  getAverage();
}

function getAverage(){
  for(var i = 0; i < data.length; i++){
    average.x += data[i].x;
    average.y += data[i].y;
  }
  average.x /= data.length;
  average.y /= data.length;
  average.x = roundTo2Decimals(average.x);
  average.y = roundTo2Decimals(average.y);  
  console.log(average);

  //Send data to browser
  io.sockets.emit('move', average);
}

var normalize = function(obj){
	var normalized = {
       	x: obj.x / (Math.abs(obj.x) + Math.abs(obj.y)),
       	y: obj.y / (Math.abs(obj.x) + Math.abs(obj.y))
    }
    return normalized;
}	

var roundTo2Decimals = function(numberToRound) {
  return Math.round(numberToRound * 100) / 100;
}