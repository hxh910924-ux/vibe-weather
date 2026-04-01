const App = {
    currentCity: null,
    currentCityId: null,
    currentPos: null,
    weatherData: null,
    currentDayIndex: 0,
    manualTheme: null,

    elements: {},

    init() {
        this.cacheElements();
        this.bindEvents();
        EffectManager.init();
        EffectManager.startDefault();
        this.loadInitialData();
    },

    cacheElements() {
        this.elements = {
            cityName: document.getElementById('cityName'),
            temperature: document.getElementById('temperature'),
            weatherDesc: document.getElementById('weatherDesc'),
            sunrise: document.getElementById('sunrise'),
            sunset: document.getElementById('sunset'),
            dateSelector: document.getElementById('dateSelector'),
            themeSelector: document.querySelector('.theme-selector'),
            loadingText: document.getElementById('loadingText'),
            errorText: document.getElementById('errorText'),
            searchModal: document.getElementById('searchModal'),
            searchInput: document.getElementById('searchInput'),
            searchResults: document.getElementById('searchResults'),
            recentCities: document.getElementById('recentCities')
        };
    },

    bindEvents() {
        this.elements.cityName.addEventListener('click', () => this.openSearchModal());
        this.elements.searchModal.addEventListener('click', (e) => {
            if (e.target === this.elements.searchModal) {
                this.closeSearchModal();
            }
        });
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        this.elements.dateSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('date-item')) {
                const index = parseInt(e.target.dataset.index);
                this.switchDay(index);
            }
        });

        this.elements.themeSelector.addEventListener('click', (e) => {
            const themeItem = e.target.closest('.theme-item');
            if (themeItem) {
                const theme = themeItem.dataset.theme;
                this.switchTheme(theme);
            }
        });
    },

    loadInitialData() {
        const savedTheme = Storage.getTheme();
        if (savedTheme) {
            this.manualTheme = savedTheme;
            EffectManager.switchEffect(savedTheme);
            this.updateThemeUI(savedTheme);
        }

        const recentCities = Storage.getCities();
        if (recentCities.length > 0) {
            this.updateRecentCities(recentCities);
        }

        this.autoLocate();
    },

    autoLocate() {
        this.showLoading(true);
        console.log('开始自动定位...');
        Geo.getCurrentPosition()
            .then(pos => {
                console.log('定位成功:', pos);
                this.currentPos = pos;
                this.loadWeatherByCoords(pos.lat, pos.lon);
                return Geo.getCityByCoords(pos.lat, pos.lon);
            })
            .then(city => {
                console.log('获取城市成功:', city);
                if (city && city.name) {
                    this.currentCity = city.name;
                    this.elements.cityName.textContent = city.name;
                }
            })
            .catch(err => {
                console.error('自动定位失败:', err);
                const defaultCity = { name: '北京', id: '39.9042,116.4074', lat: 39.9042, lon: 116.4074 };
                this.selectCity(defaultCity);
            });
    },

    selectCity(city) {
        console.log('选择城市:', city);
        this.currentCity = city.name;
        this.currentCityId = city.id;
        this.elements.cityName.textContent = city.name;
        Storage.addCity(city.name);
        this.updateRecentCities(Storage.getCities());

        const coords = this.parseCoords(city.id);
        if (coords) {
            this.loadWeatherByCoords(coords.lat, coords.lon);
        } else if (city.lat && city.lon) {
            this.loadWeatherByCoords(city.lat, city.lon);
        } else {
            console.error('无法获取坐标信息');
            this.showError(true);
            this.showLoading(false);
        }
    },

    parseCoords(id) {
        if (!id) return null;
        const parts = id.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lon = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lon)) {
                return { lat, lon };
            }
        }
        return null;
    },

    loadWeatherByCoords(lat, lon) {
        console.log('加载天气数据, 坐标:', lat, lon);
        this.showLoading(true);
        this.showError(false);
        Weather.getWeatherByCoords(lat, lon)
            .then(data => {
                console.log('天气数据加载成功:', data);
                this.weatherData = data;
                this.updateUI();
                this.showLoading(false);
            })
            .catch(err => {
                console.error('天气数据加载失败:', err);
                this.showError(true);
                this.showLoading(false);
            });
    },

    updateUI() {
        if (!this.weatherData) {
            console.log('没有天气数据');
            return;
        }
        const day = Weather.parseDailyData(this.weatherData, this.currentDayIndex);
        if (!day) {
            console.log('无法解析天气数据, daily:', this.weatherData.daily);
            return;
        }

        console.log('更新UI, day:', day);
        this.elements.temperature.textContent = `${day.tempMax}°`;
        this.elements.weatherDesc.textContent = `${day.textDay} · ${day.windDirDay}${day.windScaleDay}级`;
        this.elements.sunrise.textContent = day.sunrise;
        this.elements.sunset.textContent = day.sunset;

        this.updateDateSelector();
        this.updateThemeUI(day.effect);
    },

    updateDateSelector() {
        if (!this.weatherData || !this.weatherData.daily) return;
        const daily = this.weatherData.daily;
        const items = this.elements.dateSelector.querySelectorAll('.date-item');

        items.forEach((item, index) => {
            if (daily.time && daily.time[index]) {
                item.textContent = Weather.getWeekday(daily.time[index]);
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });

        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentDayIndex);
        });
    },

    updateThemeUI(effect) {
        if (this.manualTheme) {
            effect = this.manualTheme;
        }
        const items = this.elements.themeSelector.querySelectorAll('.theme-item');
        items.forEach(item => {
            item.classList.toggle('active', item.dataset.theme === effect);
        });
    },

    switchDay(index) {
        this.currentDayIndex = index;
        this.updateUI();
    },

    switchTheme(theme) {
        this.manualTheme = theme;
        Storage.setTheme(theme);
        EffectManager.switchEffect(theme);
        this.updateThemeUI(theme);
    },

    openSearchModal() {
        this.elements.searchModal.classList.add('active');
        this.elements.searchInput.value = '';
        this.elements.searchResults.innerHTML = '';
        this.elements.searchInput.focus();
    },

    closeSearchModal() {
        this.elements.searchModal.classList.remove('active');
    },

    handleSearch(keyword) {
        if (!keyword.trim()) {
            this.elements.searchResults.innerHTML = '';
            return;
        }

        Geo.searchCity(keyword)
            .then(results => {
                this.renderSearchResults(results);
            });
    },

    renderSearchResults(results) {
        if (results.length === 0) {
            this.elements.searchResults.innerHTML = '<div class="search-result-item"><div class="result-city">未找到相关城市</div></div>';
            return;
        }

        this.elements.searchResults.innerHTML = results.map(city => `
            <div class="search-result-item" data-id="${city.id}" data-name="${city.name}" data-lat="${city.lat || ''}" data-lon="${city.lon || ''}">
                <div class="result-city">${city.name}</div>
                <div class="result-country">${city.country} · ${city.adm1 || ''}</div>
            </div>
        `).join('');

        this.elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const city = {
                    id: item.dataset.id,
                    name: item.dataset.name,
                    lat: parseFloat(item.dataset.lat),
                    lon: parseFloat(item.dataset.lon)
                };
                this.selectCity(city);
                this.closeSearchModal();
            });
        });
    },

    updateRecentCities(cities) {
        if (cities.length === 0) {
            this.elements.recentCities.innerHTML = '';
            return;
        }

        this.elements.recentCities.innerHTML = `
            <div class="recent-label">最近:</div>
            ${cities.map(city => `<button class="recent-city">${city}</button>`).join('')}
        `;

        this.elements.recentCities.querySelectorAll('.recent-city').forEach(btn => {
            btn.addEventListener('click', () => {
                const cityName = btn.textContent;
                Geo.searchCity(cityName)
                    .then(results => {
                        if (results.length > 0) {
                            this.selectCity(results[0]);
                            this.closeSearchModal();
                        }
                    });
            });
        });
    },

    showLoading(show) {
        this.elements.loadingText.style.display = show ? 'block' : 'none';
    },

    showError(show) {
        this.elements.errorText.style.display = show ? 'block' : 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});