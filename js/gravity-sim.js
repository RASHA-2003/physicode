// gravity-sim.js - Orbital Gravity Simulator Logic
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sim-canvas');
    const ctx = canvas.getContext('2d');

    // Controls
    const inputMass = document.getElementById('input-mass');
    const inputDistance = document.getElementById('input-distance');
    const inputOrbitSpeed = document.getElementById('input-orbit-speed');
    const labelMass = document.getElementById('label-mass');
    const labelDistance = document.getElementById('label-distance');
    const labelOrbitSpeed = document.getElementById('label-orbit-speed');

    // Metrics
    const valVelocity = document.getElementById('val-velocity');
    const valPeriod = document.getElementById('val-period');
    const valDistance = document.getElementById('val-distance');

    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');

    let animationId;
    let isRunning = false;

    // Simulation Objects
    let star = { x: 0, y: 0, mass: 1.0, radius: 22 };
    let planet = { x: 0, y: 0, vx: 0, vy: 0, radius: 8, history: [] };

    const G = 1000; // Gravity Constant Scale Factor

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        star.x = canvas.width / 2;
        star.y = canvas.height / 2;
        resetSimulation();
    }

    inputMass.addEventListener('input', () => { labelMass.textContent = inputMass.value; });
    inputDistance.addEventListener('input', () => { labelDistance.textContent = inputDistance.value; });
    inputOrbitSpeed.addEventListener('input', () => { labelOrbitSpeed.textContent = inputOrbitSpeed.value; });

    function resetSimulation() {
        if (isRunning) cancelAnimationFrame(animationId);
        isRunning = false;

        star.mass = parseFloat(inputMass.value);
        const distAU = parseFloat(inputDistance.value);
        const speedPercent = parseFloat(inputOrbitSpeed.value) / 100;

        const distPx = distAU * 120; // Scale 1 AU = 120px
        planet.x = star.x;
        planet.y = star.y - distPx;

        // Circular Orbit Speed Formula: v = sqrt(G * M / r)
        const vCircular = Math.sqrt((G * star.mass) / distPx) * speedPercent;
        planet.vx = vCircular;
        planet.vy = 0;
        planet.history = [];

        updateMetrics(vCircular, distAU);
        draw();
    }

    function updateMetrics(v, rAU) {
        const speedKmS = (v * 2.98).toFixed(2);
        const periodDays = (365 * Math.pow(rAU, 1.5) / Math.sqrt(star.mass)).toFixed(1);

        valVelocity.textContent = `${speedKmS} km/s`;
        valPeriod.textContent = `${periodDays} days`;
        valDistance.textContent = `${rAU} AU`;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Star (Sun)
        ctx.fillStyle = '#ffd200';
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#f7971e';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * Math.sqrt(star.mass), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Orbit History Trail
        if (planet.history.length > 1) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(planet.history[0].x, planet.history[0].y);
            for (let i = 1; i < planet.history.length; i++) {
                ctx.lineTo(planet.history[i].x, planet.history[i].y);
            }
            ctx.stroke();
        }

        // Draw Planet
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#38bdf8';
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function updatePhysics() {
        const dx = star.x - planet.x;
        const dy = star.y - planet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Gravitational Force Vector
        const force = (G * star.mass) / (dist * dist);
        const ax = force * (dx / dist);
        const ay = force * (dy / dist);

        planet.vx += ax;
        planet.vy += ay;

        planet.x += planet.vx;
        planet.y += planet.vy;

        planet.history.push({ x: planet.x, y: planet.y });
        if (planet.history.length > 300) planet.history.shift();

        const currentDistAU = (dist / 120).toFixed(2);
        const currentSpeed = Math.sqrt(planet.vx * planet.vx + planet.vy * planet.vy);
        updateMetrics(currentSpeed, currentDistAU);

        draw();

        if (isRunning) {
            animationId = requestAnimationFrame(updatePhysics);
        }
    }

    btnStart.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            updatePhysics();
        }
    });

    btnReset.addEventListener('click', resetSimulation);

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});