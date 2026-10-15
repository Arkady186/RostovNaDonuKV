/* ============================================================
   КВАДРАТ — Демонстрационные данные и модель каталога
   Единый источник данных. Админка сохраняет изменения в
   localStorage поверх этих значений (см. store.js).
   ============================================================ */

const KVADRAT_SCHEMA_VERSION = 2;

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
  arch1: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
  arch2: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
  arch3: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80',
  arch4: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
  arch5: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
  arch6: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80',
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
      'Приоритетный партнёр демонстрационной версии сервиса.',
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

const DEFAULT_COMPLEXES = [
  {
    id: 'cx-op',
    slug: 'oktyabr-park',
    name: 'Октябрь Парк',
    developerId: 'dev-ssk',
    cityId: 'c-rostov',
    class: 'бизнес',
    address: 'Ростов-на-Дону, район Октябрьского парка',
    year: 2026,
    floors: '9–17',
    description:
      'Жилой комплекс бизнес-класса в зелёной зоне города: закрытая территория, ' +
      'собственный бульвар, подземный паркинг и квартиры с панорамным остеклением. ' +
      'Приоритетный объект демонстрационной версии сервиса.',
    image: IMG.arch1,
    gallery: [IMG.arch1, IMG.interior1, IMG.interior2, IMG.arch2],
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
    class: 'комфорт',
    address: 'Ростов-на-Дону, северный жилой район',
    year: 2025,
    floors: '12–18',
    description:
      'Современный квартал с собственным двором без машин, детскими площадками ' +
      'и квартирами с продуманными планировками.',
    image: IMG.arch3,
    gallery: [IMG.arch3, IMG.interior3, IMG.interior4, IMG.arch4],
    priority: false,
    demo: true,
    published: true,
  },
  {
    id: 'cx-sezony',
    slug: 'sezony',
    name: 'Сезоны',
    developerId: 'dev-sk10',
    cityId: 'c-rostov',
    class: 'комфорт',
    address: 'Ростов-на-Дону, левобережная зона',
    year: 2026,
    floors: '10–16',
    description:
      'Жилой комплекс с ландшафтным парком и видовыми квартирами. ' +
      'Демонстрационная запись каталога.',
    image: IMG.arch4,
    gallery: [IMG.arch4, IMG.interior5, IMG.interior6, IMG.arch5],
    priority: false,
    demo: true,
    published: true,
  },
  {
    id: 'cx-kultura',
    slug: 'kultura',
    name: 'Культура',
    developerId: 'dev-sk10',
    cityId: 'c-rostov',
    class: 'комфорт',
    address: 'Ростов-на-Дону, центр',
    year: 2025,
    floors: '8–14',
    description:
      'Камерный комплекс в центральной части города с кирпичной архитектурой ' +
      'и квартирами с высокими потолками. Демонстрационная запись каталога.',
    image: IMG.arch5,
    gallery: [IMG.arch5, IMG.interior7, IMG.interior8, IMG.arch6],
    priority: false,
    demo: true,
    published: true,
  },
  {
    id: 'cx-greenside',
    slug: 'greenside',
    name: 'Гринсайд',
    developerId: 'dev-sk10',
    cityId: 'c-rostov',
    class: 'бизнес',
    address: 'Ростов-на-Дону, западный жилой район',
    year: 2027,
    floors: '9–15',
    description:
      'Комплекс с зелёным бульваром, клубным домом и квартирами с террасами. ' +
      'Демонстрационная запись каталога.',
    image: IMG.arch6,
    gallery: [IMG.arch6, IMG.interior9, IMG.interior10, IMG.arch1],
    priority: false,
    demo: true,
    published: true,
  },
  {
    id: 'cx-malina',
    slug: 'malina-park',
    name: 'Малина Парк',
    developerId: 'dev-sk10',
    cityId: 'c-rostov',
    class: 'комфорт',
    address: 'Ростов-на-Дону, северный жилой район',
    year: 2026,
    floors: '12–20',
    description:
      'Масштабный квартал с собственной инфраструктурой: школы, детские сады, ' +
      'торговые галереи. Демонстрационная запись каталога.',
    image: IMG.arch2,
    gallery: [IMG.arch2, IMG.interior11, IMG.interior12, IMG.arch3],
    priority: false,
    demo: true,
    published: true,
  },
  {
    id: 'cx-rechnoy',
    slug: 'rechnoy',
    name: 'Речной',
    developerId: 'dev-dns',
    cityId: 'c-rostov',
    class: 'комфорт',
    address: 'Ростов-на-Дону, набережная зона',
    year: 2026,
    floors: '10–16',
    description:
      'Демонстрационная запись каталога. Данные о комплексе не подтверждены ' +
      'и используются только для проверки работы сервиса.',
    image: IMG.arch2,
    gallery: [IMG.arch2, IMG.interior13, IMG.interior14, IMG.arch4],
    priority: false,
    demo: true,
    published: true,
  },
];

