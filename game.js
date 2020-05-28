var canvas = null,
    ctx = null;

function paint(ctx) {
    ctx.fillStyle = '#0f0';
    //Posicion en X
    ctx.fillRect(60, 50, 100, 60);
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    paint(ctx);
}
//cuanto termine de cargar la página, comience a ejecutar “init”
window.addEventListener('load', init, false);