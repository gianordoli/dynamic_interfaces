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

// STAGES
socket.on('stage random', function() {
    scene.blackhole();
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

/*------------- WORLD SETUP -------------*/
//Matter.js canvas
var container = document.getElementById('canvas-container');
// create a Matter.js engine
var engine = Engine.create(container, {
    render: {
        options: {
            showAngleIndicator: false,
            wireframes: false
        }
    }
});

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
        // console.log(pair.collision);

        //Shake scene!
        if (pair.collision.depth > 5) {
            // console.log('shake!');
            // console.log(pair.collision);
            shake(pair.collision.normal);
        }

        //Brighten the colors, IF THE COLLISION IS NOT WITH THE GOALS!
        // if (!pair.bodyA.isStatic && pair.bodyA.friction !== 0.00001 && !pair.bodyB.isStatic && pair.bodyB.friction !== 0.00001) {
            if (!pair.bodyA.isStatic && pair.bodyA.area < 3000 && !pair.bodyB.isStatic && pair.bodyB.area < 3000) {

            pair.bodyA.render.fillStyle = pair.bodyA.render.fillStyle.substring(0, pair.bodyA.render.fillStyle.lastIndexOf(',') + 2) +
                65 + pair.bodyA.render.fillStyle.substring(pair.bodyA.render.fillStyle.lastIndexOf('%'));
            pair.bodyA.render.strokeStyle = pair.bodyA.render.fillStyle;
            pair.bodyB.render.fillStyle = pair.bodyB.render.fillStyle.substring(0, pair.bodyB.render.fillStyle.lastIndexOf(',') + 2) +
                65 + pair.bodyB.render.fillStyle.substring(pair.bodyB.render.fillStyle.lastIndexOf('%'));
            pair.bodyB.render.strokeStyle = pair.bodyB.render.fillStyle;

            //Set colors back to normal
            setTimeout(function() {
                pair.bodyA.render.fillStyle = pair.bodyA.render.fillStyle.substring(0, pair.bodyA.render.fillStyle.lastIndexOf(',') + 2) +
                    50 + pair.bodyA.render.fillStyle.substring(pair.bodyA.render.fillStyle.lastIndexOf('%'));
                pair.bodyA.render.strokeStyle = pair.bodyA.render.fillStyle;
                pair.bodyB.render.fillStyle = pair.bodyB.render.fillStyle.substring(0, pair.bodyB.render.fillStyle.lastIndexOf(',') + 2) +
                    50 + pair.bodyB.render.fillStyle.substring(pair.bodyB.render.fillStyle.lastIndexOf('%'));
                pair.bodyB.render.strokeStyle = pair.bodyB.render.fillStyle;
            }, 200);
        }



        //Is object A a circle?
        if (typeof pair.bodyA.circleRadius !== 'undefined') {

            if (pair.collision.depth > 2) {
                // console.log(pair.bodyA);
                var collision = new Object;
                initCollision(collision, pair.bodyA.position, pair.bodyA.render.fillStyle, pair.collision.depth);
                collisionEffects.push(collision);
            }

            //Is object B one of our bars?
            if (!pair.bodyB.isStatic && pair.bodyB.friction !== 0.00001) {
                var newColor = pair.bodyB.render.fillStyle;
                pair.bodyA.render.fillStyle = newColor;
                pair.bodyA.render.strokeStyle = newColor;
                // play collision sound
                playSound(0, ~~ (Math.random() * 10), 1, 1, 1);
                $('#textWrapper').css('opacity', 0);
                //Store that id, man!
                for (var key in users) {
                    if (users[key].bar.id == pair.bodyB.id) {
                        playerWithBall = users[key];
                    }
                }

                //Wait, what?! Is B the GOAL?!
            } else if (pair.bodyB.id == scene.worldEl[4].id || pair.bodyB.id == scene.worldEl[5].id) {
                console.log('GOOOOOOOOOOOOOOOL!');

                findUserThatGoal(playerWithBall);
                //REMOVE THE BALL!
                printGoal();
                Composite.remove(engine.world, pair.bodyA, true);
                createNewBall();
            }

            //Is object B a circle?
        } else if (typeof pair.bodyB.circleRadius !== 'undefined') {

            if (pair.collision.depth > 2) {
                var collision = new Object;
                initCollision(collision, pair.bodyB.position, pair.bodyA.render.fillStyle, pair.collision.depth);
                collisionEffects.push(collision);
            }

            //Is object A one of our bars?
            if (!pair.bodyA.isStatic && pair.bodyA.friction !== 0.00001) {
                var newColor = pair.bodyA.render.fillStyle;
                pair.bodyB.render.fillStyle = newColor;
                pair.bodyB.render.strokeStyle = newColor;
                // play collision sound
                playSound(0, ~~ (Math.random() * 10), 1, 1, 1);
                $('#textWrapper').css('opacity', 0);
                //Store that id, man!
                for (var key in users) {
                    if (users[key].bar.id == pair.bodyA.id) {
                        playerWithBall = users[key];
                    }
                }

                //Wait, what?! Is A the GOAL?!
            } else if (pair.bodyA.id == scene.worldEl[4].id || pair.bodyA.id == scene.worldEl[5].id) {
                console.log('GOOOOOOOOOOOOOOOL!');

                // find a user id that has mmatter id = pair.bodyA.id;
                findUserThatGoal(playerWithBall);
                //REMOVE THE BALL!
                printGoal();
                Composite.remove(engine.world, pair.bodyB, true);
                createNewBall();
            }
        }
    }
});

