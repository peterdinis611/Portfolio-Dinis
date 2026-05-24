/**
 * Jazyk, téma a helpery — volané z game.js
 */
(function () {
  'use strict';

  const STORAGE_LANG = 'pixelPortfolioLang';
  const STORAGE_THEME = 'pixelPortfolioTheme';

  let lang = localStorage.getItem(STORAGE_LANG) || 'sk';
  let theme = localStorage.getItem(STORAGE_THEME) || 'light';

  function t(key) {
    const pack = window.GameData.i18n[lang];
    return (pack && pack[key]) || window.GameData.i18n.en[key] || key;
  }

  function getPortfolio() {
    const p = window.GameData.portfolio[lang];
    return {
      ...p,
      photo: window.GameData.photo,
      projects: p.projects.map((proj) => ({
        ...proj,
        thumb: window.GameData.makeProjectThumb(proj.name, proj.accent)
      }))
    };
  }

  function getLevels() {
    const isNight = theme === 'dark';
    const src = isNight ? window.GameData.levelsNight : window.GameData.levels;
    return src[lang] || src.sk;
  }

  function getIntroName() {
    return window.GameData.introName;
  }

  function isNight() {
    return theme === 'dark';
  }

  function setLang(next) {
    if (next !== 'sk' && next !== 'en') return;
    lang = next;
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = lang;
    if (window.GameUI) window.GameUI.applyTexts();
  }

  function setTheme(next) {
    if (next !== 'light' && next !== 'dark') return;
    theme = next;
    localStorage.setItem(STORAGE_THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (window.GameUI) window.GameUI.applyTexts();
  }

  function getLang() { return lang; }
  function getTheme() { return theme; }

  window.GameConfig = {
    t, getPortfolio, getLevels, getIntroName, isNight,
    setLang, setTheme, getLang, getTheme
  };

  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-theme', theme);
})();
