const Storage = {
    KEYS: {
        CITIES: 'atmos-weather-cities',
        THEME: 'atmos-weather-theme',
        LOCATED: 'atmos-weather-located'
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Storage get error:', e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Storage set error:', e);
            return false;
        }
    },

    getCities() {
        return this.get(this.KEYS.CITIES) || [];
    },

    addCity(city) {
        const cities = this.getCities();
        const index = cities.indexOf(city);
        if (index > -1) {
            cities.splice(index, 1);
        }
        cities.unshift(city);
        if (cities.length > 5) {
            cities.pop();
        }
        this.set(this.KEYS.CITIES, cities);
    },

    getTheme() {
        return this.get(this.KEYS.THEME);
    },

    setTheme(theme) {
        this.set(this.KEYS.THEME, theme);
    },

    clearTheme() {
        localStorage.removeItem(this.KEYS.THEME);
    },

    getLocated() {
        return this.get(this.KEYS.LOCATED);
    },

    setLocated(value) {
        this.set(this.KEYS.LOCATED, value);
    }
};