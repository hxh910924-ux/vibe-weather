class SunnyEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spots = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.spots = [];
        for (let i = 0; i < 8; i++) {
            this.spots.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.6,
                radius: Math.random() * 100 + 50,
                speed: Math.random() * 0.3 + 0.1,
                angle: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.2 + 0.1
            });
        }
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(0.4, '#ffd89b');
        gradient.addColorStop(0.6, '#ffebd0');
        gradient.addColorStop(1, '#f5e6d3');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSpots() {
        this.spots.forEach(spot => {
            spot.angle += spot.speed * 0.01;
            spot.x += Math.sin(spot.angle) * spot.speed * 0.5;
            spot.y += Math.cos(spot.angle) * spot.speed * 0.3;

            if (spot.x < -spot.radius) spot.x = this.canvas.width + spot.radius;
            if (spot.x > this.canvas.width + spot.radius) spot.x = -spot.radius;
            if (spot.y < -spot.radius) spot.y = this.canvas.height * 0.6 + spot.radius;
            if (spot.y > this.canvas.height * 0.6 + spot.radius) spot.y = -spot.radius;

            const pulseOpacity = spot.opacity + Math.sin(spot.angle * 2) * 0.05;
            const gradient = this.ctx.createRadialGradient(
                spot.x, spot.y, 0,
                spot.x, spot.y, spot.radius
            );
            gradient.addColorStop(0, `rgba(255, 215, 100, ${pulseOpacity})`);
            gradient.addColorStop(0.5, `rgba(255, 180, 80, ${pulseOpacity * 0.5})`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    update() {
        this.drawBackground();
        this.drawSpots();
    }

    start() {
        const animate = () => {
            this.update();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}