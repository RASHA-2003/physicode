// main.js - Smooth Planet Zoom Transition
document.addEventListener('DOMContentLoaded', () => {
    const planetLinks = document.querySelectorAll('.planet-node');
    const orbitSystem = document.querySelector('.orbit-system');
    const centerCore = document.querySelector('.center-core');

    planetLinks.forEach(planet => {
        planet.addEventListener('click', (e) => {
            e.preventDefault(); // إيقاف الانتقال الفوري للتنفيذ الأنيميشن أولاً

            const targetUrl = planet.getAttribute('href');

            // إيقاف دوران المدار وتطبيق تأثير التكبير
            if (orbitSystem) {
                orbitSystem.style.animationPlayState = 'paused';
            }

            // إخفاء العنوان الرئيسي بسلاسة
            if (centerCore) {
                centerCore.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                centerCore.style.opacity = '0';
                centerCore.style.transform = 'scale(0.8)';
            }

            // تكبير الكوكب المضغوط وإخفاء باقي الكواكب
            planetLinks.forEach(otherPlanet => {
                if (otherPlanet !== planet) {
                    otherPlanet.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    otherPlanet.style.opacity = '0';
                    otherPlanet.style.transform += ' scale(0.5)';
                } else {
                    planet.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease';
                    planet.style.transform += ' scale(4)';
                    planet.style.opacity = '0';
                }
            });

            // الانتقال إلى الصفحة المطلوبة بعد انتهاء حركة التكبير
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 750);
        });
    });
});