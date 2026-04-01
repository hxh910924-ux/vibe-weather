const KEYS = {
  recentCities: "atmos-weather-cities",
  theme: "atmos-weather-theme",
  located: "atmos-weather-located",
};

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage 不可用时静默降级
  }
}

export function getRecentCities() {
  return readJson(KEYS.recentCities, []);
}

export function saveRecentCity(city) {
  const current = getRecentCities().filter((item) => item.id !== city.id);
  const next = [city, ...current].slice(0, 5);
  writeJson(KEYS.recentCities, next);
  return next;
}

export function getThemePreference() {
  return readJson(KEYS.theme, "auto");
}

export function setThemePreference(theme) {
  writeJson(KEYS.theme, theme);
}

export function getLocatedFlag() {
  return readJson(KEYS.located, false);
}

export function setLocatedFlag(value) {
  writeJson(KEYS.located, Boolean(value));
}
