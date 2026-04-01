export class BaseEffect {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.opacity = 1;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
  }

  update() {}

  draw() {}

  destroy() {}
}
