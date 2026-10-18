'use strict';
/* ============================================================
   КВАДРАТ — сервер: статика + API (вход, избранное, CRM, отзывы)
   Без внешних зависимостей. Нужен Node.js 18+.

   Запуск:           node server.js
   Сброс админа:     node server.js reset-admin +79001234567 НовыйПароль1
   Переменные:       PORT (3000), HOST (127.0.0.1), DATA_DIR (./data),
                     ADMIN_PHONE / ADMIN_PASSWORD (первый админ),
                     TRUST_PROXY=1 (если сайт за nginx/Caddy с HTTPS),
                     COOKIE_SECURE=1 (всегда ставить флаг Secure)

   Безопасность:
   - пароли хранятся только как scrypt-хеш с солью;
   - сессия — случайный токен в HttpOnly-cookie (JS его не видит), в базе лежит
     только его SHA-256;
   - данные клиентов отдаются только сотрудникам после входа; проверка роли на сервере;
   - файл базы (data/) недоступен по HTTP; страницы админки отдаются только сотрудникам;
   - лимиты на вход/регистрацию, проверка Origin, ограничение размера запросов.
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
const COOKIE_SECURE = process.env.COOKIE_SECURE === '1';
const DOCS_VERSION = '2026-10-18';

const STEP_NAMES = ['Квартира', 'Дизайн', 'Комплектация', 'Материалы', 'Кухня', 'Опции', 'Итог', 'Смета'];
const CALL_STATUSES = ['new', 'called', 'no_answer', 'callback', 'interested', 'won', 'lost'];

/* ---------- База (JSON-файл, запись атомарная) ---------- */

let db = { users: [], sessions: [], reviews: [], audit: [], meta: { created: Date.now() } };

function loadDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
  if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    db.users = db.users || [];
    db.sessions = db.sessions || [];
    db.reviews = db.reviews || [];
    db.audit = db.audit || [];
  }
}

let saveTimer = null;
function saveDb(now) {
  const run = () => {
    saveTimer = null;
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db), { mode: 0o600 });
    fs.renameSync(tmp, DB_FILE);
  };
  if (now) { if (saveTimer) clearTimeout(saveTimer); return run(); }
  if (!saveTimer) saveTimer = setTimeout(run, 250);
}
process.on('SIGINT', () => { saveDb(true); process.exit(0); });
process.on('SIGTERM', () => { saveDb(true); process.exit(0); });

/* ---------- Утилиты ---------- */

const uid = () => crypto.randomBytes(9).toString('base64url');
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const now = () => Date.now();
const clip = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);

function normPhone(s) {
  let d = String(s || '').replace(/\D/g, '');
  if (d.length === 11 && (d[0] === '8' || d[0] === '7')) d = '7' + d.slice(1);
  else if (d.length === 10 && d[0] === '9') d = '7' + d;
  else return null;
  return /^79\d{9}$/.test(d) ? '+' + d : null;
}

function scryptAsync(pw, salt) {
  return new Promise((res, rej) =>
    crypto.scrypt(pw, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? rej(e) : res(k)))
  );
}
async function hashPw(pw) {
  const salt = crypto.randomBytes(16);
  const h = await scryptAsync(pw, salt);
  return { salt: salt.toString('hex'), hash: h.toString('hex') };
}
async function checkPw(pw, rec) {
  const h = await scryptAsync(pw, Buffer.from(rec.salt, 'hex'));
  const b = Buffer.from(rec.hash, 'hex');
  return h.length === b.length && crypto.timingSafeEqual(h, b);
}
let DUMMY = null; /* чтобы вход по несуществующему номеру занимал столько же времени */
hashPw('dummy-password-1').then((r) => { DUMMY = r; });

function passwordError(pw) {
  if (typeof pw !== 'string' || pw.length < 8) return 'Пароль — минимум 8 символов';
  if (pw.length > 128) return 'Пароль слишком длинный';
  if (!/[A-Za-zА-Яа-яЁё]/.test(pw) || !/\d/.test(pw)) return 'В пароле должны быть буквы и цифры';
  return null;
}

function genPassword() {
  const al = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p = '';
  for (let i = 0; i < 12; i++) p += al[crypto.randomInt(al.length)];
  return p + crypto.randomInt(10);
}

