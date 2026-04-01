import { SunnyEffect } from "./sunny.js";
import { CloudyEffect } from "./cloudy.js";
import { RainyEffect } from "./rainy.js";
import { SnowyEffect } from "./snowy.js";
import { FoggyEffect } from "./foggy.js";
import { NightEffect } from "./night.js";

const EFFECTS = {
  sunny: SunnyEffect,
  cloudy: CloudyEffect,
  rainy: RainyEffect,
  snowy: SnowyEffect,
  foggy: FoggyEffect,
  night: NightEffect,
};

export class EffectManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.currentName = "sunny";
    this.currentEffect = null;
    this.previousEffect = null;
    this.transitionStartedAt = 0;
    this.transitionDuration = 1500;
    this.boundRender = this.render.bind(this);
    this.resize();
    this.switchTo("sunny", false);
    window.addEventListener("resize", () => this.resize());
    this.frameId = requestAnimationFrame(this.boundRender);
  }

  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.currentEffect?.resize(width, height);
    this.previousEffect?.resize(width, height);
  }

  switchTo(name, animate = true) {
    const EffectClass = EFFECTS[name] || SunnyEffect;
    if (name === this.currentName && this.currentEffect) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const nextEffect = new EffectClass(this.ctx, width, height);
    nextEffect.setOpacity(animate ? 0 : 1);

    if (animate && this.currentEffect) {
      this.previousEffect?.destroy();
      this.previousEffect = this.currentEffect;
      this.transitionStartedAt = performance.now();
    } else {
      this.previousEffect?.destroy();
      this.currentEffect?.destroy();
      this.previousEffect = null;
    }

    this.currentEffect = nextEffect;
    this.currentName = name;
  }

  render(now) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.ctx.clearRect(0, 0, width, height);

    if (this.previousEffect) {
      const progress = Math.min(
        (now - this.transitionStartedAt) / this.transitionDuration,
        1,
      );
      this.previousEffect.setOpacity(1 - progress);
      this.currentEffect.setOpacity(progress);
      this.previousEffect.draw(now);
      if (progress >= 1) {
        this.previousEffect.destroy();
        this.previousEffect = null;
        this.currentEffect.setOpacity(1);
      }
    }

    this.currentEffect?.draw(now);
    this.frameId = requestAnimationFrame(this.boundRender);
  }
}
