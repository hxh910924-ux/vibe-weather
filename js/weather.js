const Weather = {
    cache: null,
    cacheTime: null,
    cacheTimeout: 30 * 60 * 1000,

    getWeatherByCoords(lat, lon) {
        const now = Date.now();
        if (this.cache && this.cacheTime && (now - this.cacheTime) < this.cacheTimeout) {
            return Promise.resolve(this.cache);
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=Asia%2FShanghai&forecast_days=7`;

        console.log('请求天气API:', url);

        return fetch(url)
            .then(res => {
                console.log('API响应状态:', res.status);
                if (!res.ok) throw new Error('网络请求失败: ' + res.status);
                return res.json();
            })
            .then(data => {
                console.log('API返回数据:', data);
                if (data) {
                    this.cache = data;
                    this.cacheTime = now;
                    return data;
                }
                throw new Error('获取天气数据失败');
            })
            .catch(err => {
                console.error('天气API错误:', err);
                throw err;
            });
    },

    mapWeatherCodeToEffect(code) {
        const weatherMap = {
            0: 'sunny',
            1: 'sunny',
            2: 'cloudy',
            3: 'cloudy',
            45: 'foggy',
            48: 'foggy',
            51: 'rainy',
            53: 'rainy',
            55: 'rainy',
            61: 'rainy',
            63: 'rainy',
            65: 'rainy',
            71: 'snowy',
            73: 'snowy',
            75: 'snowy',
            80: 'rainy',
            81: 'rainy',
            82: 'rainy',
            85: 'snowy',
            86: 'snowy',
            95: 'rainy',
            96: 'rainy',
            99: 'rainy'
        };
        return weatherMap[code] || 'sunny';
    },

    mapWeatherCodeToText(code) {
        const textMap = {
            0: '晴',
            1: '晴',
            2: '多云',
            3: '阴',
            45: '雾',
            48: '雾',
            51: '小雨',
            53: '小雨',
            55: '小雨',
            61: '小雨',
            63: '中雨',
            65: '大雨',
            71: '小雪',
            73: '中雪',
            75: '大雪',
            80: '阵雨',
            81: '中雨',
            82: '大雨',
            85: '阵雪',
            86: '大雪',
            95: '雷阵雨',
            96: '雷阵雨',
            99: '雷阵雨'
        };
        return textMap[code] || '未知';
    },

    mapWindDirectionToChinese(degree) {
        if (typeof degree !== 'number' || isNaN(degree)) return '无风';
        const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
        const index = Math.round(degree / 45) % 8;
        return directions[index] || '无风';
    },

    parseDailyData(data, index = 0) {
        console.log('parseDailyData called with index:', index, 'data:', data);
        if (!data || !data.daily) {
            console.log('parseDailyData: no data or no daily');
            return null;
        }

        const daily = data.daily;
        console.log('daily object:', daily);
        console.log('daily.time:', daily.time);
        console.log('daily.weathercode:', daily.weathercode);

        if (!daily.time || !daily.time[index]) {
            console.log('parseDailyData: no time data at index', index);
            return null;
        }

        const weatherCode = daily.weathercode[index];
        const tempMax = daily.temperature_2m_max[index];
        const tempMin = daily.temperature_2m_min[index];
        const windDir = daily.winddirection_10m_dominant[index];
        const windSpeed = daily.windspeed_10m_max[index];

        console.log('weatherCode:', weatherCode, 'tempMax:', tempMax, 'tempMin:', tempMin);

        return {
            fxDate: daily.time[index],
            tempMax: Math.round(tempMax),
            tempMin: Math.round(tempMin),
            textDay: this.mapWeatherCodeToText(weatherCode),
            textNight: this.mapWeatherCodeToText(daily.weathercode[index] || weatherCode),
            windDirDay: this.mapWindDirectionToChinese(windDir),
            windScaleDay: Math.round(windSpeed) || 0,
            precip: daily.precipitation_sum[index] || 0,
            sunrise: daily.sunrise[index] ? daily.sunrise[index].split('T')[1] : '--:--',
            sunset: daily.sunset[index] ? daily.sunset[index].split('T')[1] : '--:--',
            effect: this.mapWeatherCodeToEffect(weatherCode)
        };
    },

    getWeekday(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '今天';
        if (diffDays === 1) return '明天';
        if (diffDays === 2) return '后天';

        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekdays[date.getDay()];
    }
};