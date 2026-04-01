class NightEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.stars = [];
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.7,
                radius: Math.random() * 1.5 + 0.5,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleAngle: Math.random() * Math.PI * 2,
                brightness: Math.random() * 0.5 + 0.3
            });
        }
    }

    drawBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width * 0.5, this.canvas.height * 0.3, 0,
            this.canvas.width * 0.5, this.canvas.height * 0.3, this.canvas.width * 0.8
        );
        gradient.addColorStop(0, '#0a1020');
        gradient.addColorStop(0.5, '#050a15');
        gradient.addColorStop(1, '#020508');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStar(star) {
        star.twinkleAngle += star.twinkleSpeed;
        const alpha = star.brightness + Math.sin(star.twinkleAngle) * 0.2;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.globalAlpha = alpha * 0.3;
        const gradient = this.ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 4
        );
        gradient.addColorStop(0, 'rgba(150, 180, 255, 0.5)');
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        this.drawBackground();
        this.stars.forEach(star => this.drawStar(star));
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