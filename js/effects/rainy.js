class RainyEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.drops = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.drops = [];
        for (let i = 0; i < 150; i++) {
            this.drops.push({
                x: Math.random() * this.canvas.width * 1.2 - this.canvas.width * 0.1,
                y: Math.random() * -this.canvas.height,
                length: Math.random() * 15 + 10,
                speed: Math.random() * 8 + 6,
                opacity: Math.random() * 0.4 + 0.3,
                width: Math.random() * 1.5 + 0.5
            });
        }
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#2a3a4a');
        gradient.addColorStop(0.5, '#3a4a5a');
        gradient.addColorStop(1, '#4a5a6a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawDrop(drop) {
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.1;

        if (drop.y > this.canvas.height) {
            drop.y = Math.random() * -100;
            drop.x = Math.random() * this.canvas.width * 1.2 - this.canvas.width * 0.1;
        }

        this.ctx.save();
        this.ctx.globalAlpha = drop.opacity;
        this.ctx.strokeStyle = '#a0c4ff';
        this.ctx.lineWidth = drop.width;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(drop.x, drop.y);
        this.ctx.lineTo(drop.x + drop.length * 0.3, drop.y + drop.length);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawSplash() {
        const splashCount = 3;
        for (let i = 0; i < splashCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height - Math.random() * 30;
            const radius = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.3 + 0.1;

            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    update() {
        this.drawBackground();
        this.drops.forEach(drop => this.drawDrop(drop));
        this.drawSplash();
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