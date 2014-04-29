// Matter.js - http://brm.io/matter-js/

/*------------- SOCKET LISTENERS -------------*/
socket.on('new user desktop', function(user) {
    createNewUser(user);
});

socket.on('update user desktop', function(user) {
    updateUsers(user);
});

socket.on('remove user desktop', function(userId) {
    removeUser(userId);
});

/*------------- MATTER OBJECTS -------------*/
// Matter module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;

//In the html file we created a separate canvas only to draw the effects
//We need that because matter.js creates — and updates  — its own canvas 
var myCanvas = document.getElementById('canvas-effects');
var ctx = myCanvas.getContext('2d');
resizeCanvas();
var alerts = [];

//Matter.js canvas
var container = document.getElementById('canvas-container');
// create a Matter.js engine
var engine = Engine.create(container, {
    render: {
        options: {
            showAngleIndicator: true,
            wireframes: false,
            showAngleIndicator: false
        }
    }
});

// add some some walls to the world
var thickness = 20;
World.add(engine.world, [
    Bodies.rectangle(0, window.innerHeight / 2, thickness, window.innerHeight, {
        isStatic: true
    }),
    Bodies.rectangle(window.innerWidth, window.innerHeight / 2, thickness, window.innerHeight, {
        isStatic: true
    }),
    Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, thickness, {
        isStatic: true
    }),
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, thickness, {
        isStatic: true
    })
]);

/*------------- BALLS -------------*/
//Create ball
function createNewBall() {
    var newCircle = Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 15, {
        friction: 0.001,
        restitution: 0.5,
        density: 0.0001,
    });
    newCircle.render.fillStyle = 'gray';
    newCircle.render.strokeStyle = 'gray';
    //Add to stage
    World.add(engine.world, newCircle);
}

Events.on(engine, 'beforeUpdate', function(event) {
    for (var key in users) {
        $('#' + key).css({
            left: 15 + users[key].bar.position.x + 'px',
            top: 15 + users[key].bar.position.y + 'px',
        });
    }
});

var playerWithBall;

Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;

    // change object colours to show those starting a collision

    //OLD COLLISION STUFF
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        // console.log(pair);
        // console.log(pair.collision.tangent.x);

        //Is object A a circle?
        if (typeof pair.bodyA.circleRadius !== 'undefined') {

            // console.log(pair.bodyA);
            drawCollision(pair.bodyA.position);

            //Is object B one of our bars?
            if (!pair.bodyB.isStatic) {
                var newColor = pair.bodyB.render.fillStyle;
                pair.bodyA.render.fillStyle = newColor;
                pair.bodyA.render.strokeStyle = newColor;
                // play collision sound
                playSound(0, ~~ (Math.random() * 10), 1, 1, 1);
                //Store that id, man!
                for (var key in users) {
                    if (users[key].bar.id == pair.bodyB.id) {
                        playerWithBall = users[key];
                    }
                }

                //Wait, what?! Is B the GOAL?!
            } else if (pair.bodyB.id == goalLeft.id || pair.bodyB.id == goalRight.id) {
                console.log('GOOOOOOOOOOOOOOOL!');
                printGoal();

                //REMOVE THE BALL!
                Composite.remove(engine.world, pair.bodyA, true);
                createNewBall();
            }

        //Is object B a circle?
        } else if (typeof pair.bodyB.circleRadius !== 'undefined') {

            // console.log(pair.bodyB);
            drawCollision(pair.bodyB.position);

            //Is object A one of our bars?
            if (!pair.bodyA.isStatic) {
                var newColor = pair.bodyA.render.fillStyle;
                pair.bodyB.render.fillStyle = newColor;
                pair.bodyB.render.strokeStyle = newColor;
                // play collision sound
                playSound(0, ~~ (Math.random() * 10), 1, 1, 1);
                //Store that id, man!
                for (var key in users) {
                    if (users[key].bar.id == pair.bodyA.id) {
                        playerWithBall = users[key];
                    }
                }

                //Wait, what?! Is A the GOAL?!
            } else if (pair.bodyA.id == goalLeft.id || pair.bodyA.id == goalRight.id) {
                console.log('GOOOOOOOOOOOOOOOL!');
                printGoal();
                //REMOVE THE BALL!
                Composite.remove(engine.world, pair.bodyB, true);
                createNewBall();
            }
        }
    }
});

