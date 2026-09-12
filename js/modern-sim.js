document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sim-canvas');
    const ctx = canvas.getContext('2d');

    const inputWavelength = document.getElementById('input-wavelength');
    const inputWork = document.getElementById('input-work');
    const labelWavelength = document.getElementById('label-wavelength');

    const valEnergy = document.getElementById('val-energy');
    const valKe = document.getElementById('val-ke');
    const btnToggle = document.getElementById('btn-toggle');

    let isRunning = false;
    let animationId;
    let electrons = [];

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        draw();
    }

    function calculate() {
        const wl = parseFloat(inputWavelength.value);
        const phi = parseFloat(inputWork.value);

        // E = hc / lambda (in eV, hc approx 1240 eV.nm)
        const E = 1240 / wl;
        const KE = E - phi;

        valEnergy.textContent = `${E.toFixed(2)} eV`;
        if (KE > 0) {
            valKe.textContent = `${KE.toFixed(2)} eV`;
            valKe.style.color = '#38ef7d';
        } else {
            valKe.textContent = '0.00 eV (No Emission)';
            valKe.style.color = '#ef4444';
        }

        labelWavelength.textContent = wl;
        return { E, KE };
    }

    inputWavelength.addEventListener('input', () => { calculate(); if (!isRunning) draw(); });
    inputWork.addEventListener('change', () => { calculate(); if (!isRunning) draw(); });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const plateX = canvas.width * 0.3;
        const plateY = canvas.height * 0.2;
        const plateW = 20;
        const plateH = canvas.height * 0.6;

        // Draw Metal Plate
        ctx.fillStyle = '#64748b';
        ctx.fillRect(plateX, plateY, plateW, plateH);

        // Light Beam
        const wl = parseFloat(inputWavelength.value);
        ctx.strokeStyle = `hsl(${Math.max(0, (700 - wl) * 0.8)}, 100%, 50%)`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(50, plateY + plateH / 2);
        ctx.lineTo(plateX, plateY + plateH / 2);
        ctx.stroke();

        // Electrons
        electrons.forEach(e => {
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updatePhysics() {
        const { KE } = calculate();

        if (KE > 0 && Math.random() < 0.3) {
            electrons.push({
                x: canvas.width * 0.3 + 20,
                y: canvas.height * 0.2 + Math.random() * (canvas.height * 0.6),
                speed: Math.sqrt(KE) * 3
            });
        }

        electrons.forEach(e => e.x += e.speed);
        electrons = electrons.filter(e => e.x < canvas.width);

        draw();
        if (isRunning) animationId = requestAnimationFrame(updatePhysics);
    }

    btnToggle.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            btnToggle.textContent = 'Stop Light ⏸';
            updatePhysics();
        } else {
            isRunning = false;
            btnToggle.textContent = 'Shine Light 💡';
            cancelAnimationFrame(animationId);
        }
    });

    window.addEventListener('resize', resizeCanvas);
    calculate();
    resizeCanvas();
});
