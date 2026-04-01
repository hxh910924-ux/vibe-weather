import { BaseEffect } from "./base.js";

export class FoggyEffect extends BaseEffect {
  constructor(...args) {
    super(...args);
    this.layers = Array.from({ length: 6 }, (_, index) => ({
      y: 0.16 + index * 0.12,
      height: 56 + Math.random() * 90,
      speed: 0.00001 + Math.random() * 0.00003,
      offset: Math.random(),
      alpha: 0.08 + Math.random() * 0.1,
    }));
  }

  draw(now) {
    const { ctx, width, height } = this;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#8c9299");
    gradient.addColorStop(0.48, "#61666d");
    gradient.addColorStop(1, "#2f3943");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    this.layers.forEach((layer) => {
      const x = ((layer.offset + now * layer.speed) % 1.6) * width - width * 0.3;
      const y = layer.y * height;
      const fog = ctx.createLinearGradient(x, y, x + width * 0.42, y);
      fog.addColorStop(0, "rgba(255,255,255,0)");
      fog.addColorStop(0.5, `rgba(255,255,255,${layer.alpha})`);
      fog.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(x, y, width * 0.42, layer.height);
    });
    ctx.restore();
  }
}
