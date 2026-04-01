const Geo = {
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('浏览器不支持定位'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    },

    getCityByIP() {
        return fetch('https://ip-api.com/json/?fields=status,country,city,lat,lon')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    return {
                        name: data.city || data.country || '未知',
                        id: `${data.lat},${data.lon}`,
                        country: data.country || '',
                        lat: data.lat,
                        lon: data.lon
                    };
                }
                throw new Error('IP定位失败');
            });
    },

    getCityByCoords(lat, lon) {
        return this.getCityByIP().catch(() => {
            return { name: '未知', id: `${lat},${lon}`, country: '', lat, lon };
        });
    },

    searchCity(keyword) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(keyword)}&count=10&language=zh&format=json`;

        return fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.results && Array.isArray(data.results)) {
                    return data.results.map(loc => ({
                        name: loc.name,
                        id: `${loc.latitude},${loc.longitude}`,
                        country: loc.country || '',
                        adm1: loc.admin1 || '',
                        lat: loc.latitude,
                        lon: loc.longitude
                    }));
                }
                return [];
            })
            .catch(() => []);
    }
};