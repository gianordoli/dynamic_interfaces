window.onload = function() {

	/*-------------------- WEARABLE STUFF --------------------*/
	var data = new Array();	//list of PVectors with latest readings
	var maxSize = 10;		//size of the list

	//Fill the array with 0's
	//Otherwise the average will begin unstable
	for(var i = 0; i < maxSize; i++){
		var neutral = 0;
	    data.push(neutral);
	}

	// var average = 0;			// mean average of the last 20 (maxSize) readings
	var basis;					// no-touching value	
	var threshold = 100;		//Minimum value to add to data
	var sliderSpeed = 1/5000;	//Slider change "speed"	

	var isCalibrated = false;

	var isPressing = false;
	var timer = 0;
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
	socket.on('touch', function(reading) {
		// console.log('data in');
		// console.log(reading);
		
		//Initialize calibration
		if(!isCalibrated){
			setBasis(reading);
		//If it's calibrated, starts reading/updating the video
		}else{
			var currentReading = roundTo3Decimals(reading - basis);
			// console.log('basis: ' + basis + ', reading: ' + currentReading);
			// console.log(currentReading);
			addData(currentReading);	

			if(isPressing){
				timer ++;
				console.log(timer);
				if(timer >= 100){
					isPressing = false;
					timer = 0;
				} 
			}		
		}
	});

	// 0: SET BASIS
	function setBasis(reading){
		if(data.length < maxSize * 20){
			data.push(reading);
			console.log('calibrating...');
			console.log(reading);
		}else{
			basis = getAverage();
			//clears the array
			console.log('CALIBRATED! basis value: ' + basis);
			isCalibrated = true;
			data = [];			
		}
	}

	// 2: Add data to an array
	// Filter based on threshold
	function addData(currentReading){  
		if(data.length >= maxSize){
		    data.shift(); //Take the first element of an array out
		}

		//It it is touching, get the average...
		if(Math.abs(currentReading) > threshold){
			// console.log(currentReading);
		    data.push(currentReading);

		//If not, CLEARS THE ARRAY! Stop!
		}else{
			data.push(0);
		    // for(var i = 0; i < data.length; i++){
		    // 	data[i] = 0;
		    // }
		}
		
		 // console.log(data.length);
		var average = getAverage();
		if(isTaping(data[0], data[Math.floor(data.length)/2], data[data.length - 1])){
			if(!isPressing){
				console.log('Called play');
				playPause();
				isPressing = true;
			}
		}
		
		if(Math.abs(average) > threshold && !isPressing){
			slider.update(average);
		}
	}

	var isTaping = function(first, middle, last){
		var tap = false;
		if(Math.abs(first) < threshold && Math.abs(middle) > threshold * 3 && Math.abs(last) < threshold){
			tap = true;
		}
		return tap;
	}

	// 3: Calculates the average of readings, based on the array size (maxSize)
	var getAverage = function(){
		var average = 0;
		// var firstQuarter = 0;
		// var lastQuarter = 0;		

		for(var i = 0; i < data.length; i++){
			average += data[i];
		}

		average /= data.length;
		average = roundTo3Decimals(average);
		
	  // console.log(average);
		return average;
	}

	// 4: Update the seek slider
	slider.update = function(average){
		// console.log(average);
		// if(Math.abs(average) > threshold){
			video.pause();
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