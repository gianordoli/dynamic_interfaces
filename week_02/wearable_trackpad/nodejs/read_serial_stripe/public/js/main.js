window.onload = function() {

	/*-------------------- WEARABLE STUFF --------------------*/
	var data = new Array();	//list of PVectors with latest readings
	var maxSize = 20;		//size of the list

	//Fill the array with 0's
	//Otherwise the average will begin unstable
	for(var i = 0; i < maxSize; i++){
		var neutral = 0;
	    data.push(neutral);
	}

	var average = 0;			// mean average of the last 20 (maxSize) readings
	var threshold = 200;		//Minimum value to add to data
	var sliderSpeed = 1/2000;	//Slider change "speed"	
	/*--------------------------------------------------------*/

	// Video
	var video = document.getElementById("video");

	// Buttons
	var playButton = document.getElementById("play-pause");
	var fullScreenButton = document.getElementById("full-screen");

	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");

	// Our wearable slider 
	var slider = new Object();

	// 1: Data comes in
	var socket = io.connect('http://localhost:9001');
	socket.on('touch', function(data) {
		// console.log('data in');
		// console.log(data);
		addData(data);
	});

	// 2: Add data to an array
	// Filter based on threshold
	function addData(currentReading){  
	  if(data.length >= maxSize){
	    data.shift(); //Take the first element of an array out
	  }

	  if(Math.abs(currentReading) > threshold){
		// console.log(currentReading);
	    data.push(currentReading);
	  }else{
	    var neutral = 0;
	    // console.log(neutral.x);
	    data.push(neutral);
	  }
	 // console.log(data.length);

	  getAverage();
	}

	// 3: Calculates the average of readings, based on the array size (maxSize)
	function getAverage(){
	  for(var i = 0; i < data.length; i++){
	    average += data[i];
	  }
	  average /= data.length;
	  average = roundTo3Decimals(average);
	  // console.log(average);
	  slider.update(average);
	}

	// 4: Update the seek slider
	slider.update = function(average){
		// console.log(average);
		// if(Math.abs(average) > threshold){
			// video.pause();
			video.currentTime += average * sliderSpeed;
			// video.play();
		// }
	}

	var roundTo3Decimals = function(numberToRound) {
	  return Math.round(numberToRound * 1000) / 1000;
	}

	// Event listener for the play/pause button
	playButton.addEventListener("click", playPause);

	function playPause(){
		console.log('play!');
		console.log('----');
		if (video.paused == true) {
			// Play the video
			video.play();

			// Update the button text to 'Pause'
			playButton.innerHTML = "Pause";
		} else {
			// Pause the video
			video.pause();

			// Update the button text to 'Play'
			playButton.innerHTML = "Play";
		}		
	}


	// Event listener for the full-screen button
	fullScreenButton.addEventListener("click", function() {
		if (video.requestFullscreen) {
			video.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
			video.mozRequestFullScreen(); // Firefox
		} else if (video.webkitRequestFullscreen) {
			video.webkitRequestFullscreen(); // Chrome and Safari
		}
	});


	// Event listener for the seek bar
	seekBar.addEventListener("change", function() {
		// Calculate the new time
		var time = video.duration * (seekBar.value / 100);

		// Update the video time
		video.currentTime = time;
	});

	// Pause the video when the seek handle is being dragged
	seekBar.addEventListener("mousedown", function() {
		video.pause();
	});

	// Play the video when the seek handle is dropped
	seekBar.addEventListener("mouseup", function() {
		video.play();
	});	

	
	// Update the seek bar as the video plays
	video.addEventListener("timeupdate", function() {
		// Calculate the slider value
		var value = (100 / video.duration) * video.currentTime;

		// Update the slider value
		seekBar.value = value;
	});

	// Event listener for the volume bar
	volumeBar.addEventListener("change", function() {
		// Update the video volume
		video.volume = volumeBar.value;
	});
}