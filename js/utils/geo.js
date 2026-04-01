const BEIJING = {
  id: "101010100",
  name: "北京",
  adm1: "北京市",
  country: "中国",
  lat: 39.9042,
  lon: 116.4074,
};

export function getDefaultCity() {
  return BEIJING;
}

export function getCurrentPosition(options = {}) {
  if (!navigator.geolocation) {
    return Promise.reject(new Error("当前浏览器不支持定位"));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 1000 * 60 * 10,
      timeout: 5000,
      ...options,
    });
  });
}
