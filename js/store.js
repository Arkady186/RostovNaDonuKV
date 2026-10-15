/* ============================================================
   КВАДРАТ — StorageService
   Единый слой доступа к данным. Все операции с localStorage
   изолированы здесь, чтобы позже заменить на реальный API.
   ============================================================ */

const Store = (() => {
  const PREFIX = 'kvadrat:';

  const KEYS = {
    city: PREFIX + 'city',
    config: PREFIX + 'config',
    favorites: PREFIX + 'favorites',
    requests: PREFIX + 'requests',
    catalog: PREFIX + 'catalog',
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[KVADRAT] Повреждённые данные в localStorage:', key, e);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[KVADRAT] Не удалось сохранить данные:', key, e);
    }
  }

  /* ---------- Каталог (демо-изменения из админки) ---------- */

  function defaultCatalog() {
    return {
      schemaVersion: KVADRAT_SCHEMA_VERSION,
      cities: DEFAULT_CITIES,
      developers: DEFAULT_DEVELOPERS,
      complexes: DEFAULT_COMPLEXES,
      apartments: DEFAULT_APARTMENTS,
      designs: DEFAULT_DESIGNS,
      packages: DEFAULT_PACKAGES,
      materials: DEFAULT_MATERIALS,
      kitchens: DEFAULT_KITCHENS,
      options: DEFAULT_OPTIONS,
    };
  }

  function getCatalog() {
    const stored = read(KEYS.catalog, null);
    if (
      stored &&
      stored.schemaVersion === KVADRAT_SCHEMA_VERSION &&
      Array.isArray(stored.complexes) &&
      Array.isArray(stored.developers)
    ) {
      return stored;
    }
    return defaultCatalog();
  }

  function saveCatalog(catalog) {
    write(KEYS.catalog, { ...catalog, schemaVersion: KVADRAT_SCHEMA_VERSION });
  }

  function resetCatalog() {
    localStorage.removeItem(KEYS.catalog);
  }

  /* ---------- Город ---------- */

  function getCityId() {
    const stored = read(KEYS.city, null);
    const catalog = getCatalog();
    const valid = catalog.cities.some((c) => c.id === stored);
    return valid ? stored : BRAND.cityDefault;
  }

  function setCityId(id) {
    write(KEYS.city, id);
  }

  /* ---------- Конфигурация выбора ---------- */

  function defaultConfig() {
    return {
      cityId: getCityId(),
      complexId: null,
      apartmentId: null,
      designId: null,
      packageId: null,
      materials: {},
      kitchenId: null,
      options: [],
      step: 1,
    };
  }

  function getConfig() {
    const cfg = read(KEYS.config, null);
    if (!cfg || typeof cfg !== 'object') return defaultConfig();
    return {
      ...defaultConfig(),
      ...cfg,
      materials: cfg.materials && typeof cfg.materials === 'object' ? cfg.materials : {},
      options: Array.isArray(cfg.options) ? cfg.options : [],
    };
  }

  function saveConfig(patch) {
    const next = { ...getConfig(), ...patch };
    write(KEYS.config, next);
    return next;
  }

  function resetConfig() {
    localStorage.removeItem(KEYS.config);
  }

  /* ---------- Избранное ---------- */

  function defaultFavorites() {
    return { complexes: [], apartments: [], designs: [] };
  }

  function getFavorites() {
    const fav = read(KEYS.favorites, null);
    if (!fav || typeof fav !== 'object') return defaultFavorites();
    return {
      complexes: Array.isArray(fav.complexes) ? fav.complexes : [],
      apartments: Array.isArray(fav.apartments) ? fav.apartments : [],
      designs: Array.isArray(fav.designs) ? fav.designs : [],
    };
  }

  function isFavorite(type, id) {
    return getFavorites()[type].includes(id);
  }

  function toggleFavorite(type, id) {
    const fav = getFavorites();
    const list = fav[type];
    const idx = list.indexOf(id);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(id);
    }
    write(KEYS.favorites, fav);
    return idx < 0;
  }

  function favoritesCount() {
    const fav = getFavorites();
    return fav.complexes.length + fav.apartments.length + fav.designs.length;
  }

  /* ---------- Заявки ---------- */

  function getRequests() {
    const list = read(KEYS.requests, []);
    return Array.isArray(list) ? list : [];
  }

  function addRequest(request) {
    const list = getRequests();
    const item = {
      id: 'req-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      ...request,
    };
    list.unshift(item);
    write(KEYS.requests, list);
    return item;
  }

  function removeRequest(id) {
    const list = getRequests().filter((r) => r.id !== id);
    write(KEYS.requests, list);
  }

  return {
    getCatalog,
    saveCatalog,
    resetCatalog,
    getCityId,
    setCityId,
    getConfig,
    saveConfig,
    resetConfig,
    getFavorites,
    isFavorite,
    toggleFavorite,
    favoritesCount,
    getRequests,
    addRequest,
    removeRequest,
  };
})();
