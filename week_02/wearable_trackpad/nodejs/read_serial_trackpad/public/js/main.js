window.onload = function() {

	var average = { x: 0, y: 0 };
	var myCursor = document.getElementById('square');
	initCursor(myCursor);	

	var socket = io.connect('http://localhost:9001');
	socket.on('move', function(data) {
		// console.log('data in');
		// console.log(data);
		average = data;
		// console.log(average);
		myCursor.update();
	});

	/*---------- CURSOR ----------*/
	function initCursor(obj){
	  var tempSize = { x: 50, y: 50 };
	  var tempPos = { x: 300, y: 300 };
	  var tempDir = { x: 0, y: 0 };
	  var tempSpeed = 10;

	  obj.size = tempSize;
	  obj.pos = tempPos;
	  obj.dir = tempDir;
	  obj.speed = tempSpeed;
	  
	  obj.update = function(){
	  	console.log(this.dir.x);
	    // this.dir.x = average.x;
	    // this.dir.y = average.y;
	    // this.pos.x += this.dir.x * this.speed;
	    // this.pos.y += this.dir.y * this.speed;
	    // if(pos.x + size.x/2 >= width){
	    //   pos.x = width - size.x/2;
	    // }
	    // if(pos.x - size.x/2 <= 0){
	    //   pos.x = size.x/2;
	    // }    
	    // if(pos.y + size.x/2 >= height){
	    //   pos.y = height - size.y/2;
	    // }
	    // if(pos.y - size.x/2 <= 0){
	    //   pos.y = size.y/2;
	    // }
	  }
	  
	  this.display = function(){
	    // ellipse(pos.x, pos.y, size.x, size.y);
	    obj.offsetLeft = pos.x;
	  }
	}	

	// Video
	var video = document.getElementById("video");

	// Buttons
	var playButton = document.getElementById("play-pause");
	var fullScreenButton = document.getElementById("full-screen");

	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");


	// Event listener for the play/pause button
	playButton.addEventListener("click", function() {
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
	});


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