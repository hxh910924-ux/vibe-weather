import { BaseEffect } from "./base.js";

export class RainyEffect extends BaseEffect {
  constructor(...args) {
    super(...args);
    this.drops = this.createDrops();
  }

  resize(width, height) {
    super.resize(width, height);
    this.drops = this.createDrops();
  }

  createDrops() {
    return Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      length: 12 + Math.random() * 18,
      speed: 0.002 + Math.random() * 0.004,
      alpha: 0.2 + Math.random() * 0.3,
    }));
  }

  draw(now) {
    const { ctx, width, height } = this;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#3d5367");
    gradient.addColorStop(0.5, "#233446");
    gradient.addColorStop(1, "#101926");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1.25;
    ctx.lineCap = "round";
    this.drops.forEach((drop) => {
      const x = drop.x * width;
      const y = ((drop.y + now * drop.speed) % 1.2) * height - height * 0.1;
      ctx.strokeStyle = `rgba(217, 237, 255, ${drop.alpha})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 8, y + drop.length);
      ctx.stroke();
    });

    ctx.restore();
  }
}
