/* ============================================================
   КВАДРАТ — Демонстрационные данные и модель каталога
   Единый источник данных. Админка сохраняет изменения в
   localStorage поверх этих значений (см. store.js).
   ============================================================ */

const KVADRAT_SCHEMA_VERSION = 3;

/* ---------- Бренд (централизованные настройки) ---------- */

const BRAND = {
  name: 'КВАДРАТ',
  tagline: 'Дизайн и ремонт новостроек',
  cityDefault: 'c-rostov',
  contacts: {
    phone: '',
    email: '',
    address: '',
    hours: 'Пн–Сб, 9:00–20:00',
  },
  disclaimer:
    'КВАДРАТ — независимый демонстрационный сервис подбора квартир и расчёта ремонта. ' +
    'Сервис не является официальным сайтом застройщиков. Все данные о жилых комплексах, ' +
    'планировках, ценах и сроках носят информационный демонстрационный характер.',
};

/* ---------- Изображения (Unsplash, стабильные ID) ---------- */

const IMG = {
  heroKitchen: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
  kitchen1: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=80',
  kitchen2: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1400&q=80',
  kitchen3: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
  living1: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80',
  living2: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
  living3: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80',
  bedroom1: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80',
  bedroom2: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=80',
  bedroom3: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80',
  bathroom1: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80',
  bathroom2: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1400&q=80',
  interior1: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
  interior2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
  interior3: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
  interior4: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1400&q=80',
  interior5: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=80',
  interior6: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
  interior7: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
  interior8: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80',
  interior9: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1400&q=80',
  interior10: 'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=1400&q=80',
  interior11: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
  interior12: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1400&q=80',
  interior13: 'https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1400&q=80',
  interior14: 'https://images.unsplash.com/photo-1616627988260-8a8a1c2b0e5e?auto=format&fit=crop&w=1400&q=80',
  interior15: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1400&q=80',
  interior16: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?auto=format&fit=crop&w=1400&q=80',
  wood: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
  stone: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1400&q=80',
};

/* ---------- Справочники ---------- */

const APARTMENT_TYPES = {
  studio: { label: 'Студия', short: 'Студия' },
  one: { label: 'Однокомнатная', short: '1-комн.' },
  'euro-two': { label: 'Евродвушка', short: 'Евро-2' },
  two: { label: 'Двухкомнатная', short: '2-комн.' },
  three: { label: 'Трёхкомнатная', short: '3-комн.' },
};

const MATERIAL_CATEGORIES = [
  { key: 'floor', label: 'Пол' },
  { key: 'walls', label: 'Стены' },
  { key: 'ceiling', label: 'Потолок' },
  { key: 'tile', label: 'Плитка' },
  { key: 'doors', label: 'Двери' },
  { key: 'lighting', label: 'Освещение' },
  { key: 'plumbing', label: 'Сантехника' },
];

/* ---------- Города ---------- */

const DEFAULT_CITIES = [
  { id: 'c-rostov', slug: 'rostov-na-donu', name: 'Ростов-на-Дону' },
];

/* ---------- Застройщики ---------- */

const DEFAULT_DEVELOPERS = [
  {
    id: 'dev-ssk',
    slug: 'ssk',
    name: 'ССК',
    cityId: 'c-rostov',
    logoText: 'ССК',
    description:
      'Крупный региональный застройщик с портфелем жилых комплексов бизнес- и комфорт-класса. ' +
      'Застройщик ЖК «Октябрь Парк».',
    published: true,
  },
  {
    id: 'dev-sk10',
    slug: 'sk10',
    name: 'СК10',
    cityId: 'c-rostov',
    logoText: 'СК10',
    description:
      'Застройщик, известный современными жилыми кварталами с развитой инфраструктурой ' +
      'и продуманными планировками.',
    published: true,
  },
  {
    id: 'dev-dns',
    slug: 'donneftestroy',
    name: 'Доннефтестрой',
    cityId: 'c-rostov',
    logoText: 'ДНС',
    description:
      'Строительная компания с многолетней историей. Объекты в каталоге отмечены ' +
      'как демонстрационные до подтверждения данных.',
    published: true,
  },
];

/* ---------- Жилые комплексы ---------- */