/* ---------- Квартиры (демонстрационные планировки) ---------- */

const DEFAULT_APARTMENTS = [
  { id: 'apt-op-01', complexId: 'cx-op', type: 'studio', area: 25, rooms: 1, published: true, description: 'Компактная студия с объединённой кухней-гостиной и полноценным санузлом.' },
  { id: 'apt-op-02', complexId: 'cx-op', type: 'one', area: 36, rooms: 2, published: true, description: 'Однокомнатная квартира с отдельной спальней и кухней-гостиной.' },
  { id: 'apt-op-03', complexId: 'cx-op', type: 'euro-two', area: 42, rooms: 2, published: true, description: 'Евродвушка: просторная кухня-гостиная и изолированная спальня.' },
  { id: 'apt-op-04', complexId: 'cx-op', type: 'two', area: 55, rooms: 3, published: true, description: 'Двухкомнатная квартира с двумя изолированными комнатами.' },
  { id: 'apt-op-05', complexId: 'cx-op', type: 'three', area: 68, rooms: 4, published: true, description: 'Трёхкомнатная квартира с гардеробной и просторной гостиной.' },
  { id: 'apt-ks-01', complexId: 'cx-kosmos', type: 'studio', area: 24, rooms: 1, published: true, description: 'Светлая студия с эркером и зонированием.' },
  { id: 'apt-ks-02', complexId: 'cx-kosmos', type: 'one', area: 34, rooms: 2, published: true, description: 'Однокомнатная квартира с кухней-гостиной.' },
  { id: 'apt-ks-03', complexId: 'cx-kosmos', type: 'two', area: 52, rooms: 3, published: true, description: 'Двухкомнатная квартира с двумя спальнями.' },
  { id: 'apt-sz-01', complexId: 'cx-sezony', type: 'one', area: 35, rooms: 2, published: true, description: 'Однокомнатная квартира с видом на парк.' },
  { id: 'apt-sz-02', complexId: 'cx-sezony', type: 'euro-two', area: 41, rooms: 2, published: true, description: 'Евродвушка с панорамным остеклением.' },
  { id: 'apt-kl-01', complexId: 'cx-kultura', type: 'two', area: 54, rooms: 3, published: true, description: 'Двухкомнатная квартира с высокими потолками.' },
  { id: 'apt-kl-02', complexId: 'cx-kultura', type: 'three', area: 66, rooms: 4, published: true, description: 'Трёхкомнатная квартира в кирпичном доме.' },
  { id: 'apt-gs-01', complexId: 'cx-greenside', type: 'one', area: 33, rooms: 2, published: true, description: 'Однокомнатная квартира с террасой.' },
  { id: 'apt-gs-02', complexId: 'cx-greenside', type: 'two', area: 50, rooms: 3, published: true, description: 'Двухкомнатная квартира с двумя санузлами.' },
  { id: 'apt-ml-01', complexId: 'cx-malina', type: 'studio', area: 26, rooms: 1, published: true, description: 'Студия с большой кухней-гостиной.' },
  { id: 'apt-ml-02', complexId: 'cx-malina', type: 'one', area: 37, rooms: 2, published: true, description: 'Однокомнатная квартира с гардеробной.' },
  { id: 'apt-rn-01', complexId: 'cx-rechnoy', type: 'one', area: 35, rooms: 2, published: true, description: 'Демонстрационная планировка однокомнатной квартиры.' },
  { id: 'apt-rn-02', complexId: 'cx-rechnoy', type: 'two', area: 53, rooms: 3, published: true, description: 'Демонстрационная планировка двухкомнатной квартиры.' },
];

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
    id: 'ds-scandinavian',
    slug: 'scandinavian',
    name: 'Scandinavian',
    style: 'Скандинавский',
    packageLevel: 'base',
    priceLevel: 'Экономный',
    description:
      'Светлый скандинавский интерьер: белые стены, деревянные полы, функциональная ' +
      'мебель и много естественного света. Идеален для небольших квартир.',
    image: IMG.interior4,
    gallery: [IMG.interior4, IMG.interior5, IMG.bedroom1, IMG.kitchen2],
    palette: ['#FBF9F4', '#E4E0D6', '#A8A294', '#5B5F54'],
    materials: ['Сосна', 'Хлопок', 'Керамика', 'Сталь'],
    suitableTypes: ['studio', 'one'],
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
    packageLevel: 'premium',
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
    packageLevel: 'premium',
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
    id: 'pkg-premium',
    slug: 'premium',
    name: 'Премиум',
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
  { id: 'mat-floor-laminate', slug: 'laminate', name: 'Ламинат 33 класс', category: 'floor', unit: 'м²', price: 1800, includedIn: ['base', 'comfort', 'premium'], description: 'Практичное напольное покрытие с фактурой дерева.' },
  { id: 'mat-floor-parquet', slug: 'parquet', name: 'Паркетная доска', category: 'floor', unit: 'м²', price: 4200, includedIn: ['comfort', 'premium'], description: 'Натуральное дерево, тёплая поверхность.' },
  { id: 'mat-floor-keramogranit', slug: 'keramogranit', name: 'Керамогранит', category: 'floor', unit: 'м²', price: 2600, includedIn: ['comfort', 'premium'], description: 'Износостойкий материал для прихожей и кухни.' },
  { id: 'mat-floor-engineered', slug: 'engineered', name: 'Инженерная доска', category: 'floor', unit: 'м²', price: 5600, includedIn: ['premium'], description: 'Премиальное покрытие из массива ценных пород.' },
  { id: 'mat-walls-paint', slug: 'paint', name: 'Краска', category: 'walls', unit: 'м²', price: 700, includedIn: ['base', 'comfort', 'premium'], description: 'Матовая интерьерная краска, широкая палитра.' },
  { id: 'mat-walls-wallpaper', slug: 'wallpaper', name: 'Обои', category: 'walls', unit: 'м²', price: 1100, includedIn: ['comfort', 'premium'], description: 'Флизелиновые обои с фактурой.' },
  { id: 'mat-walls-plaster', slug: 'plaster', name: 'Декоративная штукатурка', category: 'walls', unit: 'м²', price: 2400, includedIn: ['premium'], description: 'Фактурное покрытие с эффектом камня.' },
  { id: 'mat-walls-microcement', slug: 'microcement', name: 'Микроцемент', category: 'walls', unit: 'м²', price: 3400, includedIn: ['premium'], description: 'Бесшовное покрытие в современном стиле.' },
  { id: 'mat-ceiling-matte', slug: 'ceiling-matte', name: 'Натяжной матовый', category: 'ceiling', unit: 'м²', price: 1100, includedIn: ['base', 'comfort', 'premium'], description: 'Ровный матовый потолок.' },
  { id: 'mat-ceiling-satin', slug: 'ceiling-satin', name: 'Натяжной сатиновый', category: 'ceiling', unit: 'м²', price: 1400, includedIn: ['comfort', 'premium'], description: 'Потолок с мягким перламутровым блеском.' },
  { id: 'mat-ceiling-gk', slug: 'ceiling-gk', name: 'Гипсокартон с покраской', category: 'ceiling', unit: 'м²', price: 1700, includedIn: ['premium'], description: 'Многоуровневые конструкции со скрытой подсветкой.' },
  { id: 'mat-tile-ceramic', slug: 'tile-ceramic', name: 'Керамическая плитка', category: 'tile', unit: 'м²', price: 1900, includedIn: ['base', 'comfort', 'premium'], description: 'Классическая плитка для ванной и кухни.' },
  { id: 'mat-tile-large', slug: 'tile-large', name: 'Керамогранит крупноформатный', category: 'tile', unit: 'м²', price: 2900, includedIn: ['comfort', 'premium'], description: 'Крупный формат, минимум швов.' },
  { id: 'mat-tile-mosaic', slug: 'tile-mosaic', name: 'Мозаика', category: 'tile', unit: 'м²', price: 3900, includedIn: ['premium'], description: 'Акцентные поверхности из мозаики.' },
  { id: 'mat-doors-standard', slug: 'doors-standard', name: 'Межкомнатные двери', category: 'doors', unit: 'шт', price: 14000, includedIn: ['base', 'comfort', 'premium'], description: 'Двери с эмалью и скрытыми петлями.' },
  { id: 'mat-doors-hidden', slug: 'doors-hidden', name: 'Двери скрытого монтажа', category: 'doors', unit: 'шт', price: 28000, includedIn: ['premium'], description: 'Двери «в стену» с потайным коробом.' },
  { id: 'mat-light-basic', slug: 'light-basic', name: 'Базовый свет', category: 'lighting', unit: 'комплект', price: 18000, includedIn: ['base', 'comfort', 'premium'], description: 'Встроенные светильники и выключатели.' },
  { id: 'mat-light-track', slug: 'light-track', name: 'Трековые светильники', category: 'lighting', unit: 'комплект', price: 32000, includedIn: ['comfort', 'premium'], description: 'Акцентное освещение на шинопроводе.' },
  { id: 'mat-light-designer', slug: 'light-designer', name: 'Дизайнерский свет', category: 'lighting', unit: 'комплект', price: 55000, includedIn: ['premium'], description: 'Авторские светильники и сценарии света.' },
  { id: 'mat-plumb-basic', slug: 'plumb-basic', name: 'Сантехника базовая', category: 'plumbing', unit: 'комплект', price: 45000, includedIn: ['base', 'comfort', 'premium'], description: 'Смесители, унитаз, душевая система.' },
  { id: 'mat-plumb-premium', slug: 'plumb-premium', name: 'Сантехника премиум', category: 'plumbing', unit: 'комплект', price: 95000, includedIn: ['premium'], description: 'Дизайнерская сантехника и скрытые инсталляции.' },
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
  packageExtra: { base: 0, comfort: 8, premium: 14 },
  spread: 0.15,
};

