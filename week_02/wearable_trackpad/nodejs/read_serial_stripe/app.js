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

var inString;

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

		var currentReading = parseInt(slicedString);
		// console.log(currentReading);
		
    //Send data to browser
    io.sockets.emit('touch', currentReading);     
	}
});	