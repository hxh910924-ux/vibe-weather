import { BaseEffect } from "./base.js";

export class NightEffect extends BaseEffect {
  constructor(...args) {
    super(...args);
    this.stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.75,
      radius: 0.8 + Math.random() * 1.8,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  draw(now) {
    const { ctx, width, height } = this;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#12203a");
    gradient.addColorStop(0.48, "#091226");
    gradient.addColorStop(1, "#020711");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    this.stars.forEach((star) => {
      const alpha = 0.35 + (Math.sin(now * 0.002 + star.pulse) + 1) * 0.24;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    const moon = ctx.createRadialGradient(
      width * 0.78,
      height * 0.2,
      8,
      width * 0.78,
      height * 0.2,
      64,
    );
    moon.addColorStop(0, "rgba(255,248,214,0.9)");
    moon.addColorStop(1, "rgba(255,248,214,0)");
    ctx.fillStyle = moon;
    ctx.beginPath();
    ctx.arc(width * 0.78, height * 0.2, 64, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