/* ---------- Прочие расходы ---------- */

const OTHER_EXPENSES = {
  demolitionPerM2: 800,
  trashPerM2: 350,
  delivery: 25000,
  contingencyRate: 0.05,
};


/* ---------- Проверенные источники и публикация ---------- */
/* Факты о ЖК берём только с сайтов застройщиков. Фотографии сторонних
   интерьерных референсов не должны выдаваться за фотографии самого ЖК. */
const KVADRAT_SOURCE_AUDIT_DATE = '2026-10-15';
const KVADRAT_OFFICIAL_SOURCES = {
  ssk: 'https://sskuban.ru/rostov-na-donu/',
  oktyabrPark: 'https://oktyabrskiipark.ru/',
  sk10Projects: 'https://sk10.ru/projects',
  kosmos: 'https://sk10.ru/projects/zhk-kosmos',
  sezony: 'https://sk10.ru/projects/zhk-sezony',
  kultura: 'https://sk10.ru/projects/zhk-kultura',
  greenside: 'https://sk10.ru/projects/zhk-grinsajd',
  malina: 'https://sk10.ru/projects/zhk-malina-park',
  donneftestroy: 'https://xn--d1acaqraferjjcw.xn--p1ai/projects',
  panorama: 'https://xn--d1acaqraferjjcw.xn--p1ai/projects/panorama-na-teatralnom',
};