$('#stageTitle').css({
    top: window.innerHeight / 2 - 50 + 100,
    left: window.innerWidth / 2 - 250
});
$('#stageInfo').css({
    top: window.innerHeight / 2 + 50 + 80,
    left: window.innerWidth / 2 - 250
});
// run the engine
createNewBall();
Engine.run(engine);
scene.render();
scene.tutorial();

function findUserThatGoal(id) {
    for (var key in users) {
        if (users.hasOwnProperty(key) && users[key].bar.id == id.bar.id) {
            console.log(users[key]);
            users[key].score += 1;
            if (users[key].score >= 3 && users[key].score < 6) {
                scene.blackhole();
            } else if (users[key].score >= 6) {
                scene.jungle();
            }
        }
    }
}

    // $('#goalBanner').css({left: window.innerWidth/2 - 200});
    // $('#goalBanner').html('<i><br><br><h1>GOAL!</h1><h5>YOU DID IT,<br>Gab!</h5></i>');
    // var newTop = window.innerHeight * 0.5 - 200 + 'px';
    // console.log(newTop);
    // $('#goalBanner').animate({
    //     top: newTop
    //     },
    //     1000,
    //     'easeOutBack',
    //     function(){
    //         setTimeout(function(){
    //             console.log('hey');
    //             $('#goalBanner').animate({top: '-500px'}, 500, 'easeInBack');
    //         }, 500);
    //     });

function printGoal() {
    //Sound
    playSound(2, 1, 1, 1, 1);

    //Banner
    $('#goalBanner').css({
        left: window.innerWidth/2 - 200,
        'background-color': playerWithBall.bar.render.fillStyle
    });
    $('#goalBanner').html('<i><br><br><h1>GOAL!</h1><h5>YOU DID IT,<br>' + playerWithBall.name +'!</h5></i>');
    var newTop = window.innerHeight * 0.5 - 200 + 'px';
    console.log(newTop);
    $('#goalBanner').animate({
        top: newTop
        },
        1000,
        'easeOutBack',
        function(){
            setTimeout(function(){
                console.log('hey');
                $('#goalBanner').animate({top: '-500px'}, 500, 'easeInBack');
            }, 500);
        });

    //Changing player
    if (playerWithBall.nSides < 7) {
        //Creating a new body for the player
        var newBar = Bodies.polygon(playerWithBall.bar.position.x,
            playerWithBall.bar.position.y,
            playerWithBall.nSides + 1,
            playerWithBall.radius, {
                friction: 0.001,
                restitution: 0.05,
                density: 0.001,
            });
        newBar.render.fillStyle = playerWithBall.color;
        newBar.render.strokeStyle = playerWithBall.color;

        //Removing the old body from the world and adding the new one
        Composite.remove(engine.world, playerWithBall.bar, true);
        World.add(engine.world, newBar);

        //Updating the user properties
        playerWithBall.bar = newBar;
        playerWithBall.nSides++;
        // playerWithBall.radius += 2;
    } else if (playerWithBall.nSides == 7) {
        var newPlayerImage = new Object();
        initPlayerImage(newPlayerImage, playerWithBall);
        // playerImages.push(newPlayerImage);
        playerImages[playerWithBall.id] = newPlayerImage;
        playerWithBall.nSides++;
    }

    playerWithBall = '';
}

/*------------- USERS -------------*/
//ASSOCIATIVE ARRAY!!!!
var users = {};

function initUser(obj, _id, _name, _color, _bar, _nSides, _radius, _score) {
    //Variables
    obj.id = _id;
    obj.name = _name;
    obj.color = _color;
    obj.score = _score;

    obj.bar = _bar;
    obj.nSides = _nSides;
    obj.radius = _radius;

    // console.log(obj.bar);

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

function createNewUser(user) {

    //Grab the user properties
    var id = user.id;
    var name = user.name;
    var color = user.color;
    var score = 0;

    //Creates a new bar
    var x = 10 + ~~(Math.random() * 200);
    var y = 10 + ~~(Math.random() * 200);
    // var bar = Bodies.rectangle(x, y, 30, 30, {
    //     friction: 0.001,
    //     restitution: 0.05,
    //     density: 0.001,
    // });
    var bar = Bodies.polygon(x, y, 4, 30, {
        friction: 0.001,
        restitution: 0.05,
        density: 0.001,
    });
    bar.render.fillStyle = color;
    bar.render.strokeStyle = color;
    World.add(engine.world, bar);

    //Creates a new user object and add it to the array
    var newUser = new Object();
    initUser(newUser, id, name, color, bar, 4, 30, score);
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
    delete users[userId];       //user from array
    $('#' + userId).remove();   //name layer
    delete playerImages[userId];//player face
}