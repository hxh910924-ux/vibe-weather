import { getDefaultCity } from "./utils/geo.js";

const DEFAULT_CITIES = [
  getDefaultCity(),
  {
    id: "101020100",
    name: "\u4e0a\u6d77",
    adm1: "\u4e0a\u6d77\u5e02",
    country: "\u4e2d\u56fd",
    lat: 31.2304,
    lon: 121.4737,
  },
  {
    id: "101280101",
    name: "\u5e7f\u5dde",
    adm1: "\u5e7f\u4e1c\u7701",
    country: "\u4e2d\u56fd",
    lat: 23.1291,
    lon: 113.2644,
  },
  {
    id: "101280601",
    name: "\u6df1\u5733",
    adm1: "\u5e7f\u4e1c\u7701",
    country: "\u4e2d\u56fd",
    lat: 22.5431,
    lon: 114.0579,
  },
  {
    id: "101270101",
    name: "\u6210\u90fd",
    adm1: "\u56db\u5ddd\u7701",
    country: "\u4e2d\u56fd",
    lat: 30.5728,
    lon: 104.0668,
  },
  {
    id: "101110101",
    name: "\u897f\u5b89",
    adm1: "\u9655\u897f\u7701",
    country: "\u4e2d\u56fd",
    lat: 34.3416,
    lon: 108.9398,
  },
  {
    id: "101210101",
    name: "\u676d\u5dde",
    adm1: "\u6d59\u6c5f\u7701",
    country: "\u4e2d\u56fd",
    lat: 30.2741,
    lon: 120.1551,
  },
  {
    id: "101030100",
    name: "\u5929\u6d25",
    adm1: "\u5929\u6d25\u5e02",
    country: "\u4e2d\u56fd",
    lat: 39.0842,
    lon: 117.2009,
  },
];

const WEATHER_TO_EFFECT = {
  "\u6674": "sunny",
  "\u591a\u4e91": "cloudy",
  "\u9634": "cloudy",
  "\u5c0f\u96e8": "rainy",
  "\u4e2d\u96e8": "rainy",
  "\u5927\u96e8": "rainy",
  "\u66b4\u96e8": "rainy",
  "\u96f7\u9635\u96e8": "rainy",
  "\u5c0f\u96ea": "snowy",
  "\u4e2d\u96ea": "snowy",
  "\u5927\u96ea": "snowy",
  "\u96e8\u5939\u96ea": "snowy",
  "\u96fe": "foggy",
  "\u973e": "foggy",
};

function withTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);
  return fetch(url, { signal: controller.signal }).finally(() =>
    window.clearTimeout(timer),
  );
}

function getApiKey() {
  return window.ATMOS_WEATHER_CONFIG?.qweatherKey || "";
}

function buildSummary(day) {
  const precipLabel =
    Number(day.precip) > 0
      ? `${day.textDay} · \u964d\u6c34 ${day.precip} mm`
      : `${day.textDay} · \u65e0\u660e\u663e\u964d\u6c34`;
  return `${precipLabel} · ${day.windDirDay}${day.windScaleDay}\u7ea7`;
}

function isNight(day) {
  const hour = new Date().getHours();
  const sunrise = Number((day.sunrise || "06:00").split(":")[0]);
  const sunset = Number((day.sunset || "18:00").split(":")[0]);
  return hour < sunrise || hour >= sunset;
}

function mapWeatherToTheme(day, index) {
  if (index === 0 && isNight(day)) {
    return "night";
  }
  return WEATHER_TO_EFFECT[day.textDay] || "sunny";
}

function normalizeLocation(raw) {
  return {
    id: raw.id || raw.locationId || raw.fxLink || raw.name,
    name: raw.name,
    adm1: raw.adm1 || raw.region || "",
    country: raw.country || "\u4e2d\u56fd",
    lat: raw.lat,
    lon: raw.lon,
  };
}