const KVADRAT_OFFICIAL_PHOTOS = {
  oktyabrPark: 'https://img1.creatium.ru/disk2/2a/3b/da/03faf78067ece3d201384444331345e52f/01jn0qz7z45vma0s99zhbw0gzc.jpg',
  kosmos: 'https://sk10.ru/m/p/kosmos/curated/8e0f1df5fae70533baf310c644a9af82.webp',
  kultura: 'https://sk10.ru/m/p/pg/gl/e351119ea4d48905b6421319ce690e8f063f056d.webp',
  greenside: 'https://sk10.ru/m/p/pg/gl/45b8753cfae48e3b44a104a01101b17991a1afa0.webp',
  panorama: 'https://img.xn--d1acaqraferjjcw.xn--p1ai/rs%3Afill%3A1920%3A980%3A0/plain/production/adca2fee3f3d9eb0c203a988173b5c8c46371.jpg',
  sezony: 'https://sk10.ru/m/p/pg/gl/90565805b73415f2dd0e52accfbb1845eb957e39.webp',
  malina: 'https://sk10.ru/m/p/pg/gl/f2fd5940e5e42120263178327b93daf0cb53b2f3.webp',
};

function kvadratSetVerifiedComplex(id, facts) {
  const item = DEFAULT_COMPLEXES.find((c) => c.id === id);
  if (item) Object.assign(item, facts);
}