/* Источники: только официальные сайты застройщиков (проверено 18.10.2026). */
const KVADRAT_SOURCE_AUDIT_DATE = '2026-10-18';
const KVADRAT_OFFICIAL_SOURCES = {
  ssk: 'https://sskuban.ru/rostov-na-donu/',
  oktyabrPark: 'https://oktyabrskiipark.ru/',
  sk10Projects: 'https://sk10.ru/projects',
  kosmos: 'https://sk10.ru/projects/zhk-kosmos',
  sezony: 'https://sk10.ru/projects/zhk-sezony',
  kultura: 'https://sk10.ru/projects/zhk-kultura',
  greenside: 'https://sk10.ru/projects/zhk-grinsajd',
  donneftestroy: 'https://xn--d1acaqraferjjcw.xn--p1ai/projects',
  panorama: 'https://xn--d1acaqraferjjcw.xn--p1ai/projects/panorama-na-teatralnom',
  prityazhenie: 'https://xn--d1acaqraferjjcw.xn--p1ai/projects/prityazhenie',
  zapadnyeAllei: 'https://xn--d1acaqraferjjcw.xn--p1ai/projects/zapadnye-allei',
  svoboda: 'https://xn--d1acaqraferjjcw.xn--p1ai/projects/zhk-svoboda',
  zvezdaStolicy: 'https://xn--d1acaqraferjjcw.xn--p1ai/projects/zhk-zvezda-stolicy',
};

const _SK = 'https://storage.yandexcloud.net/sk10-media-site/p/pg/gl/';
const _DN = 'https://img.xn--d1acaqraferjjcw.xn--p1ai/';
const _CR = 'https://img1.creatium.ru/disk2/';

