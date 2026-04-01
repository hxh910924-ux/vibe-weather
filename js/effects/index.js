const EffectManager = {
    canvas: null,
    ctx: null,
    currentEffect: null,
    effects: {},
    transitionDuration: 1500,
    isTransitioning: false,

    init() {
        this.canvas = document.getElementById('weatherCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.effects = {
            sunny: new SunnyEffect(this.canvas),
            cloudy: new CloudyEffect(this.canvas),
            rainy: new RainyEffect(this.canvas),
            snowy: new SnowyEffect(this.canvas),
            foggy: new FoggyEffect(this.canvas),
            night: new NightEffect(this.canvas)
        };
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    switchEffect(effectName, callback) {
        if (!this.effects[effectName]) {
            console.warn('Unknown effect:', effectName);
            return;
        }

        if (this.currentEffect === this.effects[effectName]) {
            if (callback) callback();
            return;
        }

        this.isTransitioning = true;

        const oldEffect = this.currentEffect;
        const newEffect = this.effects[effectName];

        newEffect.init();
        newEffect.start();

        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.transitionDuration, 1);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isTransitioning = false;
                if (oldEffect) oldEffect.stop();
                this.currentEffect = newEffect;
                if (callback) callback();
            }
        };
        animate();
    },

    startDefault() {
        if (this.currentEffect) return;
        this.currentEffect = this.effects.sunny;
        this.currentEffect.init();
        this.currentEffect.start();
    }
};