kvadratSetVerifiedComplex('cx-op', {
  name: 'Октябрь Парк',
  class: 'комфорт+',
  address: 'Ростов-на-Дону, ул. Таганрогская, 132/4',
  year: '',
  floors: '',
  description: 'Жилой комплекс ССК в Октябрьском районе Ростова-на-Дону. Актуальные корпуса, планировки, цены и сроки следует уточнять на официальном сайте застройщика.',
  sourceUrl: KVADRAT_OFFICIAL_SOURCES.oktyabrPark,
  sourceName: 'Официальный сайт ЖК «Октябрь Парк»',
  image: KVADRAT_OFFICIAL_PHOTOS.oktyabrPark,
  gallery: [KVADRAT_OFFICIAL_PHOTOS.oktyabrPark],
  imageKind: 'official',
  demo: false,
  published: true,
});
kvadratSetVerifiedComplex('cx-kosmos', {
  address: 'Ростов-на-Дону, ул. Красноармейская, 250',
  class: 'бизнес-класс',
  year: '',
  floors: 'до 24 этажей',
  description: 'ЖК «Космос» от СК10. По официальной странице проекта дом сдан; наличие квартир, цены и характеристики конкретных лотов проверяйте у застройщика.',
  sourceUrl: KVADRAT_OFFICIAL_SOURCES.kosmos,
  sourceName: 'Официальный сайт СК10',
  image: KVADRAT_OFFICIAL_PHOTOS.kosmos,
  gallery: [KVADRAT_OFFICIAL_PHOTOS.kosmos],
  imageKind: 'official',
  demo: false,
});
kvadratSetVerifiedComplex('cx-kultura', {
  address: 'Ростов-на-Дону, ул. Текучёва, 205',
  class: '',
  year: '',
  floors: '19–25 этажей',
  description: 'ЖК «Культура» от СК10. Данные о сроках, доступных квартирах и ценах могут меняться — сверяйте их на официальной странице проекта.',
  sourceUrl: KVADRAT_OFFICIAL_SOURCES.kultura,
  sourceName: 'Официальный сайт СК10',
  image: KVADRAT_OFFICIAL_PHOTOS.kultura,
  gallery: [KVADRAT_OFFICIAL_PHOTOS.kultura],
  imageKind: 'official',
  demo: false,
});
kvadratSetVerifiedComplex('cx-greenside', {
  address: 'Ростов-на-Дону, ул. Нансена, 109',
  class: '',
  year: '',
  floors: 'до 25 этажей',
  description: 'ЖК «Гринсайд» от СК10. Информация о корпусах, сроках и наличии квартир различается по очередям; актуальные сведения — на сайте застройщика.',
  sourceUrl: KVADRAT_OFFICIAL_SOURCES.greenside,
  sourceName: 'Официальный сайт СК10',
  image: KVADRAT_OFFICIAL_PHOTOS.greenside,
  gallery: [KVADRAT_OFFICIAL_PHOTOS.greenside],
  imageKind: 'official',
  demo: false,
});
kvadratSetVerifiedComplex('cx-sezony', {
  address: 'Ростов-на-Дону, бульвар Платова, 14',
  class: '',
  year: '',
  floors: '9 этажей',
  description: 'ЖК «Сезоны» от СК10. Актуальные сроки, корпуса и доступность квартир необходимо сверять с официальной страницей застройщика.',
  sourceUrl: KVADRAT_OFFICIAL_SOURCES.sezony,
  sourceName: 'Официальный сайт СК10',
  image: KVADRAT_OFFICIAL_PHOTOS.sezony,
  imageKind: 'official',
  gallery: [KVADRAT_OFFICIAL_PHOTOS.sezony],
  demo: false,
});
kvadratSetVerifiedComplex('cx-malina', {
  address: 'Ростов-на-Дону, район пересечения улиц Малиновского, Доватора и Еременко',
  class: '',
  year: '',
  floors: 'до 25 этажей',
  description: 'ЖК «Малина Парк» от СК10. Подробные характеристики, корпуса и доступные квартиры смотрите в официальном каталоге застройщика.',
  sourceUrl: KVADRAT_OFFICIAL_SOURCES.malina,
  sourceName: 'Официальный сайт СК10',
  image: KVADRAT_OFFICIAL_PHOTOS.malina,
  imageKind: 'official',
  gallery: [KVADRAT_OFFICIAL_PHOTOS.malina],
  demo: false,
});

