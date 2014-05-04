/*------------- MY OTHER CANVAS -------------*/
//In the html file we created a separate canvas only to draw the effects
//We need that because matter.js creates — and updates  — its own canvas 
var myCanvas = document.getElementById('canvas-effects');
var ctx = myCanvas.getContext('2d');
resizeCanvas();

var request;

var collisionEffects = [];
var i = 0;
draw();

function draw() {
    request = requestAnimFrame(draw);
}

/*--------------- TRIANGLE ---------------*/
function initCollisionEffect(obj, _pos) {
    obj.pos = _pos;
}

function drawCollision(pos) {

    console.log(pos);

    ctx.save();
    ctx.translate(pos.x, pos.y);

    // ctx.fillStyle = parseHslaColor(0, 0, 0, 0.3);
    // ctx.beginPath();
    // ctx.arc(0, 0, 60, 60, 0, Math.PI*2, false);
    // ctx.fill();    

    for (var angle = 0; angle < 360; angle += 20) {
        // var date = new Date();
        // var milis = date.getMilliseconds();                 
        // var rotateAngle = milis/400;
        var rotateAngle = 0;

        var radius = 30;
        var x1 = Math.cos(degreeToRadian(angle) + rotateAngle) * radius;
        var y1 = Math.sin(degreeToRadian(angle) + rotateAngle) * radius;

        radius = 60;
        var x2 = Math.cos(degreeToRadian(angle) + rotateAngle) * radius;
        var y2 = Math.sin(degreeToRadian(angle) + rotateAngle) * radius;

        ctx.strokeStyle = parseHslaColor(0, 0, 0, 0.3);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    ctx.restore();
}