// run the engine
createNewBall();
Engine.run(engine);


function printGoal() {
    playSound(1, 1, 1, 1, 1);
    $('#goalBanner').css('opacity', 1).html('You did it ' + playerWithBall.name + '!');
    // player grows
    playerWithBall.bar.render.lineWidth += 7;
    playerWithBall = '';
    setTimeout(function() {
        $('#goalBanner').css('opacity', 0);
    }, 5000);
}

/*------------- USERS -------------*/
//ASSOCIATIVE ARRAY!!!!
var users = {};

function initUser(obj, _id, _name, _color, _scale, _bar) {
    //Variables
    obj.id = _id;
    obj.name = _name;
    obj.color = _color;
    obj.scale = _scale;

    obj.bar = _bar;

    obj.update = function(_force) {

        // var angle = - _angle/10000;
        var force = _force;
        // console.log(angle);
        // console.log(force);

        Body.applyForce(obj.bar, {
            x: 0,
            y: 0
        }, {
            x: force.x / 10000,
            y: force.y / 10000
        });
        // Body.rotate(obj.bar, angle);
    };

    //Create div with name
    var myHtml = '<div class="flying-name" id=' + obj.id + '>' + obj.name + '</div>';
    $('body').append(myHtml);
}

// initUser.prototype.update = function(){}

// $('body').keypress(function(e) {
//   console.log(e.keyCode);
//   // if (e.keyCode == 13) {
//   //   createNewUser();
//   // }
//   // else if(e.keyCode == 32) {
//   //   removeUser();
//   // }
// });

function createNewUser(user) {

    //Grab the user properties
    var id = user.id;
    var name = user.name;
    var color = user.color;

    //Creates a new bar
    var x = 10 + ~~(Math.random() * 200);
    var y = 10 + ~~(Math.random() * 200);
    var bar = Bodies.rectangle(x, y, 30, 30, {
        friction: 0.001,
        restitution: 0.05,
        density: 0.001,
    });
    bar.render.fillStyle = color;
    bar.render.strokeStyle = color;
    World.add(engine.world, bar);

    //Creates a new user object and add it to the array
    var newUser = new Object();
    initUser(newUser, id, name, color, 1, bar);
    console.log(newUser);
    users[id] = newUser;
    // console.log(users);
}

function updateUsers(user) {
    users[user.id].update(user.force);
}

function removeUser(userId) {
    //Remove object from the world
    Composite.remove(engine.world, users[userId].bar, true);
    //Remove user object
    delete users[userId];
    $('#' + userId).remove();
}

function drawCollision(pos){

    console.log(pos);

    ctx.save();
    ctx.translate(pos.x, pos.y);

    // ctx.fillStyle = parseHslaColor(0, 0, 0, 0.3);
    // ctx.beginPath();
    // ctx.arc(0, 0, 60, 60, 0, Math.PI*2, false);
    // ctx.fill();    

    for(var angle = 0; angle < 360; angle += 20){
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

//Resizing the canvas to the full window size
function resizeCanvas(){
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvasPosition = myCanvas.getBoundingClientRect(); // Gets the canvas position
    myCanvas.width = screenWidth - 4;
    myCanvas.height = screenHeight - 4;
}   

/*------------- MY PROCESSING FUNCTIONS -------------*/
var normalize = function(obj) {
    var normalized = {
        x: obj.x / (Math.abs(obj.x) + Math.abs(obj.y)),
        y: obj.y / (Math.abs(obj.x) + Math.abs(obj.y))
    };
    return normalized;
};

var degreeToRadian = function(degrees){
    var radians = degrees*Math.PI/180;
    return radians
}

var parseHslaColor = function(h, s, l, a){
    var myHslColor = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a +')';
    //console.log('called calculateAngle function');
    return myHslColor;
}

var dist = function(x1, y1, x2, y2) {
    var angle = Math.atan2(y1 - y2, x1 - x2);
    var distance;
    if ((y1 - y2) == 0) {
        distance = (x1 - x2) / Math.cos(angle);
    } else {
        distance = (y1 - y2) / Math.sin(angle);
    }
    return distance;
};

// createStage(1);