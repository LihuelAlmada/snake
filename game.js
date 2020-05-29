var canvas = null,
    ctx = null,
    lastPress = null,
    direction = 0,
    x = 50,
    y = 50,
    pause = true;

const KEY_ENTER = 13,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40;

document.addEventListener('keydown', function(e) {
    lastPress = e.which;
}, false);

function paint(ctx) {
    //Puedes usar strokeStyle y strokeRect para dibujar el contorno en lugar de rellenarlos.
    // Clean canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw square
    ctx.fillStyle = '#0f0';
    ctx.fillRect(x, y, 10, 10);
    // Debug last key pressed
    ctx.fillStyle = '#fff';
    //ctx.fillText('Last Press: ' + lastPress, 0, 20);
    // Draw pause
    if (pause) {
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE', 150, 75);
        ctx.textAlign = 'left';
    }
}


function act() {
    if (!pause) {
        // Change Direction
        if (lastPress == KEY_UP) {
            direction = 0;
        }
        if (lastPress == KEY_RIGHT) {
            direction = 1;
        }
        if (lastPress == KEY_DOWN) {
            direction = 2;
        }
        if (lastPress == KEY_LEFT) {
            direction = 3;
        }
    }


    // Moveremos nuestro rectángulo dependiendo la dirección
    if (direction == 0) {
        y -= 10;
    }
    if (direction == 1) {
        x += 10;
    }
    if (direction == 2) {
        y += 10;
    }
    if (direction == 3) {
        x -= 10;
    }

    //si sale de la pantalla
    if (x > canvas.width) {
        x = 0;
    }
    if (y > canvas.height) {
        y = 0;
    }
    if (x < 0) {
        x = canvas.width;
    }
    if (y < 0) {
        y = canvas.height;
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
    setTimeout(run, 50);
    act();
}

function init() {
    // Get canvas and context
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    // Start game
    run();
    repaint();
}

//cuanto termine de cargar la página, comience a ejecutar “init”
window.addEventListener('load', init, false);