async function searchCitiesFromApi(keyword) {
  const key = getApiKey();
  const url = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(keyword)}&key=${encodeURIComponent(key)}`;
  const response = await withTimeout(url);
  if (!response.ok) {
    throw new Error("City search failed");
  }

  const json = await response.json();
  return (json.location || []).map((item) => ({
    id: item.id,
    name: item.name,
    adm1: item.adm1,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
}

function searchCitiesFromPreset(keyword) {
  const lowerKeyword = keyword.trim().toLowerCase();
  if (!lowerKeyword) {
    return DEFAULT_CITIES;
  }
  return DEFAULT_CITIES.filter((city) =>
    `${city.name}${city.adm1}${city.country}`.toLowerCase().includes(lowerKeyword),
  );
}

function createMockForecast(city) {
  const labels = [
    {
      textDay: "\u6674",
      min: 12,
      max: 24,
      precip: "0.0",
      wind: "\u4e1c\u5357\u98ce",
    },
    {
      textDay: "\u591a\u4e91",
      min: 11,
      max: 22,
      precip: "0.0",
      wind: "\u4e1c\u98ce",
    },
    {
      textDay: "\u5c0f\u96e8",
      min: 10,
      max: 17,
      precip: "4.6",
      wind: "\u5317\u98ce",
    },
    {
      textDay: "\u96fe",
      min: 9,
      max: 15,
      precip: "0.2",
      wind: "\u4e1c\u5317\u98ce",
    },
    {
      textDay: "\u6674",
      min: 13,
      max: 23,
      precip: "0.0",
      wind: "\u897f\u5357\u98ce",
    },
    {
      textDay: "\u4e2d\u96e8",
      min: 8,
      max: 16,
      precip: "12.0",
      wind: "\u4e1c\u5357\u98ce",
    },
    {
      textDay: "\u5c0f\u96ea",
      min: -1,
      max: 5,
      precip: "3.0",
      wind: "\u5317\u98ce",
    },
  ];

  const daily = labels.map((item, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      fxDate: date.toISOString().slice(0, 10),
      tempMax: String(item.max),
      tempMin: String(item.min),
      textDay: item.textDay,
      textNight: item.textDay,
      windDirDay: item.wind,
      windScaleDay: String((index % 3) + 2),
      precip: item.precip,
      sunrise: "06:12",
      sunset: "18:35",
    };
  });

  return {
    city,
    daily,
  };
}

async function fetchForecastFromApi(cityId) {
  const key = getApiKey();
  const url = `https://devapi.qweather.com/v7/weather/7d?location=${encodeURIComponent(cityId)}&key=${encodeURIComponent(key)}`;
  const response = await withTimeout(url);
  if (!response.ok) {
    throw new Error("Weather fetch failed");
  }
  return response.json();
}

async function reverseLookupCity(lat, lon) {
  const key = getApiKey();
  if (!key) {
    return getDefaultCity();
  }

  const url = `https://geoapi.qweather.com/v2/city/lookup?location=${lon},${lat}&key=${encodeURIComponent(key)}`;
  const response = await withTimeout(url);
  if (!response.ok) {
    throw new Error("Reverse lookup failed");
  }

  const json = await response.json();
  return normalizeLocation(json.location?.[0] || getDefaultCity());
}

export async function searchCities(keyword) {
  if (getApiKey()) {
    try {
      return await searchCitiesFromApi(keyword);
    } catch {
      return searchCitiesFromPreset(keyword);
    }
  }
  return searchCitiesFromPreset(keyword);
}

export async function resolveCurrentCity(position) {
  if (!position) {
    return getDefaultCity();
  }
  const { latitude, longitude } = position.coords;
  return reverseLookupCity(latitude, longitude);
}

export async function getForecast(city) {
  if (!getApiKey()) {
    return normalizeForecast(createMockForecast(city));
  }

  try {
    const json = await fetchForecastFromApi(city.id);
    return normalizeForecast({ city, daily: json.daily || [] });
  } catch {
    return normalizeForecast(createMockForecast(city));
  }
}

function normalizeForecast(payload) {
  const city = normalizeLocation(payload.city);
  const days = payload.daily.slice(0, 7).map((day, index) => ({
    date: day.fxDate,
    label: getDateLabel(day.fxDate, index),
    weekday: getWeekday(day.fxDate),
    temperature: Math.round((Number(day.tempMax) + Number(day.tempMin)) / 2),
    temperatureRange: `${day.tempMin}\u00b0 / ${day.tempMax}\u00b0`,
    summary: buildSummary(day),
    sunrise: day.sunrise,
    sunset: day.sunset,
    wind: `${day.windDirDay}${day.windScaleDay}`,
    precip: day.precip,
    weatherText: day.textDay,
    effect: mapWeatherToTheme(day, index),
  }));

  return {
    city,
    days,
  };
}

function getDateLabel(dateText, index) {
  if (index === 0) {
    return "\u4eca\u5929";
  }
  if (index === 1) {
    return "\u660e\u5929";
  }
  if (index === 2) {
    return "\u540e\u5929";
  }
  return getWeekday(dateText);
}

function getWeekday(dateText) {
  const weekdays = [
    "\u5468\u65e5",
    "\u5468\u4e00",
    "\u5468\u4e8c",
    "\u5468\u4e09",
    "\u5468\u56db",
    "\u5468\u4e94",
    "\u5468\u516d",
  ];
  return weekdays[new Date(dateText).getDay()];
}
