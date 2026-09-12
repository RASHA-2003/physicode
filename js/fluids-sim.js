// fluids-sim.js - Archimedes' Buoyancy Physics Simulator
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sim-canvas');
    const ctx = canvas.getContext('2d');

    // Controls
    const inputMaterial = document.getElementById('input-material');
    const inputFluid = document.getElementById('input-fluid');
    const inputVolume = document.getElementById('input-volume');
    const labelVolume = document.getElementById('label-volume');

    // Metrics
    const valBuoyancy = document.getElementById('val-buoyancy');
    const valGravity = document.getElementById('val-gravity');
    const valSubmerged = document.getElementById('val-submerged');

    const btnDrop = document.getElementById('btn-drop');
    const btnReset = document.getElementById('btn-reset');

    const g = 9.81; // Gravity m/s²
    let animationId;
    let isRunning = false;

    // Tank and Object State
    let tank = { x: 0, y: 0, width: 0, height: 0, waterY: 0 };
    let block = { x: 0, y: 0, size: 60, vy: 0, submergedRatio: 0 };

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Container tank layout
        tank.width = Math.min(canvas.width * 0.5, 400);
        tank.height = canvas.height * 0.6;
        tank.x = (canvas.width - tank.width) / 2;
        tank.y = canvas.height - tank.height - 40;
        tank.waterY = tank.y + tank.height * 0.35; // Water fill level

        resetSimulation();
    }

    inputVolume.addEventListener('input', () => {
        labelVolume.textContent = inputVolume.value;
        resetSimulation();
    });

    inputMaterial.addEventListener('change', resetSimulation);
    inputFluid.addEventListener('change', resetSimulation);

    function resetSimulation() {
        if (isRunning) cancelAnimationFrame(animationId);
        isRunning = false;

        const vol = parseFloat(inputVolume.value);
        // Visual block size scales with volume
        block.size = 40 + (vol / 0.1) * 40;
        block.x = tank.x + (tank.width - block.size) / 2;
        block.y = tank.y - block.size - 20; // Above liquid surface
        block.vy = 0;
        block.submergedRatio = 0;

        calculateAndDisplayMetrics(0);
        draw();
    }

    function calculateAndDisplayMetrics(submergedFraction) {
        const rhoObj = parseFloat(inputMaterial.value);
        const rhoFluid = parseFloat(inputFluid.value);
        const vol = parseFloat(inputVolume.value);

        const mass = rhoObj * vol;
        const Fg = mass * g; // Gravity force

        const submergedVol = vol * submergedFraction;
        const Fb = rhoFluid * submergedVol * g; // Buoyant force

        valGravity.textContent = `${Fg.toFixed(1)} N`;
        valBuoyancy.textContent = `${Fb.toFixed(1)} N`;
        valSubmerged.textContent = `${(submergedFraction * 100).toFixed(0)} %`;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Tank Outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 4;
        ctx.strokeRect(tank.x, tank.y, tank.width, tank.height);

        // Draw Liquid
        const liquidHeight = tank.y + tank.height - tank.waterY;
        const rhoFluid = parseFloat(inputFluid.value);

        // Fluid color gradient based on density
        let fluidColor = 'rgba(56, 189, 248, 0.4)'; // Water
        if (rhoFluid === 800) fluidColor = 'rgba(234, 179, 8, 0.45)'; // Oil
        if (rhoFluid === 1025) fluidColor = 'rgba(14, 165, 233, 0.55)'; // Seawater
        if (rhoFluid === 13600) fluidColor = 'rgba(148, 163, 184, 0.7)'; // Mercury

        ctx.fillStyle = fluidColor;
        ctx.fillRect(tank.x, tank.waterY, tank.width, liquidHeight);

        // Water Surface Line
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tank.x, tank.waterY);
        ctx.lineTo(tank.x + tank.width, tank.waterY);
        ctx.stroke();

        // Draw Submerged Block
        ctx.fillStyle = '#f97316'; // Bright Orange Block
        ctx.fillRect(block.x, block.y, block.size, block.size);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.size, block.size);
    }

    function updatePhysics() {
        const rhoObj = parseFloat(inputMaterial.value);
        const rhoFluid = parseFloat(inputFluid.value);
        const vol = parseFloat(inputVolume.value);

        const mass = rhoObj * vol;
        const Fg = mass * g;

        // Calculate Submerged Ratio
        const blockBottom = block.y + block.size;
        let submergedHeight = 0;

        if (blockBottom > tank.waterY) {
            submergedHeight = Math.min(blockBottom - tank.waterY, block.size);
            submergedHeight = Math.max(0, submergedHeight);
        }

        block.submergedRatio = submergedHeight / block.size;

        const Fb = rhoFluid * (vol * block.submergedRatio) * g;
        const netForce = Fg - Fb;
        const acceleration = netForce / mass;

        // Damping / Viscosity resistance inside fluid
        const fluidDamping = block.submergedRatio > 0 ? 0.92 : 0.99;

        block.vy += acceleration * 0.05;
        block.vy *= fluidDamping;
        block.y += block.vy;

        // Tank bottom boundary collision
        const maxBlockY = tank.y + tank.height - block.size;
        if (block.y >= maxBlockY) {
            block.y = maxBlockY;
            block.vy = 0;
        }

        calculateAndDisplayMetrics(block.submergedRatio);
        draw();

        if (isRunning) {
            animationId = requestAnimationFrame(updatePhysics);
        }
    }

    btnDrop.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            updatePhysics();
        }
    });

    btnReset.addEventListener('click', resetSimulation);

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});