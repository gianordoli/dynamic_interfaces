/*------------- STAGES ---------------*/
var scene = {
    curr: null,
    w: window.innerWidth,
    h: window.innerHeight,
    thickness: 20,
    center: [this.w / 2, this.h / 2],
    worldEl: [],
    blackholeEl: [],
    spin: [],
    tutorial: function() {
        console.log('rendering tutorial');
        this.curr = '> tutorial';
        $('#stageTitle').html('TUTORIAL').css('color', 'black');
        $('#stageInfo').html('Easy mode!<br>Take the ball to any side to score!').css('color', 'black');
    },
    blackhole: function() {
        console.log('rendering blackhole');
        this.curr = '> blackhole';
        $('#textWrapper').css('opacity', 1);
        $('#stageTitle').html('PLANETS!').css('color', 'black');
        var pos = { x: ~~ ((Math.random() * this.w)),
                          y: ~~ ((Math.random() * this.h)) };
        $('#stageInfo').html('They are getting in your way!').css('color', 'black');
        var side = ~~ ((Math.random() * 20) + 6),
            size = ~~ ((Math.random() * 100) + 40);
        var planet = Bodies.polygon(pos.x, pos.x, side, size, {
            isStatic: false,
            friction: 0.00001,
            restitution: 0.5,
            density: 0.00001
        });
        console.log(planet);
        planet.render.fillStyle = 'hsl(100, 100%, 100%)';
        planet.render.strokeStyle = getRandColor();
        World.add(engine.world, planet);
    },
    jungle: function() {
        console.log('rendering jungle');
        this.curr = '> jungle';
        $('#textWrapper').css('opacity', 1);
        $('#stageTitle').html('THE JUNGLE!').css('color', 'black');
        $('#stageInfo').html('Welcome to the Jungle.').css('color', 'black');
        var x = ~~ ((Math.random() * this.w)),
            y = ~~ ((Math.random() * this.h)),
            w = 10,
            h = ~~ ((Math.random() * 200));
        var spin = Bodies.rectangle(x, y, w, h, {
            isStatic: true
        });
        spin.render.fillStyle = 'white';
        spin.render.strokeStyle = getRandColor();
        World.add(engine.world, spin);
        scene.spin.push(spin);
    },
    random: function() {
        this.curr = '> random';
    },
    render: function(things) {
        console.log('rendering scenes');
        // render goals
        scene.worldEl = [
            Bodies.rectangle(0, this.h / 2, scene.thickness, this.h, {
                isStatic: true
            }),
            Bodies.rectangle(this.w, this.h / 2, scene.thickness, this.h, {
                isStatic: true
            }),
            Bodies.rectangle(this.w / 2, 0, this.w, scene.thickness, {
                isStatic: true
            }),
            Bodies.rectangle(this.w / 2, this.h, this.w, scene.thickness, {
                isStatic: true
            }),
            Bodies.rectangle(0, this.h / 2, 40, 131, {
                isStatic: true,
                friction: 10
            }),
            Bodies.rectangle(this.w, this.h / 2, 40, 131, {
                isStatic: true,
                friction: 10
            }),
            Bodies.polygon(0, this.h / 2 - 85, 3, 40, {
                isStatic: true
            }),
            Bodies.polygon(0, this.h / 2 + 85, 3, 40, {
                isStatic: true
            }),
            Bodies.polygon(this.w, this.h / 2 - 85, 3, 40, {
                isStatic: true
            }),
            Bodies.polygon(this.w, this.h / 2 + 85, 3, 40, {
                isStatic: true
            }),
            // corners
            Bodies.polygon(0, 10, 3, 50, {
                isStatic: true
            }),
            Bodies.polygon(0, this.h - 8, 3, 50, {
                isStatic: true
            }),
            Bodies.polygon(this.w, 10, 3, 50, {
                isStatic: true
            }),
            Bodies.polygon(this.w, this.h - 10, 3, 50, {
                isStatic: true
            }),
        ];

        World.add(engine.world, scene.worldEl);
        var rand = getRandColor();
        scene.worldEl.forEach(function(v, i) {
            if (i < 4) {
                scene.worldEl[i].render.fillStyle = rand;
                scene.worldEl[i].render.strokeStyle = rand;
            } else if (i == 4 || i < 6) {
                scene.worldEl[i].render.fillStyle = 'white';
                scene.worldEl[i].render.strokeStyle = 'white';
            } else if (i == 6 || i < 10) {
                if (i == 6 || i == 7) {
                    Body.rotate(scene.worldEl[i], 45);
                } else {
                    Body.rotate(scene.worldEl[i], 0);
                }
                scene.worldEl[i].render.fillStyle = rand;
                scene.worldEl[i].render.strokeStyle = rand;
            } else if (i == 10) {
                Body.rotate(scene.worldEl[i], 3.1);
                scene.worldEl[i].render.fillStyle = rand;
                scene.worldEl[i].render.strokeStyle = rand;
            } else if (i == 11) {
                Body.rotate(scene.worldEl[i], 45);
                scene.worldEl[i].render.fillStyle = rand;
                scene.worldEl[i].render.strokeStyle = rand;
            } else {
                scene.worldEl[i].render.fillStyle = rand;
                scene.worldEl[i].render.strokeStyle = rand;
            }
        });
    }
};
var r = 0;
setInterval(function() {
    r += 0.01;
    scene.spin.forEach(function(v, i) {
        Body.rotate(scene.spin[i], r);
    });
    if (r >= 0.1) {
        r = 0;
    }
}, 1000 / 60);

function getRandColor() {
    var hsl;
    return 'hsl(' + ~~(Math.random() * 360) + ', 75%, 50%)';
}