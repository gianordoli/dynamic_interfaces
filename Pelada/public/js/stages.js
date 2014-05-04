/*------------- STAGES ---------------*/
var scene = {
    curr: null,
    w: window.innerWidth,
    h: window.innerHeight,
    thickness: 20,
    center: [this.w / 2, this.h / 2],
    worldEl: [],
    blackholeEl: [],
    tutorial: function() {
        console.log('rendering tutorial');
        this.curr = '> tutorial';
        $('#stageTitle').html('TUTORIAL').css('color', 'black');
        $('#stageInfo').html('Easy mode, be an octagon to win').css('color', 'black');
    },
    blackhole: function() {
        console.log('rendering blackhole');
        this.curr = '> blackhole';
        $('#stageTitle').html('BLACKHOLE').css('color', 'black');
        $('#stageInfo').html('Beware of the blackhole!').css('color', 'black');
        var side = ~~ (Math.random() * 20 + 10),
            size = ~~ (Math.random() * 100 + 200);
        this.blackholeEl = [
            Bodies.polygon(this.w / 2, this.h / 2 - 85, side, size, {
                isStatic: false
            })
        ];
        World.add(engine.world, scene.blackholeEl);
    },
    jungle: function() {
        console.log('rendering jungle');
        this.curr = '> jungle';
        $('#stageTitle').html('JUNGLE');
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
            })
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
            }
        });
    }
};

function getRandColor() {
    var hsl;
    return 'hsl(' + ~~(Math.random() * 360) + ', 75%, 50%)';
}