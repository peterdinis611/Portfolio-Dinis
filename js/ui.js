/**
 * UI texty, jazyk a téma
 */
(function () {
  'use strict';

  const { t, setLang, setTheme, getLang, getTheme, getPortfolio } = window.GameConfig;

  const els = {
    introSub: document.getElementById('intro-sub'),
    loadText: document.getElementById('load-text'),
    introStart: document.getElementById('intro-start'),
    charSelectLabel: document.getElementById('char-select-label'),
    charWalker: document.querySelector('[data-mode="walker"]'),
    charCar: document.querySelector('[data-mode="car"]'),
    langSk: document.getElementById('lang-sk'),
    langEn: document.getElementById('lang-en'),
    themeLight: document.getElementById('theme-light'),
    themeDark: document.getElementById('theme-dark'),
    modalAboutTitle: document.getElementById('about-title'),
    modalContactTitle: document.getElementById('contact-title'),
    modalCloses: document.querySelectorAll('.modal-close'),
    projectLive: document.getElementById('project-live'),
    projectGithub: document.getElementById('project-github'),
    contactSubmit: document.querySelector('#contact-form button[type="submit"]'),
    cfName: document.querySelector('label[for="cf-name"]'),
    cfEmail: document.querySelector('label[for="cf-email"]'),
    cfMessage: document.querySelector('label[for="cf-message"]'),
    endMsg: document.getElementById('end-msg'),
    endSub: document.getElementById('end-sub'),
    endCta: document.getElementById('end-cta'),
    endReplay: document.getElementById('end-replay'),
    interactBtn: document.getElementById('interact-btn')
  };

  function applyTexts() {
    if (els.introSub) els.introSub.textContent = getPortfolio().title;
    if (els.introStart) els.introStart.textContent = t('startBtn');
    if (els.charSelectLabel) els.charSelectLabel.textContent = t('charSelect');
    const walkerLabel = els.charWalker?.querySelector('.char-label');
    if (walkerLabel) walkerLabel.textContent = t('walker');
    const carLabel = els.charCar?.querySelector('.char-label');
    if (carLabel) carLabel.textContent = t('car');
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (key) el.textContent = t(key);
    });
    if (els.modalAboutTitle) els.modalAboutTitle.textContent = t('modalAbout');
    if (els.modalContactTitle) els.modalContactTitle.textContent = t('modalContact');
    els.modalCloses.forEach((btn) => { btn.setAttribute('aria-label', t('modalClose')); });
    if (els.projectLive) els.projectLive.textContent = t('viewLive');
    if (els.projectGithub) els.projectGithub.textContent = t('github');
    if (els.contactSubmit) els.contactSubmit.textContent = t('send');
    if (els.cfName) els.cfName.textContent = t('name');
    if (els.cfEmail) els.cfEmail.textContent = t('email');
    if (els.cfMessage) els.cfMessage.textContent = t('message');
    if (els.endMsg) els.endMsg.innerHTML = t('endTitle');
    if (els.endSub) els.endSub.textContent = t('endSub');
    if (els.endCta) els.endCta.textContent = t('endContact');
    if (els.endReplay) els.endReplay.textContent = t('endReplay');
    document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.themeBtn === getTheme());
      btn.setAttribute('aria-pressed', btn.dataset.themeBtn === getTheme() ? 'true' : 'false');
    });
    document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.langBtn === getLang());
      btn.setAttribute('aria-pressed', btn.dataset.langBtn === getLang() ? 'true' : 'false');
    });

    if (window.gameRefreshInteractables) window.gameRefreshInteractables();
    if (window.gameHudUpdate) window.gameHudUpdate();
  }

  document.getElementById('lang-sk')?.addEventListener('click', () => setLang('sk'));
  document.getElementById('lang-en')?.addEventListener('click', () => setLang('en'));
  document.getElementById('theme-light')?.addEventListener('click', () => setTheme('light'));
  document.getElementById('theme-dark')?.addEventListener('click', () => setTheme('dark'));

  window.GameUI = { applyTexts };
  applyTexts();
})();