/* Лимиты (в памяти) */
const buckets = new Map();
function limited(key, max, windowMs) {
  const t = now();
  let b = buckets.get(key);
  if (!b || b.reset < t) { b = { n: 0, reset: t + windowMs }; buckets.set(key, b); }
  b.n++;
  return b.n > max;
}
setInterval(() => { const t = now(); for (const [k, b] of buckets) if (b.reset < t) buckets.delete(k); }, 60000).unref();

function clientIp(req) {
  if (TRUST_PROXY) {
    const x = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    if (x) return x;
  }
  return req.socket.remoteAddress || '';
}
function isHttps(req) {
  return COOKIE_SECURE || (TRUST_PROXY && req.headers['x-forwarded-proto'] === 'https');
}

function audit(actor, action, target, meta) {
  db.audit.push({ t: now(), by: actor ? actor.id : null, byName: actor ? actor.name : 'система', action, target: target || null, meta: meta || null });
  if (db.audit.length > 3000) db.audit.splice(0, db.audit.length - 3000);
}

/* ---------- Ответы ---------- */

const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'same-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

function send(res, status, body, headers) {
  res.writeHead(status, { ...SEC_HEADERS, ...headers });
  res.end(body);
}
function sendJson(res, status, obj, extra) {
  send(res, status, JSON.stringify(obj), {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extra,
  });
}
const fail = (res, status, message) => sendJson(res, status, { ok: false, error: message });

