import { BaseEffect } from "./base.js";

export class CloudyEffect extends BaseEffect {
  constructor(...args) {
    super(...args);
    this.clouds = Array.from({ length: 8 }, (_, index) => ({
      x: Math.random(),
      y: 0.12 + index * 0.1,
      scale: 0.7 + Math.random() * 1.4,
      speed: 0.00001 + Math.random() * 0.00003,
      alpha: 0.08 + Math.random() * 0.14,
    }));
  }

  draw(now) {
    const { ctx, width, height } = this;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#8ba0b3");
    gradient.addColorStop(0.45, "#597287");
    gradient.addColorStop(1, "#273849");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    this.clouds.forEach((cloud) => {
      const x = ((cloud.x + now * cloud.speed) % 1.3) * width - width * 0.15;
      const y = cloud.y * height;
      const radius = 36 * cloud.scale;
      ctx.fillStyle = `rgba(255,255,255,${cloud.alpha})`;
      this.drawCloud(x, y, radius);
    });
    ctx.restore();
  }

  drawCloud(x, y, radius) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + radius * 0.9, y - radius * 0.35, radius * 0.8, Math.PI, Math.PI * 1.9);
    ctx.arc(x + radius * 1.85, y, radius * 1.05, Math.PI * 1.45, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
  }
}
