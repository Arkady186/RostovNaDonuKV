/* ============================================================
   КВАДРАТ — UI helpers: шапка, футер, планировки, модалки
   ============================================================ */

const UI = (() => {
  /* ---------- Базовые хелперы ---------- */

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* Плитка выбора ЖК: вся карточка кликабельна */
  function complexTile(c, dev, opts) {
    const featured = !!(opts && opts.featured);
    const fav = Store.isFavorite('complexes', c.id);
    const meta = [dev ? dev.name : '', c.class ? c.class : ''].filter(Boolean).join(' · ');
    const href = 'complex.html?slug=' + encodeURIComponent(c.slug);
    return `
      <article class="cx-tile ${featured ? 'cx-tile--featured' : ''}">
        <a class="cx-tile__link" href="${href}" aria-label="Выбрать ЖК «${escapeHtml(c.name)}»">
          <span class="cx-tile__media">
            <img src="${escapeHtml(c.image)}" alt="ЖК «${escapeHtml(c.name)}»" loading="lazy">
            <span class="cx-tile__credit">${c.imageKind === 'official' ? 'Фото: сайт застройщика' : 'Иллюстрация'}</span>
            ${c.priority ? '<span class="cx-tile__badge">Популярный выбор</span>' : ''}
          </span>
          <span class="cx-tile__body">
            <span class="cx-tile__meta">${escapeHtml(meta)}</span>
            <span class="cx-tile__name">${escapeHtml(c.name)}</span>
            <span class="cx-tile__addr">${escapeHtml(c.address || '')}</span>
            <span class="cx-tile__go">Выбрать ЖК <span aria-hidden="true">→</span></span>
          </span>
        </a>
        <button class="card__fav cx-tile__fav ${fav ? 'is-active' : ''}" data-fav="complexes" data-id="${escapeHtml(c.id)}" aria-label="В избранное">♡</button>
      </article>`;
  }

  function formatNumber(n) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n || 0));
  }

  function formatMoney(n) {
    return formatNumber(n) + ' ₽';
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  /* ---------- Тост ---------- */

  let toastTimer = null;

  function toast(message) {
    let el = qs('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    requestAnimationFrame(() => el.classList.add('toast--show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('toast--show'), 2600);
  }

  /* ---------- Шапка ---------- */

  const NAV_ITEMS = [
    { key: 'catalog', href: 'complexes.html', label: 'Каталог' },
    { key: 'designs', href: 'designs.html', label: 'Дизайн-проекты' },
    { key: 'how-it-works', href: 'how-it-works.html', label: 'Как это работает' },
    { key: 'reviews', href: 'reviews.html', label: 'Отзывы' },
  ];

  const ACTIVE_GROUPS = {
    index: '',
    developers: 'catalog',
    developer: 'catalog',
    complexes: 'catalog',
    complex: 'catalog',
    apartments: 'catalog',
    apartment: 'catalog',
    designs: 'designs',
    design: 'designs',
    configurator: '',
    estimate: '',
    request: '',
    favorites: '',
    'how-it-works': 'how-it-works',
    about: '',
    contacts: '',
    contract: '',
    admin: '',
    reviews: 'reviews',
    login: '',
    privacy: '',
    terms: '',
  };

  function renderHeader(activeKey) {
    const mount = qs('#app-header');
    if (!mount) return;
    const catalog = Store.getCatalog();
    const cityId = Store.getCityId();
    const activeGroup = ACTIVE_GROUPS[activeKey] || '';

    const cityOptions = catalog.cities
      .map((c) => `<option value="${c.id}" ${c.id === cityId ? 'selected' : ''}>${escapeHtml(c.name)}</option>`)
      .join('');

    const navLinks = NAV_ITEMS.map(
      (item) =>
        `<a class="header__link ${activeGroup === item.key ? 'is-active' : ''}" href="${item.href}">${item.label}</a>`
    ).join('');

    mount.innerHTML = `
      <header class="header">
        <div class="container header__inner">
          <a class="logo" href="index.html" aria-label="КВАДРАТ — на главную">
            <span class="logo__mark">К</span>КВАДРАТ
          </a>
          <nav class="header__nav" id="header-nav" aria-label="Основная навигация">
            <div class="header__city">
              <label class="visually-hidden" for="header-city">Город</label>
              <select id="header-city" aria-label="Выбор города">${cityOptions}</select>
            </div>
            ${navLinks}
            <a class="header__link header__fav ${activeKey === 'favorites' ? 'is-active' : ''}" href="favorites.html">
              Избранное <span class="fav-count" id="fav-count">0</span>
            </a>
            <a class="btn btn--primary btn--sm" href="configurator.html">Подобрать ремонт</a>
            <div class="header__auth" id="auth-slot"></div>
          </nav>
          <button class="burger" id="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="header-nav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>`;

    const burger = qs('#burger');
    const nav = qs('#header-nav');
    if (burger && nav) {
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
      nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          nav.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const citySelect = qs('#header-city');
    if (citySelect) {
      citySelect.addEventListener('change', () => {
        Store.setCityId(citySelect.value);
        Store.resetConfig();
        window.location.reload();
      });
    }

    updateFavoritesBadge();
    if (typeof Auth !== 'undefined') Auth.renderSlot();
  }

  function updateFavoritesBadge() {
    const badge = qs('#fav-count');
    if (badge) badge.textContent = String(Store.favoritesCount());
  }

  /* ---------- Футер ---------- */

  function renderFooter() {
    const mount = qs('#app-footer');
    if (!mount) return;
    mount.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer__grid">
            <div>
              <a class="logo" href="index.html"><span class="logo__mark">К</span>КВАДРАТ</a>
              <p class="footer__about">
                Сервис подбора квартир в новостройках, дизайн-проектов и предварительного
                расчёта ремонта. Демонстрационный продукт.
              </p>
            </div>
            <div>
              <div class="footer__title">Каталог</div>
              <div class="footer__links">
                <a href="complexes.html">Жилые комплексы</a>
                <a href="developers.html">Застройщики</a>
                <a href="designs.html">Дизайн-проекты</a>
                <a href="configurator.html">Конфигуратор</a>
              </div>
            </div>
            <div>
              <div class="footer__title">Сервис</div>
              <div class="footer__links">
                <a href="how-it-works.html">Как это работает</a>
                <a href="favorites.html">Избранное</a>
                <a href="estimate.html">Моя смета</a>
                <a href="reviews.html">Отзывы</a>
                <a href="about.html">О проекте</a>
                <a href="contacts.html">Контакты</a>
              </div>
            </div>
            <div>
              <div class="footer__title">Контакты</div>
              <div class="footer__links">
                <a href="tel:${BRAND.contacts.phone.replace(/[^+\d]/g, '')}">${escapeHtml(BRAND.contacts.phone)}</a>
                <a href="mailto:${escapeHtml(BRAND.contacts.email)}">${escapeHtml(BRAND.contacts.email)}</a>
                <span>${escapeHtml(BRAND.contacts.address)}</span>
                <span>${escapeHtml(BRAND.contacts.hours)}</span>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <span>© ${new Date().getFullYear()} КВАДРАТ. Демонстрационный продукт.</span>
            <span class="footer__legal">
              <a href="privacy.html">Политика обработки персональных данных</a>
              <a href="terms.html">Пользовательское соглашение</a>
            </span>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- Fallback изображений ---------- */

  const FALLBACK_SVG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#F2ECE2"/>
        <rect x="360" y="250" width="80" height="80" rx="16" fill="#D8C8B2"/>
        <text x="400" y="305" text-anchor="middle" font-family="Manrope, sans-serif" font-size="40" font-weight="700" fill="#242722">К</text>
        <text x="400" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#777970">КВАДРАТ</text>
      </svg>`
    );

  function initImageFallback() {
    document.addEventListener(
      'error',
      (e) => {
        const t = e.target;
        if (t && t.tagName === 'IMG' && !t.dataset.fbk) {
          t.dataset.fbk = '1';
          t.src = FALLBACK_SVG;
        }
      },
      true
    );
  }

  /* ---------- Планировка (SVG) ---------- */

  function renderPlan(apartment, container) {
    if (!container) return;
    const layout = PLAN_LAYOUTS[apartment.type] || PLAN_LAYOUTS.one;
    const typeLabel = (APARTMENT_TYPES[apartment.type] || {}).label || 'Квартира';

    let svg = `<svg viewBox="0 0 100 100" role="img" aria-label="Демонстрационная планировка: ${typeLabel}">
      <rect x="0" y="0" width="100" height="100" fill="#F7F5F0"/>`;

    layout.forEach((room, i) => {
      const fill = i % 2 === 0 ? '#FFFFFF' : '#F2ECE2';
      const cx = room.x + room.w / 2;
      const cy = room.y + room.h / 2;
      svg += `<rect x="${room.x}" y="${room.y}" width="${room.w}" height="${room.h}" fill="${fill}" stroke="#242722" stroke-width="0.7"/>`;
      svg += `<text x="${cx}" y="${cy - 1.5}" text-anchor="middle" font-size="4" font-family="Manrope, sans-serif" font-weight="600" fill="#242722">${escapeHtml(room.label)}</text>`;
      svg += `<text x="${cx}" y="${cy + 4.5}" text-anchor="middle" font-size="3.2" font-family="Inter, sans-serif" fill="#777970">${room.area} м²</text>`;
    });

    svg += `</svg>`;

    container.innerHTML =
      `<div class="plan-wrap">${svg}<p class="plan-note">Демонстрационная планировка · ${typeLabel} · ${apartment.area} м²</p></div>`;
  }

  /* ---------- Хлебные крошки ---------- */

  function breadcrumbs(items) {
    const parts = items
      .map((item, i) => {
        const isLast = i === items.length - 1;
        if (isLast || !item.href) {
          return `<span class="crumbs__current">${escapeHtml(item.label)}</span>`;
        }
        return `<a href="${item.href}">${escapeHtml(item.label)}</a><span class="crumbs__sep">/</span>`;
      })
      .join('');
    return `<nav class="crumbs" aria-label="Хлебные крошки">${parts}</nav>`;
  }

  /* ---------- Пустое состояние ---------- */

  function emptyState(title, text, actionHtml) {
    return (
      `<div class="empty-state">
        <div class="empty-state__icon" aria-hidden="true">◇</div>
        <div class="empty-state__title">${escapeHtml(title)}</div>
        <p class="empty-state__text">${escapeHtml(text)}</p>
        ${actionHtml || ''}
      </div>`
    );
  }

  /* ---------- Модальное окно ---------- */

  function modal(html, { title = '' } = {}) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        ${title ? `<div class="modal-card__title">${escapeHtml(title)}</div>` : ''}
        ${html}
      </div>`;
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('is-open'));

    function close() {
      backdrop.classList.remove('is-open');
      setTimeout(() => backdrop.remove(), 250);
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', onKey);
      }
    });

    return { close, el: backdrop };
  }

  function confirmDialog(message, { confirmText = 'Удалить', danger = true } = {}) {
    return new Promise((resolve) => {
      const m = modal(
        `<p style="color:var(--text-2);line-height:1.6">${escapeHtml(message)}</p>
         <div class="modal-card__actions">
           <button class="btn btn--secondary" data-act="cancel">Отмена</button>
           <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-act="ok">${escapeHtml(confirmText)}</button>
         </div>`,
        { title: 'Подтверждение' }
      );
      m.el.querySelector('[data-act="cancel"]').addEventListener('click', () => {
        m.close();
        resolve(false);
      });
      m.el.querySelector('[data-act="ok"]').addEventListener('click', () => {
        m.close();
        resolve(true);
      });
    });
  }

  /* ---------- Общая инициализация ---------- */

  function initCommon(activeKey) {
    renderHeader(activeKey);
    renderFooter();
    initImageFallback();
    updateFavoritesBadge();
  }

  return {
    qs,
    qsa,
    escapeHtml,
    complexTile,
    formatNumber,
    formatMoney,
    getParam,
    toast,
    renderHeader,
    renderFooter,
    updateFavoritesBadge,
    renderPlan,
    breadcrumbs,
    emptyState,
    modal,
    confirmDialog,
    initCommon,
  };
})();
