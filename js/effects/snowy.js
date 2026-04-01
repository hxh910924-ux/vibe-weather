class SnowyEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.snowflakes = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.snowflakes = [];
        for (let i = 0; i < 120; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * -this.canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 1.5 + 0.8,
                opacity: Math.random() * 0.6 + 0.3,
                swingAmplitude: Math.random() * 0.5 + 0.2,
                swingSpeed: Math.random() * 0.03 + 0.01,
                swingAngle: Math.random() * Math.PI * 2
            });
        }
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#6a8fa0');
        gradient.addColorStop(0.5, '#8ab0c0');
        gradient.addColorStop(1, '#b0c8d5');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSnowflake(flake) {
        flake.y += flake.speed;
        flake.swingAngle += flake.swingSpeed;
        flake.x += Math.sin(flake.swingAngle) * flake.swingAmplitude;

        if (flake.y > this.canvas.height) {
            flake.y = Math.random() * -50;
            flake.x = Math.random() * this.canvas.width;
        }

        this.ctx.save();
        this.ctx.globalAlpha = flake.opacity;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        this.drawBackground();
        this.snowflakes.forEach(flake => this.drawSnowflake(flake));
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