/* Вместо вымышленного «Речного» показываем реальный проект ДОННЕФТЕСТРОЯ. */
kvadratSetVerifiedComplex('cx-rechnoy', {
  slug: 'panorama-na-teatralnom',
  name: 'Панорама на Театральном',
  class: 'бизнес-класс',
  address: 'Ростов-на-Дону, Театральный проспект, 62',
  year: '',
  floors: '25',
  description: 'Жилой комплекс бизнес-класса от ДОННЕФТЕСТРОЯ. На официальной странице опубликованы варианты планировок; стоимость и наличие конкретной квартиры необходимо уточнять у застройщика.',
  sourceUrl: KVADRAT_OFFICIAL_SOURCES.panorama,
  sourceName: 'Официальный сайт ДОННЕФТЕСТРОЯ',
  image: KVADRAT_OFFICIAL_PHOTOS.panorama,
  gallery: [KVADRAT_OFFICIAL_PHOTOS.panorama],
  imageKind: 'official',
  demo: false,
});
const _dnsDeveloper = DEFAULT_DEVELOPERS.find((d) => d.id === 'dev-dns');
if (_dnsDeveloper) {
  _dnsDeveloper.description = 'ДОННЕФТЕСТРОЙ — застройщик жилых комплексов в Ростове-на-Дону и Аксае.';
  _dnsDeveloper.sourceUrl = KVADRAT_OFFICIAL_SOURCES.donneftestroy;
}
const _sskDeveloper = DEFAULT_DEVELOPERS.find((d) => d.id === 'dev-ssk');
if (_sskDeveloper) {
  _sskDeveloper.description = 'Официальный каталог ССК в Ростове-на-Дону. Характеристики и наличие квартир сверяйте у застройщика.';
  _sskDeveloper.sourceUrl = KVADRAT_OFFICIAL_SOURCES.ssk;
}
const _sk10Developer = DEFAULT_DEVELOPERS.find((d) => d.id === 'dev-sk10');
if (_sk10Developer) {
  _sk10Developer.description = 'Официальный каталог проектов СК10 в Ростове-на-Дону.';
  _sk10Developer.sourceUrl = KVADRAT_OFFICIAL_SOURCES.sk10Projects;
}

/* Все макеты квартир в исходном архиве были нарисованными SVG-заглушками,
   а не планировками застройщиков. Сохраняем их в админке как черновики,
   но не публикуем посетителям до замены на подтверждённые планы. */
DEFAULT_APARTMENTS.forEach((apartment) => {
  apartment.published = false;
  apartment.dataStatus = 'draft-unverified';
  apartment.sourceUrl = null;
});

/* Отмечаем интерьерные картинки как референсы, а не реальные интерьеры объектов. */
DEFAULT_DESIGNS.forEach((design) => {
  design.imageKind = 'interior-reference';
  design.disclaimer = 'Иллюстрация стиля; не является обещанием конкретной комплектации или фотографией квартиры в ЖК.';
});
