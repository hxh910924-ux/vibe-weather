import { EffectManager } from "./effects/index.js";
import { getCurrentPosition, getDefaultCity } from "./utils/geo.js";
import {
  getRecentCities,
  saveRecentCity,
  getThemePreference,
  setThemePreference,
  setLocatedFlag,
} from "./utils/storage.js";
import { getForecast, resolveCurrentCity, searchCities } from "./weather.js";

const state = {
  city: null,
  forecast: null,
  selectedIndex: 0,
  theme: getThemePreference(),
};

const elements = {
  cityName: document.querySelector("#city-name"),
  temperature: document.querySelector("#temperature"),
  summary: document.querySelector("#weather-summary"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  status: document.querySelector("#status-message"),
  dateList: document.querySelector("#date-list"),
  recentCities: document.querySelector("#recent-cities"),
  cityResults: document.querySelector("#city-results"),
  cityDialog: document.querySelector("#city-dialog"),
  cityInput: document.querySelector("#city-input"),
  cityTrigger: document.querySelector("#city-trigger"),
  cityClose: document.querySelector("#city-close"),
  cityBackdrop: document.querySelector("#city-backdrop"),
  themeButtons: Array.from(document.querySelectorAll(".theme-button")),
};

const manager = new EffectManager(document.querySelector("#weather-canvas"));

function setStatus(message) {
  elements.status.textContent = message;
}

function renderWeather() {
  if (!state.forecast) {
    return;
  }

  const day = state.forecast.days[state.selectedIndex];
  elements.cityName.textContent = state.forecast.city.adm1
    ? `${state.forecast.city.name} | ${state.forecast.city.adm1}`
    : state.forecast.city.name;
  elements.temperature.textContent = String(day.temperature);
  elements.summary.textContent = day.summary;
  elements.sunrise.textContent = `\u65e5\u51fa ${day.sunrise}`;
  elements.sunset.textContent = `\u65e5\u843d ${day.sunset}`;
  setStatus(
    state.theme === "auto"
      ? "\u5929\u6c14\u5df2\u540c\u6b65\u5230\u5f53\u524d\u6c1b\u56f4"
      : `\u5f53\u524d\u4e3a${themeLabel(state.theme)}\u4e3b\u9898`,
  );
  renderDates();
  syncTheme();
}

function renderDates() {
  elements.dateList.innerHTML = "";
  state.forecast.days.forEach((day, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `date-button interactive${index === state.selectedIndex ? " active" : ""}`;
    button.innerHTML = `<strong>${day.label}</strong><span>${day.temperatureRange}</span>`;
    button.addEventListener("click", () => {
      state.selectedIndex = index;
      renderWeather();
    });
    elements.dateList.appendChild(button);
  });
}

function renderRecentCities() {
  const cities = getRecentCities();
  elements.recentCities.innerHTML = "";
  if (!cities.length) {
    const empty = document.createElement("span");
    empty.className = "city-tag";
    empty.textContent = "\u8fd8\u6ca1\u6709\u6700\u8fd1\u57ce\u5e02";
    elements.recentCities.appendChild(empty);
    return;
  }

  cities.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-tag interactive";
    button.textContent = city.name;
    button.addEventListener("click", () => {
      void handleCityChange(city);
      closeCityDialog();
    });
    elements.recentCities.appendChild(button);
  });
}

function renderCityResults(items) {
  elements.cityResults.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "city-result";
    empty.innerHTML =
      "<strong>\u6ca1\u6709\u627e\u5230\u5339\u914d\u57ce\u5e02</strong><span>\u53ef\u4ee5\u8bd5\u8bd5\u66f4\u5b8c\u6574\u7684\u5173\u952e\u8bcd</span>";
    elements.cityResults.appendChild(empty);
    return;
  }

  items.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-result interactive";
    button.innerHTML = `<strong>${city.name}</strong><span>${city.adm1 || city.country}</span>`;
    button.addEventListener("click", () => {
      void handleCityChange(city);
      closeCityDialog();
    });
    elements.cityResults.appendChild(button);
  });
}

function syncTheme() {
  const activeTheme = getActiveTheme();
  elements.themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === state.theme);
  });
  manager.switchTo(activeTheme);
}

function getActiveTheme() {
  const day = state.forecast?.days[state.selectedIndex];
  if (!day) {
    return "sunny";
  }
  return state.theme === "auto" ? day.effect : state.theme;
}

function themeLabel(theme) {
  const labels = {
    auto: "\u81ea\u52a8",
    sunny: "\u6674\u5929",
    cloudy: "\u591a\u4e91",
    rainy: "\u96e8\u5929",
    snowy: "\u96ea\u5929",
    foggy: "\u96fe\u5929",
    night: "\u591c\u95f4",
  };
  return labels[theme] || theme;
}

async function handleCityChange(city) {
  try {
    setStatus(`\u6b63\u5728\u5207\u6362\u5230 ${city.name}...`);
    const forecast = await getForecast(city);
    state.city = city;
    state.forecast = forecast;
    state.selectedIndex = 0;
    saveRecentCity(forecast.city);
    renderRecentCities();
    renderWeather();
  } catch {
    setStatus("\u5929\u6c14\u6570\u636e\u6682\u65f6\u65e0\u6cd5\u83b7\u53d6");
  }
}

async function handleSearch(keyword) {
  const cities = await searchCities(keyword);
  renderCityResults(cities);
}

function openCityDialog() {
  elements.cityDialog.hidden = false;
  renderRecentCities();
  void handleSearch(elements.cityInput.value.trim());
  window.setTimeout(() => elements.cityInput.focus(), 20);
}

function closeCityDialog() {
  elements.cityDialog.hidden = true;
}

function bindEvents() {
  elements.cityTrigger.addEventListener("click", openCityDialog);
  elements.cityClose.addEventListener("click", closeCityDialog);
  elements.cityBackdrop.addEventListener("click", closeCityDialog);
  elements.cityInput.addEventListener("input", (event) => {
    void handleSearch(event.target.value);
  });

  elements.themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = button.dataset.theme;
      setThemePreference(state.theme);
      renderWeather();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.cityDialog.hidden) {
      closeCityDialog();
    }
  });
}

async function bootstrap() {
  bindEvents();
  renderRecentCities();
  renderCityResults(getRecentCities());

  const historyCity = getRecentCities()[0];
  if (historyCity) {
    await handleCityChange(historyCity);
    setStatus("\u5df2\u6062\u590d\u4e0a\u6b21\u6d4f\u89c8\u7684\u57ce\u5e02");
    return;
  }

  try {
    const position = await getCurrentPosition();
    const city = await resolveCurrentCity(position);
    setLocatedFlag(true);
    await handleCityChange(city);
    setStatus("\u5df2\u6839\u636e\u5f53\u524d\u4f4d\u7f6e\u540c\u6b65\u5929\u6c14");
  } catch {
    setLocatedFlag(false);
    await handleCityChange(getDefaultCity());
    setStatus("\u65e0\u6cd5\u83b7\u53d6\u4f4d\u7f6e\uff0c\u5df2\u5207\u6362\u4e3a\u5317\u4eac");
  }
}

void bootstrap();