/* Жилые комплексы Ростова-на-Дону. Фото и факты — с сайтов застройщиков. */
const DEFAULT_COMPLEXES = [
  {
    id: 'cx-op',
    slug: 'oktyabr-park',
    name: 'Октябрь Парк',
    developerId: 'dev-ssk',
    cityId: 'c-rostov',
    class: 'комфорт',
    address: 'Ростов-на-Дону, ул. Таганрогская, 132/4',
    year: '',
    floors: '',
    description:
      'Монолитный жилой комплекс комфорт-класса от ССК. Просторные кухни и кухни-гостиные, ' +
      'подземный паркинг со входом из лобби, школа в шаговой доступности, безбарьерная среда.',
    image: _CR + '32/e8/41/c4de64ad1b59b8202951519ad9a89ba134/01j6en9z0rea33kbapjtbvgrw0.jpg',
    gallery: [
      _CR + '32/e8/41/c4de64ad1b59b8202951519ad9a89ba134/01j6en9z0rea33kbapjtbvgrw0.jpg',
      _CR + '8d/cd/b2/2de8c47371ed7319ae02f16e94aa77d685/img_3446.jpg',
      _CR + 'ca/70/a6/d24fc30e2c321018494dca08adca916860/img_3445.jpg',
      _CR + '96/e9/73/1f064b8c74a3a4f05998b02330496fa5b3/img_3443.jpg',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.oktyabrPark,
    sourceName: 'Официальный сайт ЖК «Октябрь Парк»',
    imageKind: 'official',
    priority: true,
    demo: false,
    published: true,
  },
  {
    id: 'cx-kosmos',
    slug: 'kosmos',
    name: 'Космос',
    developerId: 'dev-sk10',
    cityId: 'c-rostov',
    class: '',
    address: 'Ростов-на-Дону, центр города',
    year: '',
    floors: '15–24',
    description: 'ЖК «Космос» от СК10 в центре Ростова-на-Дону. Секции от 15 до 24 этажей.',
    image: _SK + '139f8756da2301f839b100354ccffa03044582bb.jpg',
    gallery: [
      _SK + '139f8756da2301f839b100354ccffa03044582bb.jpg',
      _SK + '2162fb0ad42c90bb87809ccd0e3246bec5aa1fe1.jpg',
      _SK + 'd5ced9d1758b2e8698e0538f6e64f87392193fd4.jpg',
      _SK + '607089e509336c3ec6c5f70983141d8f14725957.jpg',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.kosmos,
    sourceName: 'Официальный сайт СК10',
    imageKind: 'official',
    demo: false,
    published: true,
  },
  {
    id: 'cx-sezony',
    slug: 'sezony',
    name: 'Сезоны',
    developerId: 'dev-sk10',
    cityId: 'c-rostov',
    class: '',
    address: 'Ростов-на-Дону, центр города',
    year: '',
    floors: '9',
    description: 'ЖК «Сезоны» от СК10: четыре девятиэтажных дома в центре Ростова-на-Дону.',
    image: _SK + '7e17535db0780236d648927fc78a3f92220f3268.jpg',
    gallery: [
      _SK + '7e17535db0780236d648927fc78a3f92220f3268.jpg',
      _SK + '797167059bd0b518658e1949a9545e845c350511.webp',
      _SK + '3bb4f66cb888a9e707ba930fb717567a83208693.webp',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.sezony,
    sourceName: 'Официальный сайт СК10',
    imageKind: 'official',
    demo: false,
    published: true,
  },
  {
    id: 'cx-kultura',
    slug: 'kultura',
    name: 'Культура',
    developerId: 'dev-sk10',
    cityId: 'c-rostov',
    class: 'бизнес',
    address: 'Ростов-на-Дону, Кировский район, пересечение Театрального проспекта и ул. Текучёва',
    year: '',
    floors: '19–25',
    description: 'ЖК «Культура» от СК10 в Кировском районе Ростова-на-Дону. Секции от 19 до 25 этажей.',
    image: _SK + '501aaf1ef01f9e04469cde3f8e36374f127b5750.webp',
    gallery: [
      _SK + '501aaf1ef01f9e04469cde3f8e36374f127b5750.webp',
      _SK + '812d4b753c1f946682367e945afd4aa53f50053f.webp',
      _SK + '7ff745792f398cc34e772aa55bae4394632e0ef5.webp',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.kultura,
    sourceName: 'Официальный сайт СК10',
    imageKind: 'official',
    demo: false,
    published: true,
  },
  {
    id: 'cx-greenside',
    slug: 'greenside',
    name: 'Гринсайд',
    developerId: 'dev-sk10',
    cityId: 'c-rostov',
    class: '',
    address: 'Ростов-на-Дону, район ТРЦ «РИО»',
    year: '',
    floors: '18–25',
    description: 'ЖК «Гринсайд» от СК10 рядом с ТРЦ «РИО». Секции от 18 до 25 этажей.',
    image: _SK + '9d0841e9dfb981c5c674e56937d9ec6487ba79cc.webp',
    gallery: [
      _SK + '9d0841e9dfb981c5c674e56937d9ec6487ba79cc.webp',
      _SK + 'bff355ce4df800060a6b4676626d57c55df957ce.webp',
      _SK + 'c4fac12d762265f8eacba5e2d6ecb375020635f1.webp',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.greenside,
    sourceName: 'Официальный сайт СК10',
    imageKind: 'official',
    demo: false,
    published: true,
  },
  {
    id: 'cx-panorama',
    slug: 'panorama-na-teatralnom',
    name: 'Панорама на Театральном',
    developerId: 'dev-dns',
    cityId: 'c-rostov',
    class: 'бизнес',
    address: 'Ростов-на-Дону, Театральный проспект, 62',
    year: '',
    floors: '25',
    description: 'ЖК бизнес-класса «Панорама на Театральном» от ДОННЕФТЕСТРОЯ на Театральном проспекте.',
    image: _DN + 'rs:fill:1046:542:0/plain/production/1881f73e9e0530d2592708df47e0bfa45c703.jpg',
    gallery: [
      _DN + 'rs:fill:1046:542:0/plain/production/1881f73e9e0530d2592708df47e0bfa45c703.jpg',
      _DN + 'rs:fill:1100:0:0/plain/production/bf574fd4afa239e6953165b47a70a3820c847.jpg',
      _DN + 'rs:fill:1366:0:0/plain/production/4935f9ab63af0bce7a6adf65fa06e94988c18.jpg',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.panorama,
    sourceName: 'Официальный сайт ДОННЕФТЕСТРОЯ',
    imageKind: 'official',
    demo: false,
    published: true,
  },
  {
    id: 'cx-prityazhenie',
    slug: 'prityazhenie',
    name: 'Притяжение',
    developerId: 'dev-dns',
    cityId: 'c-rostov',
    class: 'комфорт+',
    address: 'Ростов-на-Дону, Левенцовка, ул. Назарько',
    year: '',
    floors: '19',
    description: 'ЖК «Притяжение» от ДОННЕФТЕСТРОЯ в районе Левенцовка, на улице Назарько.',
    image: _DN + 'rs:fill:1046:542:0/plain/production/741e13dbfafbfcd2179bfd916ae6d52c83cea.jpg',
    gallery: [
      _DN + 'rs:fill:1046:542:0/plain/production/741e13dbfafbfcd2179bfd916ae6d52c83cea.jpg',
      _DN + 'rs:fill:1100:0:0/plain/production/7d7452356b3d0fb9ce8fe68c5713992af28d1.jpg',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.prityazhenie,
    sourceName: 'Официальный сайт ДОННЕФТЕСТРОЯ',
    imageKind: 'official',
    demo: false,
    published: true,
  },
  {
    id: 'cx-zapadnye-alei',
    slug: 'zapadnye-allei',
    name: 'Западные Аллеи',
    developerId: 'dev-dns',
    cityId: 'c-rostov',
    class: 'комфорт+',
    address: 'Ростов-на-Дону, пр. Маршала Жукова / ул. Ткачёва',
    year: '',
    floors: '9–19',
    description: 'ЖК «Западные Аллеи» от ДОННЕФТЕСТРОЯ в Западном жилом массиве. Дома от 9 до 19 этажей.',
    image: _DN + 'rs:fill:1046:542:0/plain/production/29cb164ca49190a123282b91fc1145791eabd.jpg',
    gallery: [
      _DN + 'rs:fill:1046:542:0/plain/production/29cb164ca49190a123282b91fc1145791eabd.jpg',
      _DN + 'rs:fill:1100:0:0/plain/production/fae91a0ff24a4cb335cd068d16f4fc7f238ec.jpg',
      _DN + 'rs:fill:1366:0:0/plain/production/de559a648c741c5b0055543e70b80389d16cb.jpg',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.zapadnyeAllei,
    sourceName: 'Официальный сайт ДОННЕФТЕСТРОЯ',
    imageKind: 'official',
    demo: false,
    published: true,
  },
  {
    id: 'cx-svoboda',
    slug: 'svoboda',
    name: 'Свобода',
    developerId: 'dev-dns',
    cityId: 'c-rostov',
    class: 'комфорт+',
    address: 'Ростов-на-Дону, ул. Горсоветская, 49',
    year: '',
    floors: '24',
    description: 'ЖК «Свобода» от ДОННЕФТЕСТРОЯ на улице Горсоветской: два 24-этажных дома.',
    image: _DN + 'rs:fill:1046:542:0/plain/production/5d18c3bbb38cece50032d4e9d6280670807ec.jpg',
    gallery: [
      _DN + 'rs:fill:1046:542:0/plain/production/5d18c3bbb38cece50032d4e9d6280670807ec.jpg',
      _DN + 'rs:fill:1100:0:0/plain/production/7dfee8a2f9f8b9efa6b6a772111330.jpg',
      _DN + 'rs:fill:1366:0:0/plain/production/e0284e71aefc39595259e1c801e7d1.jpg',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.svoboda,
    sourceName: 'Официальный сайт ДОННЕФТЕСТРОЯ',
    imageKind: 'official',
    demo: false,
    published: true,
  },
  {
    id: 'cx-zvezda-stolicy-2',
    slug: 'zvezda-stolicy-2',
    name: 'Звезда Столицы 2',
    developerId: 'dev-dns',
    cityId: 'c-rostov',
    class: 'бизнес',
    address: 'Ростов-на-Дону, ул. Нансена',
    year: '',
    floors: '25',
    description: 'ЖК бизнес-класса «Звезда Столицы 2» от ДОННЕФТЕСТРОЯ на улице Нансена.',
    image: _DN + 'rs:fill:1046:542:0/plain/production/834db263fa194496947fd04d174aa2046ba9a.jpg',
    gallery: [
      _DN + 'rs:fill:1046:542:0/plain/production/834db263fa194496947fd04d174aa2046ba9a.jpg',
      _DN + 'rs:fill:1100:0:0/plain/production/080271aba3cd15ef5b811253934f3b7f43c40.jpg',
      _DN + 'rs:fill:1366:0:0/plain/production/a69b53de1416b37f94338a81076be7c8b2822.jpg',
    ],
    sourceUrl: KVADRAT_OFFICIAL_SOURCES.zvezdaStolicy,
    sourceName: 'Официальный сайт ДОННЕФТЕСТРОЯ',
    imageKind: 'official',
    demo: false,
    published: true,
  },
];

/* ---------- Квартиры (демонстрационные планировки) ---------- */

/* Подтверждённых планировок пока нет: расчёт идёт по площади, которую вводит пользователь. */
const DEFAULT_APARTMENTS = [];

/* ---------- Дизайн-проекты ---------- */

const DEFAULT_DESIGNS = [
  {
    id: 'ds-soft-minimal',
    slug: 'soft-minimal',
    name: 'Soft Minimal',
    style: 'Минимализм',
    packageLevel: 'comfort',
    priceLevel: 'Средний',
    description:
      'Спокойный минимализм с тёплой базой: светлые поверхности, натуральный дуб, ' +
      'мягкий текстиль и латунные акценты. Пространство дышит, ничего лишнего.',
    image: IMG.interior1,
    gallery: [IMG.interior1, IMG.interior2, IMG.interior3, IMG.kitchen1],
    palette: ['#F5F2EC', '#C9C4B8', '#8A8F84', '#3E423B'],
    materials: ['Шпон дуба', 'Микроцемент', 'Лён', 'Латунь'],
    suitableTypes: ['studio', 'one', 'euro-two'],
    published: true,
  },
  {
    id: 'ds-eco-light',
    slug: 'eco-light',
    name: 'Eco Light',
    style: 'Эко',
    packageLevel: 'base',
    priceLevel: 'Экономный',
    description:
      'Простой светлый интерьер на доступных материалах: ламинат под дерево, покраска стен, ' +
      'натяжной потолок и практичная мебель. Хорошо подходит для небольших квартир и первого ремонта.',
    image: IMG.interior14,
    gallery: [IMG.interior14, IMG.interior15, IMG.interior16, IMG.kitchen2],
    palette: ['#F7F4EE', '#D9D2C3', '#9DA58C', '#4B5043'],
    materials: ['Ламинат', 'Краска', 'Хлопок', 'Светлое дерево'],
    suitableTypes: ['studio', 'one', 'euro-two'],
    published: true,
  },
  {
    id: 'ds-contemporary',
    slug: 'contemporary',
    name: 'Contemporary',
    style: 'Современный',
    packageLevel: 'comfort',
    priceLevel: 'Средний',
    description:
      'Актуальный современный интерьер с графичными линиями, крупноформатным ' +
      'керамогранитом и встроенными системами хранения.',
    image: IMG.interior6,
    gallery: [IMG.interior6, IMG.interior7, IMG.living1, IMG.bathroom1],
    palette: ['#EDEAE2', '#B9B4A8', '#6E7268', '#2E312C'],
    materials: ['Керамогранит', 'Шпон ореха', 'Стекло', 'Алюминий'],
    suitableTypes: ['one', 'euro-two', 'two'],
    published: true,
  },
  {
    id: 'ds-warm-modern',
    slug: 'warm-modern',
    name: 'Warm Modern',
    style: 'Тёплый модерн',
    packageLevel: 'comfort-plus',
    priceLevel: 'Выше среднего',
    description:
      'Тёплый современный интерьер с выразительными фактурами: микроцемент, ' +
      'натуральный камень, мягкое рассеянное освещение и индивидуальные решения.',
    image: IMG.interior8,
    gallery: [IMG.interior8, IMG.interior9, IMG.living2, IMG.bathroom2],
    palette: ['#F0E9DE', '#C9B79A', '#8C7A63', '#3A352E'],
    materials: ['Микроцемент', 'Травертин', 'Дуб', 'Шерсть'],
    suitableTypes: ['euro-two', 'two', 'three'],
    published: true,
  },
  {
    id: 'ds-modern-classic',
    slug: 'modern-classic',
    name: 'Modern Classic',
    style: 'Современная классика',
    packageLevel: 'comfort-plus',
    priceLevel: 'Выше среднего',
    description:
      'Сдержанная классика в современном прочтении: симметрия, молдинги, ' +
      'благородные оттенки и качественные материалы премиального уровня.',
    image: IMG.interior10,
    gallery: [IMG.interior10, IMG.interior11, IMG.bedroom2, IMG.living3],
    palette: ['#F4F1EA', '#D6CDBE', '#9A8F7C', '#4A443B'],
    materials: ['МДФ с эмалью', 'Мрамор', 'Шёлк', 'Латунь'],
    suitableTypes: ['two', 'three'],
    published: true,
  },
  {
    id: 'ds-urban-calm',
    slug: 'urban-calm',
    name: 'Urban Calm',
    style: 'Урбан',
    packageLevel: 'comfort',
    priceLevel: 'Средний',
    description:
      'Городской интерьер с характером: тёмные акценты, бетонные фактуры, ' +
      'продуманное освещение и комфортные зоны отдыха.',
    image: IMG.interior12,
    gallery: [IMG.interior12, IMG.interior13, IMG.bedroom3, IMG.kitchen3],
    palette: ['#E8E4DC', '#A9A49A', '#5C5E58', '#23251F'],
    materials: ['Бетон', 'Чёрный металл', 'Дуб', 'Кожа'],
    suitableTypes: ['one', 'euro-two', 'two'],
    published: true,
  },
];

/* ---------- Комплектации ---------- */

const DEFAULT_PACKAGES = [
  {
    id: 'pkg-base',
    slug: 'base',
    name: 'Базовая',
    worksRate: 11500,
    roughRate: 4500,
    description:
      'Основные отделочные работы, базовые материалы и стандартные решения освещения. ' +
      'Надёжный результат без излишеств.',
    published: true,
  },
  {
    id: 'pkg-comfort',
    slug: 'comfort',
    name: 'Комфорт',
    worksRate: 16000,
    roughRate: 6000,
    description:
      'Расширенный выбор отделки и материалов, дополнительные варианты освещения, ' +
      'более аккуратная геометрия и детали.',
    published: true,
  },
  {
    id: 'pkg-comfort-plus',
    slug: 'comfort-plus',
    name: 'Комфорт +',
    worksRate: 22000,
    roughRate: 9000,
    description:
      'Материалы высокого ценового уровня, расширенные возможности комплектации ' +
      'и индивидуальные декоративные решения.',
    published: true,
  },
];

/* ---------- Материалы (чистовая отделка) ---------- */

const DEFAULT_MATERIALS = [
  { id: 'mat-floor-laminate', slug: 'laminate', name: 'Ламинат 33 класс', category: 'floor', unit: 'м²', price: 1800, includedIn: ['base', 'comfort', 'comfort-plus'], description: 'Практичное напольное покрытие с фактурой дерева.' },
  { id: 'mat-floor-parquet', slug: 'parquet', name: 'Паркетная доска', category: 'floor', unit: 'м²', price: 4200, includedIn: ['comfort', 'comfort-plus'], description: 'Натуральное дерево, тёплая поверхность.' },
  { id: 'mat-floor-keramogranit', slug: 'keramogranit', name: 'Керамогранит', category: 'floor', unit: 'м²', price: 2600, includedIn: ['comfort', 'comfort-plus'], description: 'Износостойкий материал для прихожей и кухни.' },
  { id: 'mat-floor-engineered', slug: 'engineered', name: 'Инженерная доска', category: 'floor', unit: 'м²', price: 5600, includedIn: ['comfort-plus'], description: 'Премиальное покрытие из массива ценных пород.' },
  { id: 'mat-walls-paint', slug: 'paint', name: 'Краска', category: 'walls', unit: 'м²', price: 700, includedIn: ['base', 'comfort', 'comfort-plus'], description: 'Матовая интерьерная краска, широкая палитра.' },
  { id: 'mat-walls-wallpaper', slug: 'wallpaper', name: 'Обои', category: 'walls', unit: 'м²', price: 1100, includedIn: ['comfort', 'comfort-plus'], description: 'Флизелиновые обои с фактурой.' },
  { id: 'mat-walls-plaster', slug: 'plaster', name: 'Декоративная штукатурка', category: 'walls', unit: 'м²', price: 2400, includedIn: ['comfort-plus'], description: 'Фактурное покрытие с эффектом камня.' },
  { id: 'mat-walls-microcement', slug: 'microcement', name: 'Микроцемент', category: 'walls', unit: 'м²', price: 3400, includedIn: ['comfort-plus'], description: 'Бесшовное покрытие в современном стиле.' },
  { id: 'mat-ceiling-matte', slug: 'ceiling-matte', name: 'Натяжной матовый', category: 'ceiling', unit: 'м²', price: 1100, includedIn: ['base', 'comfort', 'comfort-plus'], description: 'Ровный матовый потолок.' },
  { id: 'mat-ceiling-satin', slug: 'ceiling-satin', name: 'Натяжной сатиновый', category: 'ceiling', unit: 'м²', price: 1400, includedIn: ['comfort', 'comfort-plus'], description: 'Потолок с мягким перламутровым блеском.' },
  { id: 'mat-ceiling-gk', slug: 'ceiling-gk', name: 'Гипсокартон с покраской', category: 'ceiling', unit: 'м²', price: 1700, includedIn: ['comfort-plus'], description: 'Многоуровневые конструкции со скрытой подсветкой.' },
  { id: 'mat-tile-ceramic', slug: 'tile-ceramic', name: 'Керамическая плитка', category: 'tile', unit: 'м²', price: 1900, includedIn: ['base', 'comfort', 'comfort-plus'], description: 'Классическая плитка для ванной и кухни.' },
  { id: 'mat-tile-large', slug: 'tile-large', name: 'Керамогранит крупноформатный', category: 'tile', unit: 'м²', price: 2900, includedIn: ['comfort', 'comfort-plus'], description: 'Крупный формат, минимум швов.' },
  { id: 'mat-tile-mosaic', slug: 'tile-mosaic', name: 'Мозаика', category: 'tile', unit: 'м²', price: 3900, includedIn: ['comfort-plus'], description: 'Акцентные поверхности из мозаики.' },
  { id: 'mat-doors-standard', slug: 'doors-standard', name: 'Межкомнатные двери', category: 'doors', unit: 'шт', price: 14000, includedIn: ['base', 'comfort', 'comfort-plus'], description: 'Двери с эмалью и скрытыми петлями.' },
  { id: 'mat-doors-hidden', slug: 'doors-hidden', name: 'Двери скрытого монтажа', category: 'doors', unit: 'шт', price: 28000, includedIn: ['comfort-plus'], description: 'Двери «в стену» с потайным коробом.' },
  { id: 'mat-light-basic', slug: 'light-basic', name: 'Базовый свет', category: 'lighting', unit: 'комплект', price: 18000, includedIn: ['base', 'comfort', 'comfort-plus'], description: 'Встроенные светильники и выключатели.' },
  { id: 'mat-light-track', slug: 'light-track', name: 'Трековые светильники', category: 'lighting', unit: 'комплект', price: 32000, includedIn: ['comfort', 'comfort-plus'], description: 'Акцентное освещение на шинопроводе.' },
  { id: 'mat-light-designer', slug: 'light-designer', name: 'Дизайнерский свет', category: 'lighting', unit: 'комплект', price: 55000, includedIn: ['comfort-plus'], description: 'Авторские светильники и сценарии света.' },
  { id: 'mat-plumb-basic', slug: 'plumb-basic', name: 'Сантехника базовая', category: 'plumbing', unit: 'комплект', price: 45000, includedIn: ['base', 'comfort', 'comfort-plus'], description: 'Смесители, унитаз, душевая система.' },
  { id: 'mat-plumb-premium', slug: 'plumb-premium', name: 'Сантехника премиум', category: 'plumbing', unit: 'комплект', price: 95000, includedIn: ['comfort-plus'], description: 'Дизайнерская сантехника и скрытые инсталляции.' },
];

/* ---------- Кухни ---------- */

const DEFAULT_KITCHENS = [
  { id: 'kit-light', slug: 'kitchen-light', name: 'Светлый минимализм', unit: 'комплект', price: 220000, description: 'Белые фасады без ручек, столешница из кварца, встроенная техника.' },
  { id: 'kit-wood', slug: 'kitchen-wood', name: 'Натуральное дерево', unit: 'комплект', price: 280000, description: 'Фасады из шпона дуба, тёплая подсветка, натуральные материалы.' },
  { id: 'kit-warm', slug: 'kitchen-warm', name: 'Тёплый современный стиль', unit: 'комплект', price: 250000, description: 'Комбинация дерева и матовых фасадов, островная компоновка.' },
  { id: 'kit-contrast', slug: 'kitchen-contrast', name: 'Контрастный современный стиль', unit: 'комплект', price: 310000, description: 'Тёмный низ, светлый верх, металлические акценты и подсветка.' },
];

/* ---------- Дополнительные опции ---------- */

const DEFAULT_OPTIONS = [
  { id: 'opt-warm-floor', slug: 'warm-floor', name: 'Тёплый пол', unit: 'м²', price: 1200, qty: 'area', description: 'Электрический тёплый пол в зонах отдыха.' },
  { id: 'opt-extra-light', slug: 'extra-light', name: 'Дополнительное освещение', unit: 'комплект', price: 45000, qty: 1, description: 'Сценарии света, подсветка ниш и карнизов.' },
  { id: 'opt-storage', slug: 'storage', name: 'Системы хранения', unit: 'комплект', price: 60000, qty: 1, description: 'Гардеробные системы и встроенные шкафы.' },
  { id: 'opt-sound', slug: 'sound', name: 'Шумоизоляция', unit: 'м²', price: 900, qty: 'area', description: 'Шумоизоляция стен и перекрытий.' },
  { id: 'opt-sockets', slug: 'sockets', name: 'Дополнительные электрические точки', unit: 'точка', price: 3500, qty: 10, description: 'Розетки и выводы под технику.' },
  { id: 'opt-furniture', slug: 'furniture', name: 'Комплектация мебелью', unit: 'комплект', price: 150000, qty: 1, description: 'Базовая мебель: кровать, диван, стол.' },
];

/* ---------- Геометрия демонстрационных планировок (SVG) ---------- */

const PLAN_LAYOUTS = {
  studio: [
    { x: 0, y: 0, w: 100, h: 62, label: 'Кухня-гостиная', area: 19 },
    { x: 0, y: 62, w: 34, h: 38, label: 'Санузел', area: 3 },
    { x: 34, y: 62, w: 66, h: 38, label: 'Прихожая', area: 3 },
  ],
  one: [
    { x: 0, y: 0, w: 58, h: 62, label: 'Кухня-гостиная', area: 17 },
    { x: 58, y: 0, w: 42, h: 62, label: 'Спальня', area: 13 },
    { x: 0, y: 62, w: 34, h: 38, label: 'Санузел', area: 3 },
    { x: 34, y: 62, w: 66, h: 38, label: 'Прихожая', area: 3 },
  ],
  'euro-two': [
    { x: 0, y: 0, w: 62, h: 62, label: 'Кухня-гостиная', area: 20 },
    { x: 62, y: 0, w: 38, h: 62, label: 'Спальня', area: 14 },
    { x: 0, y: 62, w: 34, h: 38, label: 'Санузел', area: 4 },
    { x: 34, y: 62, w: 66, h: 38, label: 'Прихожая', area: 4 },
  ],
  two: [
    { x: 0, y: 0, w: 52, h: 62, label: 'Кухня-гостиная', area: 18 },
    { x: 52, y: 0, w: 48, h: 30, label: 'Спальня', area: 13 },
    { x: 52, y: 30, w: 48, h: 32, label: 'Детская', area: 12 },
    { x: 0, y: 62, w: 34, h: 38, label: 'Санузел', area: 4 },
    { x: 34, y: 62, w: 66, h: 38, label: 'Прихожая', area: 4 },
  ],
  three: [
    { x: 0, y: 0, w: 50, h: 62, label: 'Кухня-гостиная', area: 20 },
    { x: 50, y: 0, w: 50, h: 30, label: 'Спальня', area: 14 },
    { x: 50, y: 30, w: 25, h: 32, label: 'Детская', area: 11 },
    { x: 75, y: 30, w: 25, h: 32, label: 'Кабинет', area: 10 },
    { x: 0, y: 62, w: 34, h: 38, label: 'Санузел', area: 5 },
    { x: 34, y: 62, w: 66, h: 38, label: 'Прихожая', area: 5 },
  ],
};

/* ---------- Демо-модель сроков ---------- */

const DURATION_MODEL = {
  baseDays: 30,
  daysPerM2: 0.9,
  packageExtra: { base: 0, comfort: 8, 'comfort-plus': 14 },
  spread: 0.15,
};

/* ---------- Прочие расходы ---------- */

const OTHER_EXPENSES = {
  demolitionPerM2: 800,
  trashPerM2: 350,
  delivery: 25000,
  contingencyRate: 0.05,
};


/* ---------- Застройщики: официальные сайты ---------- */
const _dnsDeveloper = DEFAULT_DEVELOPERS.find((d) => d.id === 'dev-dns');
if (_dnsDeveloper) {
  _dnsDeveloper.description = 'ДОННЕФТЕСТРОЙ — застройщик жилых комплексов в Ростове-на-Дону и Аксае.';
  _dnsDeveloper.sourceUrl = KVADRAT_OFFICIAL_SOURCES.donneftestroy;
}
const _sskDeveloper = DEFAULT_DEVELOPERS.find((d) => d.id === 'dev-ssk');
if (_sskDeveloper) {
  _sskDeveloper.description = 'ССК — застройщик в Ростове-на-Дону, ЖК «Октябрь Парк».';
  _sskDeveloper.sourceUrl = KVADRAT_OFFICIAL_SOURCES.ssk;
}
const _sk10Developer = DEFAULT_DEVELOPERS.find((d) => d.id === 'dev-sk10');
if (_sk10Developer) {
  _sk10Developer.description = 'СК10 — застройщик жилых комплексов в Ростове-на-Дону.';
  _sk10Developer.sourceUrl = KVADRAT_OFFICIAL_SOURCES.sk10Projects;
}

/* Интерьерные картинки — референсы стиля, а не реальные интерьеры объектов. */
DEFAULT_DESIGNS.forEach((design) => {
  design.imageKind = 'interior-reference';
  design.disclaimer = 'Иллюстрация стиля; не является обещанием конкретной комплектации или фотографией квартиры в ЖК.';
});
