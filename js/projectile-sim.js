// Projectile Motion Simulator Logic
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sim-canvas');
    const ctx = canvas.getContext('2d');

    // UI Inputs
    const velocityInput = document.getElementById('input-velocity');
    const angleInput = document.getElementById('input-angle');
    const gravitySelect = document.getElementById('input-gravity');
    const labelVelocity = document.getElementById('label-velocity');
    const labelAngle = document.getElementById('label-angle');

    // Metrics Display
    const valHeight = document.getElementById('val-height');
    const valRange = document.getElementById('val-range');
    const valTime = document.getElementById('val-time');

    // Buttons
    const btnLaunch = document.getElementById('btn-launch');
    const btnReset = document.getElementById('btn-reset');

    // Simulation Variables
    let isSimulating = false;
    let animationFrameId;
    let t = 0;
    let trajectory = [];

    // Scale Factor (pixels per meter)
    const scale = 5;
    const originX = 50;

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawEnvironment();
    }

    function getOriginY() {
        return canvas.height - 50;
    }

    // Update Input UI Labels
    velocityInput.addEventListener('input', () => {
        labelVelocity.textContent = velocityInput.value;
    });

    angleInput.addEventListener('input', () => {
        labelAngle.textContent = angleInput.value;
    });

    // Draw Static Grid and Launch Pad
    function drawEnvironment() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const originY = getOriginY();

        // Draw Ground Line
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(canvas.width, originY);
        ctx.stroke();

        // Draw Launch Cannon Node
        ctx.fillStyle = '#38ef7d';
        ctx.beginPath();
        ctx.arc(originX, originY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Re-draw Trajectory Path if exists
        if (trajectory.length > 0) {
            ctx.strokeStyle = '#38ef7d';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(trajectory[0].x, trajectory[0].y);
            for (let i = 1; i < trajectory.length; i++) {
                ctx.lineTo(trajectory[i].x, trajectory[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    // Calculate Theoretical Physics Metrics
    function calculateTheoreticalValues(v0, angleRad, g) {
        const maxHeight = (Math.pow(v0 * Math.sin(angleRad), 2)) / (2 * g);
        const totalRange = (Math.pow(v0, 2) * Math.sin(2 * angleRad)) / g;
        const totalTime = (2 * v0 * Math.sin(angleRad)) / g;

        valHeight.textContent = `${maxHeight.toFixed(2)} m`;
        valRange.textContent = `${totalRange.toFixed(2)} m`;
        valTime.textContent = `${totalTime.toFixed(2)} s`;
    }

    // Launch Animation Loop
    function startSimulation() {
        if (isSimulating) cancelAnimationFrame(animationFrameId);

        const v0 = parseFloat(velocityInput.value);
        const angleDeg = parseFloat(angleInput.value);
        const g = parseFloat(gravitySelect.value);

        const angleRad = (angleDeg * Math.PI) / 180;
        const originY = getOriginY();

        calculateTheoreticalValues(v0, angleRad, g);

        t = 0;
        trajectory = [];
        isSimulating = true;

        const v0x = v0 * Math.cos(angleRad);
        const v0y = v0 * Math.sin(angleRad);

        function animate() {
            t += 0.05; // Time Step

            // Physics Equations of Motion
            const xMeters = v0x * t;
            const yMeters = (v0y * t) - (0.5 * g * Math.pow(t, 2));

            const currentX = originX + (xMeters * scale);
            const currentY = originY - (yMeters * scale);

            // Stop if projectile hits the ground
            if (currentY >= originY && t > 0.1) {
                isSimulating = false;
                trajectory.push({ x: currentX, y: originY });
                drawEnvironment();

                // Draw Final Impact Point
                ctx.fillStyle = '#ff0844';
                ctx.beginPath();
                ctx.arc(currentX, originY, 6, 0, Math.PI * 2);
                ctx.fill();
                return;
            }

            trajectory.push({ x: currentX, y: currentY });

            drawEnvironment();

            // Draw Projectile Ball
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#38ef7d';
            ctx.beginPath();
            ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();
    }

    function resetSimulation() {
        if (isSimulating) cancelAnimationFrame(animationFrameId);
        isSimulating = false;
        t = 0;
        trajectory = [];
        valHeight.textContent = '0.00 m';
        valRange.textContent = '0.00 m';
        valTime.textContent = '0.00 s';
        drawEnvironment();
    }

    // Event Listeners
    btnLaunch.addEventListener('click', startSimulation);
    btnReset.addEventListener('click', resetSimulation);

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});