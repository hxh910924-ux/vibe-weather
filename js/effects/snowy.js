import { BaseEffect } from "./base.js";

export class SnowyEffect extends BaseEffect {
  constructor(...args) {
    super(...args);
    this.flakes = this.createFlakes();
  }

  resize(width, height) {
    super.resize(width, height);
    this.flakes = this.createFlakes();
  }

  createFlakes() {
    return Array.from({ length: 130 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 1 + Math.random() * 3.5,
      sway: Math.random() * Math.PI * 2,
      speed: 0.0004 + Math.random() * 0.0012,
    }));
  }

  draw(now) {
    const { ctx, width, height } = this;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#a8bcd8");
    gradient.addColorStop(0.45, "#627892");
    gradient.addColorStop(1, "#22303f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    this.flakes.forEach((flake) => {
      const x = flake.x * width + Math.sin(now * 0.0015 + flake.sway) * 18;
      const y = ((flake.y + now * flake.speed) % 1.2) * height - height * 0.1;
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.beginPath();
      ctx.arc(x, y, flake.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}
