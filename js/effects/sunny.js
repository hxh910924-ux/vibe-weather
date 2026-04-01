import { BaseEffect } from "./base.js";

export class SunnyEffect extends BaseEffect {
  constructor(...args) {
    super(...args);
    this.glows = Array.from({ length: 4 }, (_, index) => ({
      radius: 120 + index * 40,
      offset: Math.random() * Math.PI * 2,
      speed: 0.0004 + index * 0.00015,
      xFactor: 0.25 + index * 0.18,
      yFactor: 0.18 + index * 0.1,
    }));
  }

  draw(now) {
    const { ctx, width, height } = this;
    ctx.save();
    ctx.globalAlpha = this.opacity;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f6c978");
    gradient.addColorStop(0.48, "#f5a76e");
    gradient.addColorStop(1, "#6d9ed6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    this.glows.forEach((glow) => {
      const x = width * glow.xFactor + Math.sin(now * glow.speed + glow.offset) * 60;
      const y = height * glow.yFactor + Math.cos(now * glow.speed + glow.offset) * 50;
      const radial = ctx.createRadialGradient(x, y, 10, x, y, glow.radius);
      radial.addColorStop(0, "rgba(255, 251, 221, 0.5)");
      radial.addColorStop(1, "rgba(255, 251, 221, 0)");
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(x, y, glow.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
}
