/* КВАДРАТ — главная страница: каталог списком, шаги, дизайны, FAQ, анимации */
document.addEventListener('DOMContentLoaded', () => {
  const esc = UI.escapeHtml;
  const catalog = Store.getCatalog();
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Бегущая строка ---------- */
  const words = ['Дизайн-проекты', 'Смета за 4 шага', 'Реальные ЖК Ростова', 'Подбор комплектации', 'Ремонт под ключ', 'Прозрачные расчёты'];
  const group = words.map((w) => `<span>${w}</span><span class="s">✦</span>`).join('');
  document.getElementById('h-marquee').innerHTML =
    `<div class="h-marquee__group">${group}</div><div class="h-marquee__group">${group}</div>`;

  /* ---------- Шаги ---------- */
  const icons = [
    '<path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6"/>',
    '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 0 0 3-3A9 9 0 0 0 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="16" cy="8.5" r="1"/>',
    '<path d="M4 7h16M4 12h16M4 17h10"/><circle cx="18" cy="17" r="2"/>',
    '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"/>',
  ];
  const steps = [
    ['01', 'Выберите квартиру', 'ЖК, планировка и площадь — основа всего расчёта.'],
    ['02', 'Подберите дизайн', 'Стиль, палитра и материалы под ваш образ жизни.'],
    ['03', 'Соберите комплектацию', 'Комплектация, материалы, кухня и опции.'],
    ['04', 'Получите смету', 'Прозрачная разбивка и ориентировочные сроки.'],
  ];
  document.getElementById('h-steps').innerHTML = steps
    .map((s, i) => `
      <article class="h-step" data-reveal style="--i:${i}">
        <div class="h-step__n">${s[0]}</div>
        <div class="h-step__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[i]}</svg></div>
        <h3>${s[1]}</h3>
        <p>${s[2]}</p>
      </article>`)
    .join('');

  /* ---------- Октябрь Парк ---------- */
  const op = catalog.complexes.find((c) => c.slug === 'oktyabr-park' && c.published);
  const opSec = document.getElementById('oktyabr-park');
  if (op) document.getElementById('op-img').src = op.image;
  else if (opSec) opSec.hidden = true;

  /* ---------- Дизайн-проекты ---------- */
  const designs = catalog.designs.filter((d) => d.published).slice(0, 3);
  const dgrid = document.getElementById('h-designs');
  if (designs.length) {
    dgrid.innerHTML = designs
      .map((d) => `
        <a class="h-dcard" href="design.html?slug=${encodeURIComponent(d.slug)}">
          <img src="${esc(d.image)}" alt="${esc(d.name)}" loading="lazy">
          <div class="h-dcard__top"><span class="h-dcard__tag">${esc(d.style)}</span></div>
          <div class="h-dcard__body">
            <div class="h-dcard__name">${esc(d.name)}</div>
            <div class="h-dcard__row">
              <span class="h-pal">${(d.palette || []).map((p) => `<i style="background:${esc(p)}"></i>`).join('')}</span>
              <span class="h-dcard__lvl">Бюджет: ${esc(d.priceLevel)}</span>
              <span class="h-dcard__go">${ARROW}</span>
            </div>
          </div>
        </a>`)
      .join('');
  } else {
    document.getElementById('designs').hidden = true;
  }

  /* ---------- Типы квартир (чипы) ---------- */
  const typeCards = [['studio', 'от 25 м²'], ['one', 'от 36 м²'], ['euro-two', 'от 42 м²'], ['two', 'от 55 м²'], ['three', 'от 68 м²']];
  document.getElementById('h-types').innerHTML = typeCards
    .map(([t, a]) => `<a href="complexes.html">${esc(APARTMENT_TYPES[t].label)} <small>${a}</small></a>`)
    .join('');

  /* ---------- Каталог: город → застройщики → ЖК ---------- */
  const cities = catalog.cities.filter((c) => catalog.complexes.some((x) => x.cityId === c.id && x.published));
  const root = document.getElementById('h-catalog');
  const plural = (n, a, b, c) => {
    const m = n % 100, k = n % 10;
    return m > 10 && m < 20 ? c : k === 1 ? a : k > 1 && k < 5 ? b : c;
  };
  let html = '';
  if (cities.length) {
    html += `<nav class="h-citynav" aria-label="Город" data-reveal><span>Город</span>${cities
      .map((c) => {
        const n = catalog.complexes.filter((x) => x.cityId === c.id && x.published).length;
        return `<a href="#city-${esc(c.slug)}">${esc(c.name)} <small>${n}</small></a>`;
      })
      .join('')}</nav>`;
  }
  cities.forEach((city) => {
    const devs = catalog.developers.filter((d) => d.cityId === city.id && d.published);
    const total = catalog.complexes.filter((x) => x.cityId === city.id && x.published).length;
    html += `<div class="h-city" id="city-${esc(city.slug)}">
      <div class="h-city__head" data-reveal><h3 class="h-city__name">${esc(city.name)}</h3>
      <span class="h-city__count">${devs.length} ${plural(devs.length, 'застройщик', 'застройщика', 'застройщиков')} · ${total} ${plural(total, 'жилой комплекс', 'жилых комплекса', 'жилых комплексов')}</span></div>`;
    devs.forEach((dev) => {
      const cxs = catalog.complexes
        .filter((c) => c.developerId === dev.id && c.cityId === city.id && c.published)
        .sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
      if (!cxs.length) return;
      html += `<div class="h-dev" data-reveal>
        <div class="h-dev__id">
          <div class="h-dev__logo">${esc(dev.logoText || dev.name.slice(0, 3))}</div>
          <h4 class="h-dev__name">${esc(dev.name)}</h4>
          <div class="h-dev__meta">${cxs.length} ${plural(cxs.length, 'жилой комплекс', 'жилых комплекса', 'жилых комплексов')}</div>
          <p class="h-dev__desc">${esc(dev.description || '')}</p>
          <a class="h-dev__more" href="developer.html?slug=${encodeURIComponent(dev.slug)}">О застройщике ${ARROW}</a>
        </div>
        <div class="h-cx">${cxs
          .map((c) => `
          <a href="complex.html?slug=${encodeURIComponent(c.slug)}" aria-label="Выбрать ЖК «${esc(c.name)}»">
            <span class="h-cx__img"><img src="${esc(c.image)}" alt="" loading="lazy"></span>
            <span>
              <span class="h-cx__name">${esc(c.name)}</span>
              <span class="h-cx__addr">${esc(c.address || '')}</span>
              <span class="h-cx__tags">${c.priority ? '<span class="pop">★ Популярный выбор</span>' : ''}${c.class ? `<span>${esc(c.class)}</span>` : ''}</span>
            </span>
            <span class="h-cx__go">${ARROW}</span>
          </a>`)
          .join('')}</div>
      </div>`;
    });
    html += '</div>';
  });
  root.innerHTML = html || '<p>Каталог пока пуст.</p>';

  /* ---------- FAQ ---------- */
  const faq = [
    ['Что такое КВАДРАТ?', 'Это демонстрационный сервис, который помогает пройти путь от выбора новостройки до предварительного расчёта ремонта: город, застройщик, жилой комплекс, квартира, дизайн-проект, комплектация и смета.'],
    ['Насколько точна предварительная смета?', 'Смета рассчитывается по демонстрационной модели и носит информационный характер. Финальная стоимость и сроки определяются после уточнения параметров объекта и согласования состава работ.'],
    ['Это официальный сайт застройщика?', 'Нет. КВАДРАТ — независимый сервис. Данные о жилых комплексах, планировках и ценах приведены в демонстрационных целях и не являются официальными характеристиками.'],
    ['Можно ли изменить выбор после расчёта?', 'Да. Конфигуратор позволяет вернуться на любой шаг и изменить квартиру, дизайн, комплектацию, материалы или опции — смета пересчитается автоматически.'],
    ['Как оформить заявку?', 'Заполните форму на странице заявки: имя, телефон и согласие на обработку данных. В демонстрационной версии заявка сохраняется локально, отправка на сервер не подключена.'],
  ];
  document.getElementById('home-faq').innerHTML = faq
    .map(([q, a], i) => `
      <div class="accordion__item">
        <button class="accordion__head" aria-expanded="false" aria-controls="faq-body-${i}">${q}<span class="accordion__icon" aria-hidden="true">+</span></button>
        <div class="accordion__body" id="faq-body-${i}"><div class="accordion__body-inner">${a}</div></div>
      </div>`)
    .join('');
  UI.qsa('.accordion__head').forEach((head) => {
    head.addEventListener('click', () => {
      const item = head.closest('.accordion__item');
      const body = item.querySelector('.accordion__body');
      const open = item.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    });
  });

  /* ---------- Реальные цифры в статистике ---------- */
  const pubCx = catalog.complexes.filter((c) => c.published).length;
  const pubDev = catalog.developers.filter((d) => d.published).length;
  const pubDs = catalog.designs.filter((d) => d.published).length;
  const counts = document.querySelectorAll('[data-count]');
  [pubCx, pubDev, pubDs].forEach((n, i) => { if (counts[i]) counts[i].dataset.count = n; });

  /* ---------- Анимации при прокрутке ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animated = document.querySelectorAll('[data-reveal], #h-est, .h-tile, .h-hero__title');
  const countUp = (el) => {
    const to = +el.dataset.count || 0;
    if (reduce || !to) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    animated.forEach((el) => io.observe(el));
  } else {
    animated.forEach((el) => el.classList.add('is-in'));
    counts.forEach(countUp);
  }

  /* ---------- Лёгкий параллакс главного фото ---------- */
  const heroImg = document.getElementById('h-hero-img');
  if (heroImg && !reduce) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        heroImg.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Избранное ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    const added = Store.toggleFavorite(btn.dataset.fav, btn.dataset.id);
    btn.classList.toggle('is-active', added);
    UI.updateFavoritesBadge();
    UI.toast(added ? 'Добавлено в избранное' : 'Удалено из избранного');
  });
});
