$(document).ready(function(){
	canvas = document.getElementById('myCanvas');
	ctx = canvas.getContext('2d');
	canvasResize();

	mouse = new Object();
	mouse = {
		x: 0,
		y: 0
	}

	document.addEventListener('mousemove', function(evt){
		getMousePos(evt);
	}, false);	

	// canvas.addEventListener('click', function(evt){
	// 	update();
	// }, false);	
});

/*---------- VARIABLES ----------*/
var canvas;
var ctx;

//Canvas position
var canvasPosition;
var nColumns;
var nLines;
var mouse;

var rects;
var rectSize;
var types;
// var myList = new Array('image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video', 'image', 'text', 'text', 'text', 'text', 'text', 'image', 'image', 'image', 'image', 'audio', 'video');
var myList;

/*---------- FUNCTIONS ----------*/							

function setup(data){

	rectSize = {
		x: 6,
		y: 8
	}

	myList = data;
	types = new Array();
	loadTypes();
	createPalette();

	rects = new Array(myList.length);

	nColumns = Math.floor(canvas.width/rectSize.x);
	// console.log(nColumns);
	nLines = Math.ceil(rects.length / nColumns);
	// console.log(nLines);
	canvas.height = nLines * rectSize.y;

	for(var i = 0; i < rects.length; i ++){
		var rectangle = new Object;	//creating object
		initDefragRect(i, rectangle, myList[i].extension, myList[i].filename);		//initializing
		rects[i] = rectangle;
	}

	update();
}

function update(){
	for(var i = 0; i < rects.length; i++){
		rects[i].update();
	}
	draw();
}

function draw(){
	//Erasing the background
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < rects.length; i ++){
		rects[i].draw();
		if(rects[i].isHover){
			// console.log(rects[i].filename);
			drawFileDesc(rects[i], rects[i].pos);
		}			
	}
}

function drawFileDesc(obj, position){
	ctx.font="12px Arial";
	var txt = obj.filename + '.' + obj.type;
	var textWidth = ctx.measureText(txt).width;
	// console.log(textWidth);
	ctx.fillStyle = parseHslaColor(0, 0, 100, 1);
	ctx.strokeStyle = parseHslaColor(0, 0, 0, 1);
	ctx.fillRect(position.x, position.y - 20, textWidth + 10, 20);
	ctx.strokeRect(position.x, position.y - 20, textWidth + 10, 20);

	ctx.textBaseline = 'bottom';
	ctx.fillStyle = parseHslaColor(0, 0, 0, 1);
	ctx.fillText(txt, position.x + 5, position.y - 3);
}

function loadTypes(){
	for(var i = 0; i < myList.length; i ++){
		var alreadyListed = false;

		for(var j = 0; j < types.length; j ++){
			if(myList[i].extension == types[j]){
				alreadyListed = true;
			}
		}

		if(!alreadyListed){
			types.push(myList[i].extension);
		}
	}
	// console.log(types);
}

function createPalette(){
	palette = new Array(types.length);
	for(var i = 0; i < palette.length; i ++){
		palette[i] = map(i, 0, palette.length - 1, 0, 320);
	}
	// console.log(palette);
}

var findTypeColor = function(objType){
	var typeHue;
	for(var i = 0; i < types.length; i ++){	
		if(types[i] == objType){
			typeIndex = i;
		}
	}
	typeHue = palette[typeIndex];
	return typeHue;
}

/*---------- SQUARES ----------*/
function initDefragRect(i, obj, tempType, tempFilename){
	//Variables

		//initializing
		var tempSize = {
			x: rectSize.x,
			y: rectSize.y
		}

		var tempPos = {
			x: (i % nColumns) * tempSize.x,
			y: Math.floor((i/nColumns)) * tempSize.y
		}		

		var tempFillColor = {
			h: findTypeColor(tempType),
			s: 100,
			l: 50,
			a: 1
		}

		var tempStrokeColor = {
			h: findTypeColor(tempType),
			s: 0,
			l: 0,
			a: 1
		}

		//Attributing to the object
		obj.type = tempType;
		obj.filename = tempFilename;
		obj.size = tempSize;
		obj.pos = tempPos;
		obj.fillColor = parseHslaColor(tempFillColor.h, tempFillColor.s, tempFillColor.l, tempFillColor.a);
		obj.strokeColor = parseHslaColor(tempStrokeColor.h, tempStrokeColor.s, tempStrokeColor.l, tempStrokeColor.a);				
		obj.isHover = false;

	//Functions
	obj.update = function(){
		this.checkHover();
	}

	obj.draw = function(){
		ctx.fillStyle = this.fillColor;
		ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		ctx.lineWidth = 1;
		ctx.strokeStyle = this.strokeColor;
		ctx.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);	
	}	

	obj.checkHover = function(){
		//Mouse Over
		if(this.pos.x < mouse.x && mouse.x < this.pos.x + this.size.x
			&& this.pos.y < mouse.y && mouse.y < this.pos.y + this.size.y){
			this.isHover = true;
			// console.log(this.filename);
			// console.log(rects[i].filename + '.' + rects[i].type);
		}else{
			this.isHover = false;
		}
	}	
}

/*---------- AUXILIAR FUNCTIONS ----------*/
//Resizing the canvas to the full window size
function canvasResize(){
	screenWidth = window.innerWidth;

	canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
	canvas.width = screenWidth - 20;
}	

var map = function(value, aMin, aMax, bMin, bMax){
  	var srcMax = aMax - aMin,
    	dstMax = bMax - bMin,
    	adjValue = value - aMin;
  	return (adjValue * dstMax / srcMax) + bMin;
}		

var parseHslaColor = function(h, s, l, a){
	var myHslColor = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a +')';
	//console.log('called calculateAngle function');
	return myHslColor;
}

function getMousePos(evt){
	mouse.x = evt.clientX - canvasPosition.left;
	mouse.y = evt.clientY - canvasPosition.top + document.body.scrollTop;
	update();
	// console.log('x: ' + mouse.x + ', y: ' + mouse.y);
	//You have to use evt.clientX! evt..x doesn't work with Firefox!
}	
//setup();
