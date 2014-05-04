/*------------- MY OTHER CANVAS -------------*/
//In the html file we created a separate canvas only to draw the effects
//We need that because matter.js creates — and updates  — its own canvas 
var myCanvas = document.getElementById('canvas-effects');
var ctx = myCanvas.getContext('2d');
var collisionEffects = [];

setup();

function setup(){
    isEffectLoaded = true;
    resizeCanvas();
    console.log('setup');
}

function draw(){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    // console.log(collisionEffects.length);

    collisionEffects.forEach(function(obj, index){
        // console.log(obj.pos.x);
        obj.draw(index);
    });

	// request = requestAnimFrame(draw);
}

function shake(normal){
    // console.log('shake');
    var shakeDirection;
    if(normal.x == 1){
        shakeDirection = 'right';
    }else if(normal.x == -1){
        shakeDirection = 'left';
    }else if(normal.y == 1){
        shakeDirection = 'down';
    }else if(normal.y == -1){
        shakeDirection = 'up';
    }
    console.log(shakeDirection);
    $('#canvas-container').effect( "bounce", {direction: shakeDirection, distance: 5, times: 2}, "fast" );

// selector.effect( "bounce", {arguments}, speed );
// Arguments:
// direction: The direction of the effect. Can be "up", "down", "left", "right". Default is "up".
// distance: Distance to bounce. Default is 20
// mode: The mode of the effect. Can be "show", "hide" or "effect". Default is "effect".
// times: Times to bounce. Default is 5.

}

/*--------------- COLLISION ---------------*/
function initCollision(obj, _pos, strokeStyle, depth){
    //vars
	obj.pos = _pos;    
    // obj.strokeStyle = strokeStyle;
    obj.strokeStyle = parseHslaColor(0, 0, 0, 0.3);
    var d = new Date();
    obj.timer = d.getTime() + 300;
    obj.radius = depth * 5;

    //functions
    obj.draw = drawCollision;
}

function drawCollision(index){
    var d = new Date();
    // console.log('millis: ' + d.getTime() + ', timer: ' + this.timer);
    if(this.timer > d.getTime()){
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);

        for(var angle = 0; angle < 360; angle += 20){

        var innerAlertRadius = map(this.timer - d.getTime(),
                                   150, 0,
                                   1.2, 2);
        var outerAlertRadius = map(this.timer - d.getTime(),
                                   300, 150,
                                   1.2, 2);
          innerAlertRadius = constrain(innerAlertRadius, 1.2, 2);
          outerAlertRadius = constrain(outerAlertRadius, 1.2, 2);

            var rotateAngle = 0;

            var x1 = Math.cos(degreeToRadian(angle) + rotateAngle) * this.radius * innerAlertRadius;
            var y1 = Math.sin(degreeToRadian(angle) + rotateAngle) * this.radius * innerAlertRadius;

            var x2 = Math.cos(degreeToRadian(angle) + rotateAngle) * this.radius * outerAlertRadius;
            var y2 = Math.sin(degreeToRadian(angle) + rotateAngle) * this.radius * outerAlertRadius;

            ctx.strokeStyle = this.strokeStyle;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();                   
        }
        ctx.restore();        
    }else{
        collisionEffects.splice(index, 1);
    }
}