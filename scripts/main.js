const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawGround() {
    const groundHeight = canvas.height / 5;
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);   
}

function draw() {
    CSSMatrixComponent.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#87cefa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGround();
    requestAnimationFrame(draw);
}

draw();