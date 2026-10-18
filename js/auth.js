/* ============================================================
   КВАДРАТ — Auth: вход, регистрация, избранное на сервере,
   учёт этапа пути пользователя (для менеджеров).

   В браузере хранится только: имя и роль (для отрисовки шапки)
   и избранное самого пользователя. Пароль и данные других людей
   в браузер не попадают. Настоящая проверка входа — на сервере
   (HttpOnly-cookie, которую JavaScript прочитать не может).
   ============================================================ */

const Auth = (() => {
  const KEY = 'kvadrat:auth';
  const FAV_KEY = 'kvadrat:favorites';
  let user = null;
  let loaded = false;
  let serverDown = false;

  function cached() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function setCache(u) {
    try {
      if (u) localStorage.setItem(KEY, JSON.stringify({ id: u.id, name: u.name, phone: u.phone, role: u.role }));
      else localStorage.removeItem(KEY);
    } catch (e) { /* ignore */ }
  }
  function setFavCache(f) {
    try {
      if (f) localStorage.setItem(FAV_KEY, JSON.stringify(f));
      else localStorage.removeItem(FAV_KEY);
    } catch (e) { /* ignore */ }
  }

  function current() { return loaded ? user : cached(); }
  function isLoggedIn() { return !!current(); }
  function isStaff() { const u = current(); return !!u && (u.role === 'admin' || u.role === 'manager'); }

  async function api(method, url, body) {
    let res;
    try {
      res = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'kvadrat' },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      const err = new Error('Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз.');
      err.network = true;
      throw err;
    }
    let data = {};
    try { data = await res.json(); } catch (e) { /* не JSON */ }
    if (!res.ok || data.ok === false) {
      const err = new Error(data.error || 'Ошибка сервера (' + res.status + ')');
      err.status = res.status;
      throw err;
    }
    return data;
  }

  /* ---------- Шапка ---------- */

  function esc(s) { return typeof UI !== 'undefined' ? UI.escapeHtml(s) : String(s); }

  function currentPath() {
    const f = location.pathname.split('/').pop() || 'index.html';
    return f + location.search;
  }

  function renderSlot() {
    const slot = document.getElementById('auth-slot');
    if (!slot) return;
    const u = current();
    if (!u) {
      slot.innerHTML = `<a class="btn btn--secondary btn--sm" href="login.html?next=${encodeURIComponent(currentPath())}">Войти</a>`;
      return;
    }
    const initial = (u.name || '?').trim().charAt(0).toUpperCase();
    const staff = u.role === 'admin' || u.role === 'manager';
    slot.innerHTML = `
      <div class="auth-chip">
        <button class="auth-chip__btn" type="button" aria-haspopup="true" aria-expanded="false" id="auth-chip-btn">
          <span class="auth-chip__avatar" aria-hidden="true">${esc(initial)}</span>
          <span class="auth-chip__name">${esc((u.name || '').split(' ')[0])}</span>
        </button>
        <div class="auth-menu" id="auth-menu" hidden>
          <a href="favorites.html">Избранное</a>
          <a href="reviews.html">Оставить отзыв</a>
          ${staff ? '<a href="admin.html">Админ-панель</a>' : ''}
          <button type="button" id="auth-logout">Выйти</button>
        </div>
      </div>`;
    const btn = document.getElementById('auth-chip-btn');
    const menu = document.getElementById('auth-menu');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); });
    document.getElementById('auth-logout').addEventListener('click', logout);
  }

  function syncHearts() {
    if (typeof Store === 'undefined') return;
    document.querySelectorAll('[data-fav]').forEach((b) => {
      b.classList.toggle('is-active', Store.isFavorite(b.dataset.fav, b.dataset.id));
    });
    if (typeof UI !== 'undefined') UI.updateFavoritesBadge();
  }

  /* ---------- Состояние ---------- */

  async function init() {
    try {
      const r = await api('GET', '/api/me');
      user = r.user;
      serverDown = false;
    } catch (e) {
      user = null;
      serverDown = !!e.network;
    }
    loaded = true;
    setCache(user);
    setFavCache(user ? user.favorites : null);
    renderSlot();
    syncHearts();
    document.dispatchEvent(new CustomEvent('auth:ready', { detail: { user, serverDown } }));
    if (user && user.mustChange && !/login\.html$/.test(location.pathname)) {
      location.href = 'login.html?change=1';
      return;
    }
    if (user) trackPage();
  }

  async function logout() {
    try { await api('POST', '/api/logout'); } catch (e) { /* ignore */ }
    user = null;
    setCache(null);
    setFavCache(null);
    location.href = 'index.html';
  }

  async function login(phone, password) {
    const r = await api('POST', '/api/login', { phone, password });
    user = r.user; loaded = true;
    setCache(user); setFavCache(user.favorites);
    return user;
  }
  async function register(data) {
    const r = await api('POST', '/api/register', data);
    user = r.user; loaded = true;
    setCache(user); setFavCache(user.favorites);
    return user;
  }

  /* ---------- Приглашение войти ---------- */

  function promptLogin(message) {
    if (typeof UI === 'undefined') { location.href = 'login.html'; return; }
    const next = encodeURIComponent(currentPath());
    const m = UI.modal(
      `<p style="color:var(--text-2);line-height:1.6">${esc(message || 'Войдите в аккаунт, чтобы продолжить.')}</p>
       <div class="modal-card__actions">
         <button class="btn btn--ghost" data-act="later">Позже</button>
         <a class="btn btn--secondary" href="login.html?next=${next}#register">Регистрация</a>
         <a class="btn btn--primary" href="login.html?next=${next}">Войти</a>
       </div>`,
      { title: 'Нужен вход' }
    );
    m.el.querySelector('[data-act="later"]').addEventListener('click', m.close);
  }

  /* Сердечко без входа: просим авторизоваться (перехват до обработчиков страниц) */
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-fav]');
    if (!b || isLoggedIn()) return;
    e.preventDefault();
    e.stopPropagation();
    promptLogin('Войдите, чтобы сохранять жилые комплексы и дизайны в избранное.');
  }, true);

  /* ---------- Избранное на сервере ---------- */

  let favTimer = null;
  function pushFavorites(fav) {
    clearTimeout(favTimer);
    favTimer = setTimeout(() => {
      api('POST', '/api/favorites', { favorites: fav }).catch((e) => {
        if (e.status === 401) {
          user = null; setCache(null); setFavCache(null); renderSlot();
          promptLogin('Сессия закончилась. Войдите снова, чтобы сохранить избранное.');
        }
      });
    }, 400);
  }

  /* ---------- Учёт пути пользователя ---------- */

  function trackPage() {
    if (!user) return;
    const page = window.PAGE_KEY || '';
    if (!page || ['login', 'admin', 'privacy', 'terms'].includes(page)) return;
    api('POST', '/api/track', { type: 'page', page, label: (document.title || '').replace(/\s*[—-]\s*КВАДРАТ\s*$/, '').slice(0, 100) }).catch(() => {});
  }

  let cfgTimer = null;
  function trackConfig(cfg) {
    if (!user || !cfg) return;
    clearTimeout(cfgTimer);
    cfgTimer = setTimeout(() => {
      try {
        const cat = Store.getCatalog();
        const complex = cat.complexes.find((c) => c.id === cfg.complexId);
        const design = cat.designs.find((d) => d.id === cfg.designId);
        const pkg = cat.packages.find((p) => p.id === cfg.packageId);
        const kitchen = cat.kitchens.find((k) => k.id === cfg.kitchenId);
        let est = null;
        try { est = Estimate.calculate(cfg); } catch (e) { /* нет данных для расчёта */ }
        const area = cfg.apartmentId === 'custom-area' ? Number(cfg.customArea) : (est ? est.area : null);
        api('POST', '/api/track', {
          type: 'config', step: cfg.step,
          complex: complex ? complex.name : '', design: design ? design.name : '',
          pkg: pkg ? pkg.name : '', kitchen: kitchen ? kitchen.name : '',
          area: area || undefined, total: est ? est.total : undefined,
          options: (cfg.options || []).length,
        }).catch(() => {});
      } catch (e) { /* не мешаем работе сайта */ }
    }, 700);
  }

  async function sendRequest(payload) {
    return api('POST', '/api/request', payload);
  }

  return {
    init, api, login, register, logout, renderSlot, promptLogin,
    isLoggedIn, isStaff, current, pushFavorites, trackConfig, sendRequest,
    get serverDown() { return serverDown; },
  };
})();
