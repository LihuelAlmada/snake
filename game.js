(function(window, undefined) {
    'use strict'
    const KEY_ENTER = 13,
        KEY_LEFT = 37,
        KEY_UP = 38,
        KEY_RIGHT = 39,
        KEY_DOWN = 40;
    var canvas = null,
        ctx = null,
        lastPress = null,

        pause = true,
        gameover = true,
        dir = 0,
        score = 0,
        wall = new Array(),
        body = new Array(),
        food = null,
        iBody = new Image(),
        iFood = new Image(),
        aEat = new Audio(),
        aDie = new Audio();

    document.addEventListener('keydown', function(e) {
        lastPress = e.which;
    }, false);

    function Rectangle(x, y, width, height) {
        this.x = (x == null) ? 0 : x;
        this.y = (y == null) ? 0 : y;
        this.width = (width == null) ? 0 : width;
        this.height = (height == null) ? this.width : height;
        this.intersects = function(rect) {
            if (rect == null) {
                window.console.warn('Missing parameters on function intersects');
            } else {
                return (this.x < rect.x + rect.width &&
                    this.x + this.width > rect.x &&
                    this.y < rect.y + rect.height &&
                    this.y + this.height > rect.y);
            }
        };
        this.fill = function(ctx) {
            if (ctx == null) {
                window.console.warn('Missing parameters on function fill');
            } else {
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        };
    }

    function random(max) {
        return Math.floor(Math.random() * max);
    }

    function reset() {
        score = 0;
        dir = 1;
        body.length = 0;
        wall.length = 0;
        body.push(new Rectangle(40, 40, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        body.push(new Rectangle(0, 0, 10, 10));
        food.x = random(canvas.width / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
        gameover = false;
    }

    function paint(ctx) {
        var i = 0,
            l = 0;
        // Clean canvas
        ctx.fillStyle = '#2c93a3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw walls
        ctx.fillStyle = '#8a5f1f';
        for (i = 0, l = wall.length; i < l; i += 1) {

            wall[i].fill(ctx);
        }
        for (i = 0, l = body.length; i < l; i += 1) {
            //body[i].fill(ctx);
            ctx.drawImage(iBody, body[i].x, body[i].y);
        }
        // Draw food
        ctx.drawImage(iFood, food.x, food.y);

        // Debug last key pressed
        ctx.fillStyle = '#fff';

        // Draw score
        ctx.fillText('Score: ' + score, 0, 10);
        // Draw pause
        if (pause) {
            ctx.textAlign = 'center';
            if (gameover) {
                ctx.fillText('GAME OVER', 180, 120);
            } else {
                ctx.fillText('PAUSE', 180, 120);
            }
            ctx.textAlign = 'left';
        }

    }

    function act() {
        var i = 0,
            l = 0;
        if (!pause) {
            // GameOver Reset
            if (gameover) {
                reset();
            }
            // Mover el cuerpo
            for (i = body.length - 1; i > 0; i -= 1) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }
            // Change Direction
            if (lastPress == KEY_UP && dir != 2) {
                dir = 0;
            }
            if (lastPress == KEY_RIGHT && dir != 3) {
                dir = 1;
            }
            if (lastPress == KEY_DOWN && dir != 0) {
                dir = 2;
            }
            if (lastPress == KEY_LEFT && dir != 1) {
                dir = 3;
            }
            // Move Head
            if (dir == 0) {
                body[0].y -= 10;
            }
            if (dir == 1) {
                body[0].x += 10;
            }
            if (dir == 2) {
                body[0].y += 10;
            }
            if (dir == 3) {
                body[0].x -= 10;
            }
            // Out Screen
            if (body[0].x > canvas.width - body[0].width) {
                body[0].x = 0;
            }
            if (body[0].y > canvas.height - body[0].height) {
                body[0].y = 0;
            }
            if (body[0].x < 0) {
                body[0].x = canvas.width - body[0].width;
            }
            if (body[0].y < 0) {
                body[0].y = canvas.height - body[0].height;
            }
            // Wall Intersects
            for (i = 0, l = wall.length; i < l; i += 1) {
                if (food.intersects(wall[i])) {
                    food.x = random(canvas.width / 10 - 1) * 10;
                    food.y = random(canvas.height / 10 - 1) * 10;
                }

                if (body[0].intersects(wall[i])) {
                    aDie.play();
                    gameover = true;
                    pause = true;
                }
            }
            // Body Intersects
            for (i = 2, l = body.length; i < l; i += 1) {
                if (body[0].intersects(body[i])) {
                    gameover = true;
                    pause = true;
                    aDie.play();
                }
            }
            // Food Intersects
            if (body[0].intersects(food)) {
                body.push(new Rectangle(food.x, food.y, 10, 10));
                score += 1;
                //create wall

                wall.push(new Rectangle(food.x, food.y, 10, 10))
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
                aEat.play();
            }
        }
        // Pause/Unpause
        if (lastPress == KEY_ENTER) {
            pause = !pause;
            lastPress = null;
        }
    }

    function repaint() {
        window.requestAnimationFrame(repaint);
        paint(ctx);
    }

    function run() {
        setTimeout(run, 70);
        //window.requestAnimationFrame(run);
        act();
        //paint(ctx);

    }

    function init() {
        // Get canvas and context
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        // Load assets
        iBody.src = 'assets/body.png';
        iFood.src = 'assets/fruit.png';
        aEat.src = 'assets/chomp.mp3';
        aDie.src = 'assets/dies.mp3';
        // Create food
        food = new Rectangle(80, 80, 10, 10);

        // Start game
        run();
        repaint();

    }
    window.addEventListener('load', init, false);
}(window));