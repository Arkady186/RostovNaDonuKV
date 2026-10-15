/* ============================================================
   КВАДРАТ — EstimateService
   Централизованный модуль расчёта предварительной сметы.

   Модель:
   Стоимость = площадь × ставка работ
             + площадь × ставка черновых материалов
             + чистовые материалы (по выбранным категориям)
             + кухня
             + дополнительные опции
             + прочие расходы (демонтаж, вывоз, доставка, резерв)
   ============================================================ */

const Estimate = (() => {
  function fmt(n) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n));
  }

  /* Количество материала по категории и площади квартиры */
  function quantityFor(material, apartment) {
    const area = apartment.area;
    switch (material.category) {
      case 'floor':
        return Math.round(area * 1.05);
      case 'walls':
        return Math.round(area * 2.6);
      case 'ceiling':
        return Math.round(area * 1.0);
      case 'tile':
        return Math.round(area * 0.55);
      case 'doors':
        return apartment.rooms + 1;
      default:
        return 1;
    }
  }

  function optionQuantity(option, area) {
    return option.qty === 'area' ? Math.round(area) : option.qty;
  }

  /* Полный расчёт по конфигурации */
  function calculate(config) {
    const catalog = Store.getCatalog();
    const apartment = catalog.apartments.find((a) => a.id === config.apartmentId && a.published) ||
      (config.apartmentId === 'custom-area' && Number(config.customArea) >= 15 && Number(config.customArea) <= 300
        ? {
            id: 'custom-area',
            area: Number(config.customArea),
            rooms: Number(config.customRooms) || 2,
            type: config.customType || 'one',
            description: 'Предварительный расчёт по введённой площади без подтверждённой планировки',
            dataStatus: 'estimate-only',
          }
        : null);
    const design = catalog.designs.find((d) => d.id === config.designId);
    const pkg = catalog.packages.find((p) => p.id === config.packageId);
    const kitchen = catalog.kitchens.find((k) => k.id === config.kitchenId);

    if (!apartment || !pkg) return null;

    const area = apartment.area;
    const groups = [];
    let total = 0;

    /* 1. Работы */
    const works = Math.round(area * pkg.worksRate);
    groups.push({
      group: 'Работы',
      rows: [
        {
          label: `Отделочные работы — комплектация «${pkg.name}»`,
          note: `${area} м² × ${fmt(pkg.worksRate)} ₽`,
          value: works,
        },
      ],
    });
    total += works;

    /* 2. Черновые материалы */
    const rough = Math.round(area * pkg.roughRate);
    groups.push({
      group: 'Черновые материалы',
      rows: [
        {
          label: 'Стяжка, штукатурка, электрика, сантехразводка',
          note: `${area} м² × ${fmt(pkg.roughRate)} ₽`,
          value: rough,
        },
      ],
    });
    total += rough;

    /* 3. Чистовые материалы */
    const finishRows = [];
    let finishTotal = 0;
    for (const cat of MATERIAL_CATEGORIES) {
      const matId = config.materials[cat.key];
      if (!matId) continue;
      const mat = catalog.materials.find((m) => m.id === matId);
      if (!mat) continue;
      const qty = quantityFor(mat, apartment);
      const included = (mat.includedIn || []).includes(pkg.slug);
      const cost = included ? 0 : Math.round(qty * mat.price);
      finishTotal += cost;
      finishRows.push({
        label: mat.name,
        note: included
          ? `${qty} ${mat.unit} — включено в комплектацию`
          : `${qty} ${mat.unit} × ${fmt(mat.price)} ₽`,
        value: cost,
        included,
      });
    }
    groups.push({ group: 'Чистовые материалы', rows: finishRows });
    total += finishTotal;

    /* 4. Кухня */
    if (kitchen) {
      groups.push({
        group: 'Кухня',
        rows: [{ label: kitchen.name, note: 'Комплект с техникой и столешницей', value: kitchen.price }],
      });
      total += kitchen.price;
    }

    /* 5. Дополнительные опции */
    const optRows = [];
    let optTotal = 0;
    for (const optId of config.options || []) {
      const opt = catalog.options.find((o) => o.id === optId);
      if (!opt) continue;
      const qty = optionQuantity(opt, area);
      const cost = Math.round(qty * opt.price);
      optTotal += cost;
      optRows.push({
        label: opt.name,
        note: `${qty} ${opt.unit} × ${fmt(opt.price)} ₽`,
        value: cost,
      });
    }
    groups.push({ group: 'Дополнительные опции', rows: optRows });
    total += optTotal;

    /* 6. Другие расходы */
    const demolition = Math.round(area * OTHER_EXPENSES.demolitionPerM2);
    const trash = Math.round(area * OTHER_EXPENSES.trashPerM2);
    const delivery = OTHER_EXPENSES.delivery;
    const baseForReserve = works + rough + finishTotal + (kitchen ? kitchen.price : 0) + optTotal;
    const contingency = Math.round(baseForReserve * OTHER_EXPENSES.contingencyRate);
    groups.push({
      group: 'Другие расходы',
      rows: [
        { label: 'Демонтаж и подготовка', note: `${area} м² × ${fmt(OTHER_EXPENSES.demolitionPerM2)} ₽`, value: demolition },
        { label: 'Вывоз мусора', note: `${area} м² × ${fmt(OTHER_EXPENSES.trashPerM2)} ₽`, value: trash },
        { label: 'Доставка и подъём материалов', note: 'Фиксированная сумма', value: delivery },
        { label: 'Непредвиденные расходы', note: '5% от суммы работ и материалов', value: contingency },
      ],
    });
    total += demolition + trash + delivery + contingency;

    const perM2 = Math.round(total / area);

    /* Демо-модель сроков */
    const days = Math.round(
      DURATION_MODEL.baseDays +
        area * DURATION_MODEL.daysPerM2 +
        (DURATION_MODEL.packageExtra[pkg.slug] || 0)
    );
    const spread = Math.max(5, Math.round(days * DURATION_MODEL.spread));
    const durationText = `${days - spread}–${days + spread} дней`;

    return {
      groups,
      total,
      perM2,
      durationText,
      days,
      area,
      apartment,
      design,
      pkg,
      kitchen,
    };
  }

  return { calculate, quantityFor, optionQuantity };
})();
