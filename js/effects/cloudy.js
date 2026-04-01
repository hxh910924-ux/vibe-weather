class CloudyEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.clouds = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.clouds = [];
        for (let i = 0; i < 6; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width * 1.5 - this.canvas.width * 0.25,
                y: Math.random() * this.canvas.height * 0.5 + 50,
                width: Math.random() * 200 + 150,
                height: Math.random() * 80 + 50,
                speed: Math.random() * 0.2 + 0.1,
                opacity: Math.random() * 0.15 + 0.1
            });
        }
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#8fa5b5');
        gradient.addColorStop(0.5, '#b5c5d0');
        gradient.addColorStop(1, '#d5dfe5');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCloud(cloud) {
        cloud.x += cloud.speed;
        if (cloud.x > this.canvas.width + cloud.width * 0.5) {
            cloud.x = -cloud.width;
        }

        this.ctx.save();
        this.ctx.globalAlpha = cloud.opacity;

        const gradient = this.ctx.createRadialGradient(
            cloud.x + cloud.width * 0.5, cloud.y,
            0,
            cloud.x + cloud.width * 0.5, cloud.y,
            cloud.width * 0.5
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(200, 210, 220, 0.6)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.ellipse(
            cloud.x + cloud.width * 0.5,
            cloud.y,
            cloud.width * 0.5,
            cloud.height * 0.5,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(
            cloud.x + cloud.width * 0.3,
            cloud.y + cloud.height * 0.2,
            cloud.width * 0.35,
            cloud.height * 0.35,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.ellipse(
            cloud.x + cloud.width * 0.7,
            cloud.y + cloud.height * 0.15,
            cloud.width * 0.3,
            cloud.height * 0.3,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        this.ctx.restore();
    }

    update() {
        this.drawBackground();
        this.clouds.forEach(cloud => this.drawCloud(cloud));
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