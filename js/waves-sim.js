// waves-sim.js - Transverse Wave Simulator Logic
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sim-canvas');
    const ctx = canvas.getContext('2d');

    // Controls
    const inputAmplitude = document.getElementById('input-amplitude');
    const inputFrequency = document.getElementById('input-frequency');
    const inputSpeed = document.getElementById('input-speed');

    const labelAmplitude = document.getElementById('label-amplitude');
    const labelFrequency = document.getElementById('label-frequency');
    const labelSpeed = document.getElementById('label-speed');

    // Metrics
    const valWavelength = document.getElementById('val-wavelength');
    const valFrequency = document.getElementById('val-frequency');
    const valSpeed = document.getElementById('val-speed');

    const btnToggle = document.getElementById('btn-toggle');
    const btnReset = document.getElementById('btn-reset');

    let animationId;
    let isRunning = false;
    let time = 0;

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        draw();
    }

    function updateLabels() {
        labelAmplitude.textContent = inputAmplitude.value;
        labelFrequency.textContent = inputFrequency.value;
        labelSpeed.textContent = inputSpeed.value;

        // Wave formula: v = f * lambda => lambda = v / f
        const freq = parseFloat(inputFrequency.value);
        const speed = parseFloat(inputSpeed.value);
        const wavelength = (speed / freq).toFixed(1);

        valWavelength.textContent = `${wavelength} px`;
        valFrequency.textContent = `${freq.toFixed(1)} Hz`;
        valSpeed.textContent = `${speed} px/s`;
    }

    inputAmplitude.addEventListener('input', () => { updateLabels(); if (!isRunning) draw(); });
    inputFrequency.addEventListener('input', () => { updateLabels(); if (!isRunning) draw(); });
    inputSpeed.addEventListener('input', () => { updateLabels(); if (!isRunning) draw(); });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerY = canvas.height / 2;
        const A = parseFloat(inputAmplitude.value);
        const f = parseFloat(inputFrequency.value);
        const v = parseFloat(inputSpeed.value);

        // Center Axis Line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Draw Sine Wave
        ctx.strokeStyle = '#38ef7d';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#38ef7d';
        ctx.beginPath();

        const wavelength = v / f;
        const k = (2 * Math.PI) / wavelength; // Wave number
        const omega = 2 * Math.PI * f;        // Angular frequency

        for (let x = 0; x <= canvas.width; x += 2) {
            // Wave Equation: y(x, t) = A * sin(k*x - omega*t)
            const y = centerY - A * Math.sin(k * x - omega * time);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw oscillating particles along the wave
        const particleSpacing = 40;
        for (let x = 20; x < canvas.width; x += particleSpacing) {
            const y = centerY - A * Math.sin(k * x - omega * time);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animate() {
        time += 0.016; // Approx 60 FPS interval
        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    btnToggle.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            btnToggle.textContent = 'Pause ⏸';
            animate();
        } else {
            isRunning = false;
            btnToggle.textContent = 'Start Oscillation 🌊';
            cancelAnimationFrame(animationId);
        }
    });

    btnReset.addEventListener('click', () => {
        if (isRunning) {
            isRunning = false;
            cancelAnimationFrame(animationId);
            btnToggle.textContent = 'Start Oscillation 🌊';
        }
        time = 0;
        updateLabels();
        draw();
    });

    window.addEventListener('resize', resizeCanvas);
    updateLabels();
    resizeCanvas();
});