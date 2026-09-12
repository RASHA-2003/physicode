// space-animation.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');

    let stars = [];
    const numStars = 150;

    // Adjust Canvas Dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Generate Stars Array
    function createStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                speed: Math.random() * 0.015 + 0.005
            });
        }
    }

    // Render Animation Frame
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            // Twinkle effect
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0) {
                star.speed = -star.speed;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffffff';
            ctx.fill();
        });

        requestAnimationFrame(animateStars);
    }

    // Initialize Canvas & Events
    window.addEventListener('resize', () => {
        resizeCanvas();
        createStars();
    });

    resizeCanvas();
    createStars();
    animateStars();
});