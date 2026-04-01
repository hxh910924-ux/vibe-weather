class FoggyEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.layers = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.layers = [];
        for (let i = 0; i < 8; i++) {
            this.layers.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                width: Math.random() * 300 + 200,
                height: Math.random() * 100 + 60,
                speed: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.15 + 0.05,
                color: Math.random() > 0.5 ? 'rgba(200, 210, 220,' : 'rgba(180, 190, 200,'
            });
        }
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#6a7580');
        gradient.addColorStop(0.5, '#8a959e');
        gradient.addColorStop(1, '#a5aeb5');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLayer(layer) {
        layer.x -= layer.speed;
        if (layer.x < -layer.width) {
            layer.x = this.canvas.width;
            layer.y = Math.random() * this.canvas.height;
        }

        this.ctx.save();
        this.ctx.globalAlpha = layer.opacity;

        const gradient = this.ctx.createRadialGradient(
            layer.x + layer.width * 0.5, layer.y,
            0,
            layer.x + layer.width * 0.5, layer.y,
            layer.width * 0.5
        );
        gradient.addColorStop(0, layer.color + (layer.opacity * 2) + ')');
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.ellipse(
            layer.x + layer.width * 0.5,
            layer.y,
            layer.width * 0.5,
            layer.height * 0.5,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        this.drawBackground();
        this.layers.forEach(layer => this.drawLayer(layer));
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