/* ============================================================
   КВАДРАТ — точка входа: общая инициализация страниц
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  UI.initCommon(window.PAGE_KEY || '');
  if (typeof Auth !== 'undefined') Auth.init();
});
