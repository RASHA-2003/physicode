document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sim-canvas');
    const ctx = canvas.getContext('2d');

    const inputQ1 = document.getElementById('input-q1');
    const inputQ2 = document.getElementById('input-q2');
    const labelQ1 = document.getElementById('label-q1');
    const labelQ2 = document.getElementById('label-q2');

    const valForce = document.getElementById('val-force');
    const valType = document.getElementById('val-type');
    const btnReset = document.getElementById('btn-reset');

    const k = 8.99e9;

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        draw();
    }

    function update() {
        labelQ1.textContent = (inputQ1.value > 0 ? '+' : '') + inputQ1.value;
        labelQ2.textContent = (inputQ2.value > 0 ? '+' : '') + inputQ2.value;
        draw();
    }

    inputQ1.addEventListener('input', update);
    inputQ2.addEventListener('input', update);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const q1 = parseFloat(inputQ1.value);
        const q2 = parseFloat(inputQ2.value);

        const c1 = { x: canvas.width * 0.35, y: canvas.height / 2 };
        const c2 = { x: canvas.width * 0.65, y: canvas.height / 2 };

        const r = (c2.x - c1.x) / 100; // Scaled distance
        const force = Math.abs(k * (q1 * 1e-6) * (q2 * 1e-6) / (r * r));

        valForce.textContent = `${force.toFixed(3)} N`;
        if (q1 * q2 < 0) {
            valType.textContent = 'Attraction (تجاذب)';
            valType.style.color = '#38ef7d';
        } else if (q1 * q2 > 0) {
            valType.textContent = 'Repulsion (تنافر)';
            valType.style.color = '#ef4444';
        } else {
            valType.textContent = 'Neutral';
            valType.style.color = '#94a3b8';
        }

        // Draw Charge 1
        ctx.fillStyle = q1 >= 0 ? '#ef4444' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(c1.x, c1.y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(q1 >= 0 ? '+' + q1 : q1, c1.x, c1.y);

        // Draw Charge 2
        ctx.fillStyle = q2 >= 0 ? '#ef4444' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(c2.x, c2.y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText(q2 >= 0 ? '+' + q2 : q2, c2.x, c2.y);
    }

    btnReset.addEventListener('click', () => {
        inputQ1.value = 5;
        inputQ2.value = -5;
        update();
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});