function readJson(req, limit = 65536) {
  return new Promise((resolve, reject) => {
    const type = String(req.headers['content-type'] || '');
    if (!type.startsWith('application/json')) return reject(Object.assign(new Error('Ожидался JSON'), { status: 415 }));
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(Object.assign(new Error('Слишком большой запрос'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); }
      catch (e) { reject(Object.assign(new Error('Некорректный JSON'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

/* ---------- Сессии ---------- */

const COOKIE = 'kv_sid';
function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function sessionTtl(user) { return (user.role === 'client' ? 30 * 24 : 8) * 3600 * 1000; }

function startSession(req, res, user) {
  const token = crypto.randomBytes(32).toString('base64url');
  const ttl = sessionTtl(user);
  db.sessions.push({ h: sha256(token), uid: user.id, exp: now() + ttl, created: now() });
  const cookie = [`${COOKIE}=${token}`, 'HttpOnly', 'SameSite=Lax', 'Path=/', `Max-Age=${Math.floor(ttl / 1000)}`];
  if (isHttps(req)) cookie.push('Secure');
  return cookie.join('; ');
}
function clearCookie(req) {
  const c = [`${COOKIE}=`, 'HttpOnly', 'SameSite=Lax', 'Path=/', 'Max-Age=0'];
  if (isHttps(req)) c.push('Secure');
  return c.join('; ');
}
function getAuth(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  const h = sha256(token);
  const s = db.sessions.find((x) => x.h === h);
  if (!s || s.exp < now()) return null;
  const user = db.users.find((u) => u.id === s.uid);
  if (!user || !user.active) return null;
  return { user, session: s };
}
setInterval(() => {
  const t = now();
  const before = db.sessions.length;
  db.sessions = db.sessions.filter((s) => s.exp > t);
  if (db.sessions.length !== before) saveDb();
}, 3600000).unref();

/* ---------- Модель ---------- */

function publicUser(u) {
  return {
    id: u.id, name: u.name, phone: u.phone, role: u.role, mustChange: !!u.mustChange,
    favorites: u.favorites || { complexes: [], apartments: [], designs: [] },
  };
}

function funnel(u) {
  const p = u.progress || {};
  let code = 'registered';
  let text = 'Зарегистрировался и дальше не пошёл';
  let rank = 0;
  const set = (c, t, r) => { if (r > rank) { code = c; text = t; rank = r; } };
  if (p.viewedComplex) set('catalog', 'Смотрел жилые комплексы' + (p.viewedComplex ? ': ' + p.viewedComplex : ''), 1);
  if (p.maxStep) set('step' + p.maxStep, `Конфигуратор: дошёл до шага ${p.maxStep} «${STEP_NAMES[p.maxStep - 1] || ''}»`, 10 + p.maxStep);
  if (p.estimateViewed) set('estimate', 'Смотрел смету, заявку не оставил', 30);
  if (p.requestViewed) set('request_form', 'Открыл форму заявки, но не отправил', 40);
  if (u.requests && u.requests.length) set('request', 'Оставил заявку', 50);
  return { code, text, rank };
}

function clientSummary(u) {
  const p = u.progress || {};
  const f = funnel(u);
  const fav = u.favorites || {};
  return {
    id: u.id, name: u.name, phone: u.phone, createdAt: u.createdAt, lastSeen: u.lastSeen || u.createdAt,
    stage: f.text, stageCode: f.code, stageRank: f.rank,
    current: p.lastLabel ? p.lastLabel : '',
    complex: p.complex || p.viewedComplex || '', design: p.design || '', pkg: p.pkg || '',
    area: p.area || null, total: p.total || null,
    favCount: (fav.complexes || []).length + (fav.apartments || []).length + (fav.designs || []).length,
    call: u.call || { status: 'new' },
    requests: (u.requests || []).length,
    active: u.active,
  };
}

/* ---------- Валидация входных данных ---------- */

function validName(s) {
  const n = clip(s, 60);
  return n.length >= 2 && /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s.\-']*$/.test(n) ? n : null;
}
function cleanFavList(a) {
  if (!Array.isArray(a)) return [];
  return [...new Set(a.filter((x) => typeof x === 'string' && /^[\w\-]{1,64}$/.test(x)))].slice(0, 200);
}

/* ---------- API ---------- */

const STAFF = ['manager', 'admin'];

async function handleApi(req, res, pathname, query) {
  const method = req.method;
  const ip = clientIp(req);

  /* Защита от CSRF: для изменяющих запросов нужен наш заголовок и тот же Origin */
  if (method !== 'GET' && method !== 'HEAD') {
    const origin = req.headers.origin;
    if (origin) {
      let oh = '';
      try { oh = new URL(origin).host; } catch (e) { /* ignore */ }
      if (oh !== req.headers.host) return fail(res, 403, 'Запрос отклонён');
    }
    if (req.headers['x-requested-with'] !== 'kvadrat') return fail(res, 403, 'Запрос отклонён');
  }

  const auth = getAuth(req);
  const me = auth ? auth.user : null;
  const needLogin = () => { if (!me) { fail(res, 401, 'Нужно войти'); return true; } return false; };
  const needStaff = () => {
    if (!me) { fail(res, 401, 'Нужно войти'); return true; }
    if (!STAFF.includes(me.role)) { fail(res, 403, 'Недостаточно прав'); return true; }
    return false;
  };
  const needAdmin = () => {
    if (!me) { fail(res, 401, 'Нужно войти'); return true; }
    if (me.role !== 'admin') { fail(res, 403, 'Только для администратора'); return true; }
    return false;
  };

  /* ----- публичные ----- */

  if (pathname === '/api/me' && method === 'GET') {
    return sendJson(res, 200, { ok: true, user: me ? publicUser(me) : null });
  }

  if (pathname === '/api/register' && method === 'POST') {
    if (limited('reg:' + ip, 10, 3600000)) return fail(res, 429, 'Слишком много попыток. Попробуйте позже.');
    const b = await readJson(req);
    const phone = normPhone(b.phone);
    const name = validName(b.name);
    if (!phone) return fail(res, 400, 'Укажите российский мобильный номер, например +7 900 123-45-67');
    if (!name) return fail(res, 400, 'Укажите имя (минимум 2 буквы)');
    const pe = passwordError(b.password);
    if (pe) return fail(res, 400, pe);
    if (b.password !== b.password2) return fail(res, 400, 'Пароли не совпадают');
    if (b.consentPrivacy !== true || b.consentTerms !== true) {
      return fail(res, 400, 'Нужно согласие на обработку персональных данных и принятие пользовательского соглашения');
    }
    if (db.users.some((u) => u.phone === phone)) return fail(res, 409, 'Этот номер уже зарегистрирован. Войдите в аккаунт.');
    const user = {
      id: uid(), phone, name, role: 'client', pass: await hashPw(b.password), mustChange: false, active: true,
      createdAt: now(), lastSeen: now(),
      consent: { privacy: true, terms: true, at: now(), ip, version: DOCS_VERSION },
      favorites: { complexes: [], apartments: [], designs: [] },
      progress: {}, events: [{ t: now(), type: 'register', text: 'Зарегистрировался' }], requests: [],
      call: { status: 'new' }, notes: [],
    };
    db.users.push(user);
    const cookie = startSession(req, res, user);
    saveDb();
    return sendJson(res, 200, { ok: true, user: publicUser(user) }, { 'Set-Cookie': cookie });
  }

  if (pathname === '/api/login' && method === 'POST') {
    const b = await readJson(req);
    const phone = normPhone(b.phone);
    if (limited('login-ip:' + ip, 30, 600000) || (phone && limited('login:' + phone, 6, 600000))) {
      return fail(res, 429, 'Слишком много попыток входа. Подождите 10 минут.');
    }
    const user = phone ? db.users.find((u) => u.phone === phone) : null;
    const pw = typeof b.password === 'string' ? b.password.slice(0, 200) : '';
    const ok = user ? await checkPw(pw, user.pass) : (DUMMY ? await checkPw(pw, DUMMY).then(() => false) : false);
    if (!user || !ok || !user.active) return fail(res, 401, 'Неверный номер телефона или пароль');
    user.lastLogin = now();
    user.lastSeen = now();
    user.events = user.events || [];
    user.events.push({ t: now(), type: 'login', text: 'Вошёл на сайт' });
    if (user.events.length > 300) user.events.splice(0, user.events.length - 300);
    if (STAFF.includes(user.role)) audit(user, 'login', user.id);
    const cookie = startSession(req, res, user);
    saveDb();
    return sendJson(res, 200, { ok: true, user: publicUser(user) }, { 'Set-Cookie': cookie });
  }

  if (pathname === '/api/logout' && method === 'POST') {
    if (auth) { db.sessions = db.sessions.filter((s) => s !== auth.session); saveDb(); }
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearCookie(req) });
  }

  if (pathname === '/api/reviews' && method === 'GET') {
    const list = db.reviews.filter((r) => r.status === 'published')
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((r) => ({ id: r.id, name: r.name, rating: r.rating, text: r.text, createdAt: r.createdAt, sample: !!r.sample }));
    const real = list.filter((r) => !r.sample);
    const avg = real.length ? real.reduce((s, r) => s + r.rating, 0) / real.length : 0;
    const dist = [0, 0, 0, 0, 0];
    real.forEach((r) => { dist[r.rating - 1]++; });
    return sendJson(res, 200, { ok: true, reviews: list, stats: { count: real.length, avg: Math.round(avg * 10) / 10, dist } });
  }

  /* ----- для вошедших пользователей ----- */

  if (pathname === '/api/password' && method === 'POST') {
    if (needLogin()) return;
    const b = await readJson(req);
    if (limited('pw:' + me.id, 10, 3600000)) return fail(res, 429, 'Слишком много попыток');
    if (!(await checkPw(String(b.old || ''), me.pass))) return fail(res, 400, 'Текущий пароль указан неверно');
    const pe = passwordError(b.password);
    if (pe) return fail(res, 400, pe);
    if (b.password === b.old) return fail(res, 400, 'Новый пароль должен отличаться от текущего');
    me.pass = await hashPw(b.password);
    me.mustChange = false;
    /* все остальные сессии закрываем */
    db.sessions = db.sessions.filter((s) => s.uid !== me.id || s === auth.session);
    if (STAFF.includes(me.role)) audit(me, 'password_change', me.id);
    saveDb();
    return sendJson(res, 200, { ok: true });
  }

  if (pathname === '/api/favorites' && method === 'POST') {
    if (needLogin()) return;
    const b = await readJson(req);
    const f = b.favorites || {};
    me.favorites = { complexes: cleanFavList(f.complexes), apartments: cleanFavList(f.apartments), designs: cleanFavList(f.designs) };
    saveDb();
    return sendJson(res, 200, { ok: true });
  }

  if (pathname === '/api/track' && method === 'POST') {
    if (needLogin()) return;
    if (limited('track:' + me.id, 240, 60000)) return fail(res, 429, 'Слишком часто');
    const b = await readJson(req, 8192);
    const p = (me.progress = me.progress || {});
    me.events = me.events || [];
    const ev = (type, text) => {
      const last = me.events[me.events.length - 1];
      if (last && last.type === type && last.text === text) return;
      me.events.push({ t: now(), type, text: clip(text, 160) });
      if (me.events.length > 300) me.events.splice(0, me.events.length - 300);
    };
    me.lastSeen = now();
    if (b.type === 'page') {
      const page = clip(b.page, 40);
      const label = clip(b.label, 100);
      p.lastPage = page;
      p.lastLabel = label || page;
      p.lastPageAt = now();
      if (page === 'complex' && label) p.viewedComplex = label.replace(/\s*—\s*КВАДРАТ\s*$/, '');
      if (page === 'estimate') p.estimateViewed = true;
      if (page === 'request') p.requestViewed = true;
      ev('page', 'Страница: ' + (label || page));
    } else if (b.type === 'config') {
      const step = Math.round(Number(b.step));
      if (step >= 1 && step <= 8) {
        p.step = step;
        p.maxStep = Math.max(p.maxStep || 0, step);
        ev('step', `Конфигуратор: шаг ${step} «${STEP_NAMES[step - 1]}»`);
      }
      if (b.complex !== undefined) p.complex = clip(b.complex, 80);
      if (b.design !== undefined) p.design = clip(b.design, 80);
      if (b.pkg !== undefined) p.pkg = clip(b.pkg, 40);
      if (b.kitchen !== undefined) p.kitchen = clip(b.kitchen, 80);
      const area = Number(b.area);
      if (area >= 10 && area <= 400) p.area = Math.round(area * 10) / 10;
      const total = Number(b.total);
      if (total >= 0 && total < 1e9) p.total = Math.round(total);
      const opts = Math.round(Number(b.options));
      if (opts >= 0 && opts < 50) p.options = opts;
    }
    saveDb();
    return sendJson(res, 200, { ok: true });
  }

  if (pathname === '/api/request' && method === 'POST') {
    if (needLogin()) return;
    if (limited('req:' + me.id, 5, 3600000)) return fail(res, 429, 'Слишком много заявок. Попробуйте позже.');
    const b = await readJson(req);
    const phone = normPhone(b.phone) || me.phone;
    const item = {
      id: uid(), t: now(), name: clip(b.name, 60) || me.name, phone,
      email: clip(b.email, 100), comment: clip(b.comment, 1000),
      summary: {
        complex: clip(b.complex, 80), design: clip(b.design, 80), pkg: clip(b.pkg, 40),
        area: Number(b.area) || null, total: Number(b.total) || null,
      },
    };
    me.requests = me.requests || [];
    me.requests.push(item);
    me.events = me.events || [];
    me.events.push({ t: now(), type: 'request', text: 'Оставил заявку на расчёт' });
    me.call = me.call && me.call.status !== 'new' ? me.call : { status: 'new', hot: true };
    me.call.hot = true;
    saveDb();
    return sendJson(res, 200, { ok: true });
  }

  if (pathname === '/api/reviews' && method === 'POST') {
    if (needLogin()) return;
    if (limited('rev:' + me.id, 3, 86400000)) return fail(res, 429, 'Вы уже отправили несколько отзывов. Спасибо!');
    const b = await readJson(req);
    const rating = Math.round(Number(b.rating));
    const text = clip(b.text, 1500);
    if (!(rating >= 1 && rating <= 5)) return fail(res, 400, 'Поставьте оценку от 1 до 5 звёзд');
    if (text.length < 10) return fail(res, 400, 'Напишите отзыв чуть подробнее (минимум 10 символов)');
    db.reviews.push({
      id: uid(), uid: me.id, name: me.name.split(/\s+/)[0], rating, text, createdAt: now(), status: 'pending', sample: false,
    });
    me.events = me.events || [];
    me.events.push({ t: now(), type: 'review', text: `Оставил отзыв (${rating}★)` });
    saveDb();
    return sendJson(res, 200, { ok: true });
  }

  /* ----- сотрудники ----- */

  if (pathname === '/api/admin/clients' && method === 'GET') {
    if (needStaff()) return;
    const list = db.users.filter((u) => u.role === 'client').map(clientSummary)
      .sort((a, b) => b.lastSeen - a.lastSeen);
    const stages = {};
    list.forEach((c) => { stages[c.stageCode] = (stages[c.stageCode] || 0) + 1; });
    return sendJson(res, 200, { ok: true, clients: list, stages });
  }

  let m = pathname.match(/^\/api\/admin\/clients\/([\w\-]+)$/);
  if (m && method === 'GET') {
    if (needStaff()) return;
    const u = db.users.find((x) => x.id === m[1] && x.role === 'client');
    if (!u) return fail(res, 404, 'Клиент не найден');
    audit(me, 'view_client', u.id);
    saveDb();
    return sendJson(res, 200, {
      ok: true,
      client: {
        ...clientSummary(u), progress: u.progress || {}, favorites: u.favorites || {},
        events: (u.events || []).slice(-80).reverse(),
        notes: (u.notes || []).slice().reverse(),
        requests: u.requests || [],
        consent: u.consent || null,
        lastLogin: u.lastLogin || null,
      },
    });
  }
  if (m && method === 'DELETE') {
    if (needAdmin()) return;
    const i = db.users.findIndex((x) => x.id === m[1] && x.role === 'client');
    if (i < 0) return fail(res, 404, 'Клиент не найден');
    const u = db.users[i];
    db.users.splice(i, 1);
    db.sessions = db.sessions.filter((s) => s.uid !== u.id);
    db.reviews.forEach((r) => { if (r.uid === u.id) r.uid = null; });
    audit(me, 'client_delete', u.id, { phone: u.phone.slice(0, 5) + '***' });
    saveDb();
    return sendJson(res, 200, { ok: true });
  }

  m = pathname.match(/^\/api\/admin\/clients\/([\w\-]+)\/call$/);
  if (m && method === 'POST') {
    if (needStaff()) return;
    const u = db.users.find((x) => x.id === m[1] && x.role === 'client');
    if (!u) return fail(res, 404, 'Клиент не найден');
    const b = await readJson(req);
    const status = CALL_STATUSES.includes(b.status) ? b.status : (u.call && u.call.status) || 'new';
    const note = clip(b.note, 600);
    const nextAt = b.nextAt ? clip(b.nextAt, 20) : null;
    u.call = { status, nextAt, by: me.name, updatedAt: now(), hot: status === 'new' ? !!(u.call && u.call.hot) : false };
    if (note) {
      u.notes = u.notes || [];
      u.notes.push({ t: now(), by: me.name, status, text: note });
      if (u.notes.length > 100) u.notes.splice(0, u.notes.length - 100);
    }
    audit(me, 'call_update', u.id, { status });
    saveDb();
    return sendJson(res, 200, { ok: true, call: u.call });
  }

  if (pathname === '/api/admin/export.csv' && method === 'GET') {
    if (needAdmin()) return;
    const esc = (v) => {
      let s = String(v == null ? '' : v);
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const rows = [['Имя', 'Телефон', 'Регистрация', 'Последняя активность', 'Где остановился', 'ЖК', 'Дизайн', 'Комплектация', 'Площадь', 'Сумма', 'Статус звонка', 'Заметка']];
    db.users.filter((u) => u.role === 'client').forEach((u) => {
      const s = clientSummary(u);
      const lastNote = (u.notes || []).slice(-1)[0];
      rows.push([s.name, s.phone, new Date(s.createdAt).toISOString(), new Date(s.lastSeen).toISOString(), s.stage, s.complex, s.design, s.pkg, s.area, s.total, s.call.status, lastNote ? lastNote.text : '']);
    });
    audit(me, 'export', null, { rows: rows.length - 1 });
    saveDb();
    return send(res, 200, '﻿' + rows.map((r) => r.map(esc).join(';')).join('\r\n'), {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="clients.csv"',
      'Cache-Control': 'no-store',
    });
  }

  if (pathname === '/api/admin/staff' && method === 'GET') {
    if (needAdmin()) return;
    return sendJson(res, 200, {
      ok: true,
      staff: db.users.filter((u) => STAFF.includes(u.role)).map((u) => ({
        id: u.id, name: u.name, phone: u.phone, role: u.role, active: u.active, createdAt: u.createdAt, lastLogin: u.lastLogin || null, mustChange: !!u.mustChange,
      })),
    });
  }
  if (pathname === '/api/admin/staff' && method === 'POST') {
    if (needAdmin()) return;
    const b = await readJson(req);
    const phone = normPhone(b.phone);
    const name = validName(b.name);
    const role = b.role === 'admin' ? 'admin' : 'manager';
    if (!phone) return fail(res, 400, 'Укажите российский мобильный номер');
    if (!name) return fail(res, 400, 'Укажите имя сотрудника');
    let password = typeof b.password === 'string' && b.password ? b.password : '';
    let generated = false;
    if (!password) { password = genPassword(); generated = true; }
    else { const pe = passwordError(password); if (pe) return fail(res, 400, pe); }
    if (db.users.some((u) => u.phone === phone)) return fail(res, 409, 'Этот номер уже зарегистрирован в системе');
    const user = {
      id: uid(), phone, name, role, pass: await hashPw(password), mustChange: true, active: true,
      createdAt: now(), createdBy: me.id, favorites: { complexes: [], apartments: [], designs: [] }, progress: {}, events: [], requests: [], call: { status: 'new' }, notes: [],
    };
    db.users.push(user);
    audit(me, 'staff_create', user.id, { role });
    saveDb();
    return sendJson(res, 200, { ok: true, id: user.id, password: generated ? password : null });
  }
  m = pathname.match(/^\/api\/admin\/staff\/([\w\-]+)\/(reset|toggle)$/);
  if (m && method === 'POST') {
    if (needAdmin()) return;
    const u = db.users.find((x) => x.id === m[1] && STAFF.includes(x.role));
    if (!u) return fail(res, 404, 'Сотрудник не найден');
    if (m[2] === 'reset') {
      const password = genPassword();
      u.pass = await hashPw(password);
      u.mustChange = true;
      db.sessions = db.sessions.filter((s) => s.uid !== u.id);
      audit(me, 'staff_reset', u.id);
      saveDb();
      return sendJson(res, 200, { ok: true, password });
    }
    if (u.id === me.id) return fail(res, 400, 'Нельзя отключить самого себя');
    u.active = !u.active;
    if (!u.active) db.sessions = db.sessions.filter((s) => s.uid !== u.id);
    audit(me, 'staff_toggle', u.id, { active: u.active });
    saveDb();
    return sendJson(res, 200, { ok: true, active: u.active });
  }

  if (pathname === '/api/admin/reviews' && method === 'GET') {
    if (needAdmin()) return;
    const list = db.reviews.slice().sort((a, b) => b.createdAt - a.createdAt).map((r) => {
      const u = r.uid ? db.users.find((x) => x.id === r.uid) : null;
      return { id: r.id, name: r.name, phone: u ? u.phone : null, rating: r.rating, text: r.text, createdAt: r.createdAt, status: r.status, sample: !!r.sample };
    });
    return sendJson(res, 200, { ok: true, reviews: list });
  }
  m = pathname.match(/^\/api\/admin\/reviews\/([\w\-]+)$/);
  if (m && method === 'POST') {
    if (needAdmin()) return;
    const r = db.reviews.find((x) => x.id === m[1]);
    if (!r) return fail(res, 404, 'Отзыв не найден');
    const b = await readJson(req);
    if (b.action === 'publish') r.status = 'published';
    else if (b.action === 'hide') r.status = 'hidden';
    else if (b.action === 'delete') db.reviews = db.reviews.filter((x) => x !== r);
    else return fail(res, 400, 'Неизвестное действие');
    audit(me, 'review_' + b.action, r.id);
    saveDb();
    return sendJson(res, 200, { ok: true });
  }

  if (pathname === '/api/admin/audit' && method === 'GET') {
    if (needAdmin()) return;
    return sendJson(res, 200, { ok: true, audit: db.audit.slice(-300).reverse() });
  }

  return fail(res, 404, 'Не найдено');
}

/* ---------- Статика ---------- */

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
const STAFF_PAGES = { '/admin.html': 'staff', '/admin-catalog.html': 'admin' };

function serveStatic(req, res, pathname) {
  let p;
  try { p = decodeURIComponent(pathname); } catch (e) { return send(res, 400, 'Bad request'); }
  if (p === '/') p = '/index.html';
  if (p.includes('\0') || p.includes('\\')) return send(res, 400, 'Bad request');
  const full = path.normalize(path.join(ROOT, p));
  if (!full.startsWith(ROOT + path.sep)) return send(res, 403, 'Forbidden');
  const rel = path.relative(ROOT, full).split(path.sep);
  const ext = path.extname(full).toLowerCase();
  const inAssets = rel[0] === 'js' || rel[0] === 'css' || rel[0] === 'screenshots' || rel[0] === 'img';
  /* Отдаём только страницы в корне и файлы из js/ css/ img/; всё остальное (server.js, data/, .md …) закрыто */
  const allowed = MIME[ext] && ((rel.length === 1 && ext === '.html') || (rel.length > 1 && inAssets));
  if (!allowed || rel.some((s) => s.startsWith('.'))) return notFound(req, res);

  const guard = STAFF_PAGES[p];
  if (guard) {
    const a = getAuth(req);
    const okRole = a && (guard === 'staff' ? STAFF.includes(a.user.role) : a.user.role === 'admin');
    if (!okRole) {
      res.writeHead(302, { ...SEC_HEADERS, Location: '/login.html?next=' + encodeURIComponent(p), 'Cache-Control': 'no-store' });
      return res.end();
    }
  }

  fs.readFile(full, (err, buf) => {
    if (err) return notFound(req, res);
    const headers = { 'Content-Type': MIME[ext], 'Cache-Control': guard ? 'no-store' : 'no-cache' };
    if (ext === '.html') headers['Content-Security-Policy'] = CSP;
    send(res, 200, req.method === 'HEAD' ? '' : buf, headers);
  });
}
function notFound(req, res) {
  fs.readFile(path.join(ROOT, '404.html'), (err, buf) => {
    send(res, 404, err ? 'Not found' : buf, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': CSP });
  });
}

/* ---------- Сервер ---------- */

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname.startsWith('/api/')) {
      await handleApi(req, res, u.pathname, u.searchParams);
    } else if (req.method === 'GET' || req.method === 'HEAD') {
      serveStatic(req, res, u.pathname);
    } else {
      send(res, 405, 'Method not allowed');
    }
  } catch (e) {
    if (e && e.status) return fail(res, e.status, e.message);
    console.error('[ошибка]', e && e.message);
    if (!res.headersSent) fail(res, 500, 'Внутренняя ошибка сервера');
  }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;

/* ---------- Запуск и CLI ---------- */

async function ensureAdmin() {
  if (db.users.some((u) => u.role === 'admin' && u.active)) return;
  const phone = normPhone(process.env.ADMIN_PHONE || '');
  let password = process.env.ADMIN_PASSWORD || '';
  const generated = !password;
  if (generated) password = genPassword();
  const adminPhone = phone || '+79000000000';
  db.users.push({
    id: uid(), phone: adminPhone, name: 'Администратор', role: 'admin', pass: await hashPw(password),
    mustChange: generated, active: true, createdAt: now(), favorites: { complexes: [], apartments: [], designs: [] },
    progress: {}, events: [], requests: [], call: { status: 'new' }, notes: [],
  });
  saveDb(true);
  console.log('\n==============================================================');
  console.log(' Создан первый администратор');
  console.log('   Телефон: ' + adminPhone);
  console.log('   Пароль:  ' + (generated ? password + '   (при первом входе потребуется сменить)' : '(из ADMIN_PASSWORD)'));
  if (!phone) console.log('   Задайте свой номер: ADMIN_PHONE=+79001234567 (до первого запуска)');
  console.log(' Этот пароль показан один раз. Сохраните его.');
  console.log('==============================================================\n');
}

function seedReviews() {
  if (db.meta.reviewsSeeded) return;
  const base = Date.now();
  [
    { name: 'Анна', text: 'Кухню помогли спроектировать под нашу планировку и сразу показали ориентировочную стоимость. Всё понятно и без сюрпризов.' },
    { name: 'Дмитрий', text: 'Удобно, что можно выбрать ЖК, дизайн и комплектацию в одном месте. Менеджер перезвонил в тот же день и ответил на все вопросы.' },
    { name: 'Екатерина', text: 'Понравился подход: сначала расчёт, потом разговор. Мебель подобрали аккуратно, в рамках бюджета.' },
  ].forEach((r, i) => db.reviews.push({
    id: uid(), uid: null, name: r.name, rating: 5, text: r.text, createdAt: base - (i + 1) * 86400000 * 3, status: 'published', sample: true,
  }));
  db.meta.reviewsSeeded = true;
  saveDb(true);
}

async function main() {
  loadDb();
  const [cmd, a1, a2] = process.argv.slice(2);
  if (cmd === 'reset-admin') {
    const phone = normPhone(a1);
    if (!phone || passwordError(a2)) {
      console.log('Использование: node server.js reset-admin +79001234567 НовыйПароль1  (пароль: 8+ символов, буквы и цифры)');
      process.exit(1);
    }
    let u = db.users.find((x) => x.phone === phone);
    if (!u) {
      u = { id: uid(), phone, name: 'Администратор', role: 'admin', active: true, createdAt: now(), favorites: { complexes: [], apartments: [], designs: [] }, progress: {}, events: [], requests: [], call: { status: 'new' }, notes: [] };
      db.users.push(u);
    }
    u.role = 'admin'; u.active = true; u.pass = await hashPw(a2); u.mustChange = false;
    db.sessions = db.sessions.filter((s) => s.uid !== u.id);
    saveDb(true);
    console.log('Готово: администратор ' + phone + ' может войти с новым паролем.');
    process.exit(0);
  }
  seedReviews();
  await ensureAdmin();
  server.listen(PORT, HOST, () => {
    console.log(`КВАДРАТ запущен: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log('Остановить: Ctrl+C. База данных: ' + DB_FILE);
  });
}
main();
