(function () {
  "use strict";

  const DATA = window.PHISHGUARD_DATA;
  const Scoring = window.PhishGuardScoring;
  const SUPPORTED_LANGS = new Set(DATA.supportedLangs || ["es", "en"]);
  const appRoot = document.getElementById("app");
  const headerRoot = document.getElementById("site-header");
  const footerRoot = document.getElementById("site-footer");
  const BASE_PATH = getBasePath();
  const SECTION_TARGETS = new Set(["hero", "what-is-phishing", "scenarios", "resources", "ethics"]);

  function getBasePath() {
    const path = window.location.pathname;

    if (path.includes("/index.html")) {
      return path.slice(0, path.indexOf("/index.html") + 1) || "/";
    }

    if (path === "/web" || path.startsWith("/web/")) return "/web/";

    if (window.location.hostname.endsWith("github.io")) {
      const firstSegment = path.split("/").filter(Boolean)[0];
      return firstSegment ? `/${firstSegment}/` : "/";
    }

    return "/";
  }

  function basePathWithoutTrailingSlash() {
    return BASE_PATH === "/" ? "" : BASE_PATH.replace(/\/$/, "");
  }

  function shouldUseHashRouting() {
    const host = window.location.hostname;
    return BASE_PATH === "/web/" && window.location.port === "5500" && (host === "127.0.0.1" || host === "localhost");
  }

  function assetUrl(path) {
    return `${BASE_PATH}${String(path).replace(/^\/+/, "")}`;
  }

  function normalizeRoutePath(route) {
    const value = String(route || "/").replace(/^#\/?/, "/");
    if (!value || value === "#") return "/";
    return value.startsWith("/") ? value : `/${value}`;
  }

  function routeToUrl(route, search = window.location.search) {
    const normalizedRoute = normalizeRoutePath(route);
    const base = basePathWithoutTrailingSlash();
    if (shouldUseHashRouting() && normalizedRoute !== "/") {
      return `${base || ""}/${search || ""}#${normalizedRoute}`;
    }
    return `${base}${normalizedRoute === "/" ? "/" : normalizedRoute}${search || ""}`;
  }

  function sectionUrl(sectionId, search = window.location.search) {
    return `${routeToUrl("/", search)}#${encodeURIComponent(sectionId)}`;
  }

  function getSectionHash() {
    if (!window.location.hash) return null;
    const raw = decodeURIComponent(window.location.hash.slice(1).split("?")[0]);
    return SECTION_TARGETS.has(raw) ? raw : null;
  }

  function getLegacyHashRoute() {
    if (!window.location.hash) return null;
    const hash = window.location.hash.slice(1);
    if (!hash.startsWith("/")) return null;
    const raw = hash.replace(/^\/?/, "");
    if (!raw) return "/";
    return normalizeRoutePath(raw.split("?")[0]);
  }

  function normalizeInitialUrl() {
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get("redirect");
    const sectionHash = getSectionHash();
    const legacyHashRoute = getLegacyHashRoute();

    if (redirect) {
      url.searchParams.delete("redirect");
      window.history.replaceState({}, "", routeToUrl(redirect, url.search));
      return;
    }

    if (sectionHash) return;

    if (legacyHashRoute) {
      window.history.replaceState({}, "", routeToUrl(legacyHashRoute, url.search));
      return;
    }

    if (window.location.pathname.endsWith("/index.html")) {
      window.history.replaceState({}, "", routeToUrl("/", url.search));
    }
  }

  function hrefForRoute(route) {
    return routeToUrl(route);
  }

  function routeToPath(route) {
    if (route.name === "scenarios") return "/scenarios";
    if (route.name === "scenario") return `/scenario/${encodeURIComponent(route.scenarioId)}`;
    return "/";
  }

  function getLang() {
    const params = new URLSearchParams(window.location.search);
    const lang = (localStorage.getItem("phishguard_lang") || params.get("lang") || "es").toLowerCase();
    return SUPPORTED_LANGS.has(lang) ? lang : "es";
  }

  function setLang(lang) {
    const currentLang = getLang();
    const route = getRoute();
    const url = new URL(window.location.href);
    let targetRoute = routeToPath(route);

    if (route.name === "scenario") {
      const currentIndex = getScenarios(currentLang).findIndex((scenario) => scenario.id === route.scenarioId);
      const equivalentScenario = currentIndex >= 0 ? getScenarios(lang)[currentIndex] : null;
      if (equivalentScenario) targetRoute = `/scenario/${encodeURIComponent(equivalentScenario.id)}`;
    }

    localStorage.setItem("phishguard_lang", lang);
    url.searchParams.delete("lang");
    window.history.pushState({}, "", route.scrollTarget ? sectionUrl(route.scrollTarget, url.search) : routeToUrl(targetRoute, url.search));
    render({ preserveScroll: true });
  }

  function getRoute() {
    const hashRoute = getLegacyHashRoute();
    let routePath = hashRoute || window.location.pathname;
    const base = basePathWithoutTrailingSlash();

    if (routePath.endsWith("/index.html")) {
      routePath = routePath.slice(0, -"/index.html".length) || "/";
    }

    if (!hashRoute && BASE_PATH !== "/") {
      if (routePath === base || routePath === `${base}/`) {
        routePath = "/";
      } else if (routePath.startsWith(`${base}/`)) {
        routePath = `/${routePath.slice(`${base}/`.length)}`;
      } else {
        routePath = "/";
      }
    }

    routePath = routePath.replace(/\/+$/, "") || "/";
    const parts = routePath.split("/").filter(Boolean);
    const sectionHash = getSectionHash();

    if (routePath === "/") return sectionHash ? { name: "home", scrollTarget: sectionHash } : { name: "home" };
    if (parts[0] === "scenarios") return { name: "scenarios" };
    if (parts[0] === "scenario" && parts[1]) return { name: "scenario", scenarioId: decodeURIComponent(parts[1]) };
    if (parts[0] === "resources") return { name: "home", scrollTarget: "resources" };
    if (parts[0] === "ethics") return { name: "home", scrollTarget: "ethics" };
    return { name: "not_found" };
  }

  function navigate(route) {
    const targetRoute = normalizeRoutePath(route);
    const targetUrl = routeToUrl(targetRoute);
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (currentUrl === targetUrl) {
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.history.pushState({}, "", targetUrl);
    render();
  }

  function getScenarios(lang) {
    return DATA.scenarios[lang] || DATA.scenarios.es || [];
  }

  function getScenario(lang, scenarioId) {
    return getScenarios(lang).find((scenario) => scenario.id === scenarioId) || null;
  }

  function getNextScenario(lang, scenarioId) {
    const scenarios = getScenarios(lang);
    const index = scenarios.findIndex((scenario) => scenario.id === scenarioId);
    if (index >= 0 && index + 1 < scenarios.length) return scenarios[index + 1];
    return null;
  }

  function t(lang) {
    return DATA.uiText[lang] || DATA.uiText.es;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function attr(value) {
    return escapeHtml(value);
  }

  function render(options = {}) {
    const previousScrollX = window.scrollX;
    const previousScrollY = window.scrollY;
    const lang = getLang();
    const copy = t(lang);
    const route = getRoute();

    document.documentElement.lang = lang;
    document.title = copy.app_name;
    renderHeader(lang, copy);
    renderFooter(copy);

    if (route.name === "home") appRoot.innerHTML = homeTemplate(lang, copy);
    else if (route.name === "scenarios") appRoot.innerHTML = scenariosTemplate(lang, copy);
    else if (route.name === "scenario") appRoot.innerHTML = scenarioTemplate(lang, copy, route.scenarioId);
    else { window.location.replace(BASE_PATH); return; }

    attachHandlers(lang);
    initScrollReveals();
    initScrollSpy();
    initMobileNav(lang);

    if (options.preserveScroll) {
      window.scrollTo({ left: previousScrollX, top: previousScrollY, behavior: "auto" });
      return;
    }

    if (route.scrollTarget) {
      setTimeout(() => scrollToTarget(route.scrollTarget), 0);
    } else {
      appRoot.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  function renderHeader(lang, copy) {
    const altLang = lang === "es" ? "en" : "es";
    headerRoot.innerHTML = `
      <div class="header-inner">
        <a href="${attr(hrefForRoute("/"))}" class="brand-link" data-link="/" aria-label="${attr(copy.app_name)}">
          <img src="${attr(assetUrl("favicon.svg"))}" alt="" aria-hidden="true">
          <span>${escapeHtml(copy.app_name)}</span>
        </a>

        <nav id="header-nav-links" class="header-nav" aria-label="${attr(lang === "es" ? "Navegación principal" : "Main navigation")}">
          <a href="${attr(sectionUrl("what-is-phishing"))}" data-scroll-target="what-is-phishing">${escapeHtml(copy.phishing_nav)}</a>
          <a href="${attr(sectionUrl("scenarios"))}" data-scroll-target="scenarios">${escapeHtml(copy.scenarios_nav)}</a>
          <a href="${attr(sectionUrl("resources"))}" data-scroll-target="resources">${escapeHtml(copy.resources_nav)}</a>
          <a href="https://github.com/juandiegoc30/phishguard-trainer" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
            ${escapeHtml(copy.github)}
          </a>
        </nav>

        <div class="header-end">
          <button type="button" class="mobile-menu-btn" aria-label="${attr(lang === "es" ? "Abrir menú" : "Open menu")}" aria-expanded="false" aria-controls="header-nav-links">
            <svg width="16" height="13" viewBox="0 0 16 13" fill="none" aria-hidden="true">
              <rect width="16" height="2" rx="1" fill="currentColor"/>
              <rect y="5.5" width="16" height="2" rx="1" fill="currentColor"/>
              <rect y="11" width="16" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
          <button type="button" class="language-toggle" data-lang-toggle="${attr(altLang)}" aria-label="${attr(lang === "es" ? "Cambiar idioma a inglés" : "Switch language to Spanish")}">
            ${languageFlag(lang)}
            <span>${lang.toUpperCase()}</span>
          </button>
        </div>
      </div>`;
  }

  function renderFooter(copy) {
    footerRoot.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-8 text-sm text-slate-400 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p>${escapeHtml(copy.footer_text)}</p>
        <p>
          &copy; 2026 Juan Diego Castellanos ·
          <a href="https://github.com/juandiegoc30" class="hover:text-white" rel="noopener noreferrer">github.com/juandiegoc30</a>
        </p>
      </div>`;
  }

  function languageFlag(lang) {
    const code = lang === "es" ? "co" : "us";
    const label = lang === "es" ? "Colombia" : "United States";
    return `<img class="language-flag" src="${attr(assetUrl(`assets/img/flags/${code}.svg`))}" alt="${attr(label)}">`;
  }

  function heroTitleTemplate(lang, copy) {
    const lines = lang === "es"
      ? ["Aprende a detectar", `intentos de <span class="hero-title-threat">phishing</span>`, "antes de hacer clic."]
      : ["Learn to spot", `<span class="hero-title-threat">phishing</span> attempts`, "before you click."];

    return `
      <h1 aria-label="${attr(copy.hero_title)}">
        ${lines.map((line) => `<span class="hero-title-line" aria-hidden="true">${line}</span>`).join("")}
      </h1>
    `;
  }

  function highlightRiskText(text) {
    return escapeHtml(text).replace(/\[\[(.+?)\]\]/g, '<span class="risk-highlight">$1</span>');
  }

  function homeTemplate(lang, copy) {
    const scenarios = getScenarios(lang);
    const scenarioCards = scenarios.map((scenario) => scenarioCardTemplate(scenario, false)).join("");
    const commonSignals = (copy.common_signals || [])
      .map((signal) => `
        <article class="signal-card">
          <span class="signal-dot" aria-hidden="true"></span>
          <h3 class="font-bold mb-2">${escapeHtml(signal.title)}</h3>
          <p class="text-sm text-slate-400 leading-6">${escapeHtml(signal.text)}</p>
        </article>
      `)
      .join("");
    const whatToDoItems = (copy.what_to_do_items || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
    const afterClickItems = (copy.after_click_items || [])
      .map((item, index) => `
        <li class="timeline-step">
          <span>${index + 1}</span>
          <p>${escapeHtml(item)}</p>
        </li>
      `)
      .join("");
    const phishingIntroSteps = (copy.phishing_intro_steps || [])
      .map((step) => `<li>${escapeHtml(step)}</li>`)
      .join("");
    const howItWorksSteps = (copy.how_it_works_steps || [])
      .map((step, index) => `
        <article class="how-step-card">
          <span class="how-step-num" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.text)}</p>
        </article>
      `)
      .join("");
    const phishingIntroItems = (copy.phishing_intro_items || [])
      .map((item, index) => `
        <article class="phishing-explain-card">
          <span class="phishing-explain-index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `)
      .join("");
    const reportChannels = (copy.report_channels || [])
      .map((channel) => `
        <article class="panel report-panel">
          <h3 class="panel-subheading">${escapeHtml(channel.country)}</h3>
          <div class="space-y-4">
            ${(channel.items || []).map((item) => `
              <a href="${attr(item.url)}" target="_blank" rel="noopener noreferrer" class="report-link">
                <span class="block font-medium text-slate-100">${escapeHtml(item.label)}</span>
                <span class="mt-2 block text-sm leading-6 text-slate-400">${escapeHtml(item.detail)}</span>
              </a>
            `).join("")}
          </div>
        </article>
      `)
      .join("");

    return `
      <section id="hero" class="app-section hero-section">
        <div class="hero-copy">
          <p class="section-kicker">${escapeHtml(copy.hero_kicker)}</p>
          ${heroTitleTemplate(lang, copy)}
          <p class="text-lg text-slate-300 leading-8 mb-8">${escapeHtml(copy.hero_subtitle)}</p>

          <div class="hero-cta">
            <a href="${attr(sectionUrl("scenarios"))}" data-scroll-target="scenarios" class="pg-button primary">${escapeHtml(copy.start_training)}</a>
            <a href="${attr(sectionUrl("ethics"))}" data-scroll-target="ethics" class="pg-button secondary">${escapeHtml(copy.ethical_purpose)}</a>
          </div>
        </div>
        <aside class="hero-illustration" aria-label="${attr(lang === "es" ? "Ilustración de entrenamiento contra phishing" : "Phishing training illustration")}">
          <picture>
            <source srcset="assets/img/hero-phishing-training.webp" type="image/webp">
            <img src="assets/img/hero-phishing-training.png" alt="" width="1024" height="1536" loading="eager" decoding="async">
          </picture>
        </aside>
      </section>

      <section id="what-is-phishing" class="app-section phishing-explainer section-band home-section" aria-labelledby="phishing-section-title">
        <div class="section-heading phishing-explainer-copy">
          <p class="section-kicker">${escapeHtml(copy.phishing_intro_kicker)}</p>
          <h2 id="phishing-section-title">${escapeHtml(copy.phishing_intro_title)}</h2>
          <p>${escapeHtml(copy.phishing_intro_text)}</p>
          <div class="phishing-summary">
            <span>${escapeHtml(copy.phishing_intro_summary_label)}</span>
            <p>${highlightRiskText(copy.phishing_intro_summary_text)}</p>
            <ol aria-label="${attr(lang === "es" ? "Cómo funciona un ataque de phishing" : "How a phishing attack works")}">${phishingIntroSteps}</ol>
          </div>
        </div>
        <div class="phishing-explainer-grid">
          ${phishingIntroItems}
        </div>
      </section>

      <section id="scenarios" class="app-section section-band home-section">
        <div class="section-heading">
          <p class="section-kicker">${escapeHtml(copy.scenarios_nav)}</p>
          <h2>${escapeHtml(copy.scenarios_title)}</h2>
          <p>${escapeHtml(copy.scenarios_subtitle)}</p>
        </div>
        <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-5">${scenarioCards}</div>
      </section>

      <section class="app-section section-band home-section">
        <div class="section-heading">
          <p class="section-kicker">${escapeHtml(lang === "es" ? "Patrones de alerta" : "Warning patterns")}</p>
          <h2>${escapeHtml(copy.common_signals_title)}</h2>
          <p>${escapeHtml(copy.common_signals_intro)}</p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          ${commonSignals}
        </div>
      </section>

      <section class="app-section section-band home-section">
        <div class="section-heading">
          <p class="section-kicker">${escapeHtml(copy.how_it_works_kicker)}</p>
          <h2>${escapeHtml(copy.how_it_works_title)}</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-5">
          ${howItWorksSteps}
        </div>
      </section>

      <section id="resources" class="app-section section-band home-section">
        <div class="section-heading">
          <p class="section-kicker">${escapeHtml(copy.resources_nav)}</p>
          <h2>${escapeHtml(copy.resources_title)}</h2>
          <p>${escapeHtml(copy.resources_intro)}</p>
        </div>

        <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(240px,500px)] gap-6">
          <article class="panel">
            <h3 class="panel-subheading">${escapeHtml(copy.what_to_do_title)}</h3>
            <ol class="resource-list">${whatToDoItems}</ol>
          </article>

          <div class="report-channels-col">
            <h3 class="panel-subheading">${escapeHtml(copy.report_channels_title)}</h3>
            <div class="grid gap-6">${reportChannels}</div>
          </div>
        </div>

        <article class="panel after-click-panel">
          <h3 class="panel-subheading">${escapeHtml(copy.after_click_title)}</h3>
          <ol aria-label="${attr(lang === "es" ? "Pasos a seguir si ya hiciste clic en un enlace de phishing" : "Steps to follow if you already clicked a phishing link")}" class="grid md:grid-cols-2 lg:grid-cols-5 gap-5">${afterClickItems}</ol>
        </article>
      </section>

      <section id="ethics" class="app-section section-band home-section">
        <div class="ethics-panel">
          <h2 class="panel-heading">${escapeHtml(copy.ethics_title)}</h2>
          <p class="panel-body">${escapeHtml(copy.ethics_text)}</p>
        </div>
      </section>`;
  }

  function scenariosTemplate(lang, copy) {
    const cards = getScenarios(lang).map((scenario) => scenarioCardTemplate(scenario, true, copy)).join("");

    return `
      <section class="app-section py-16">
        <div class="section-heading">
          <p class="section-kicker">${escapeHtml(copy.scenarios_nav)}</p>
          <h1>${escapeHtml(copy.scenarios_title)}</h1>
          <p>${escapeHtml(copy.scenarios_subtitle)}</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">${cards}</div>
      </section>`;
  }

  function scenarioCardTemplate(scenario, showLearningGoal, copy = {}) {
    return `
      <a href="${attr(hrefForRoute(`/scenario/${encodeURIComponent(scenario.id)}`))}" data-link="/scenario/${attr(encodeURIComponent(scenario.id))}" class="scenario-card">
        <div class="flex items-center justify-between mb-4">
          <span class="scenario-type">${escapeHtml(scenario.type)}</span>
          <span class="scenario-difficulty">${escapeHtml(scenario.difficulty)}</span>
        </div>
        <h2 class="text-xl font-semibold mb-3">${escapeHtml(scenario.title)}</h2>
        <p class="text-sm text-slate-400 leading-6 ${showLearningGoal ? "mb-5" : ""}">${escapeHtml(scenario.context)}</p>
        ${showLearningGoal ? `
          <div class="learning-note">
            <span>${escapeHtml(copy.learning_goal || "Learning goal")}:</span>
            <span>${escapeHtml(scenario.learning_goal)}</span>
          </div>` : ""}
      </a>`;
  }

  function scenarioTemplate(lang, copy, scenarioId) {
    const scenario = getScenario(lang, scenarioId);
    if (!scenario) { window.location.replace(BASE_PATH); return ""; }

    return `
      <section class="case-section max-w-7xl mx-auto px-6 py-12">
        <div class="case-header">
          <a href="${attr(sectionUrl("scenarios"))}" data-scroll-target="scenarios" class="back-link">← ${escapeHtml(copy.back_to_scenarios)}</a>
          <div class="case-title-row">
            <div>
              <p class="section-kicker">${escapeHtml(scenario.type)} · ${escapeHtml(scenario.difficulty)}</p>
              <h1>${escapeHtml(scenario.title)}</h1>
            </div>
          </div>
          <p class="text-slate-400 max-w-3xl leading-7">${escapeHtml(scenario.context)}</p>
          <p class="learning-note mt-4"><span>${escapeHtml(copy.learning_goal)}:</span> ${escapeHtml(scenario.learning_goal)}</p>
        </div>

        <form data-scenario-form="${attr(scenario.id)}" class="grid xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] gap-8 items-start">
          <section aria-label="${attr(copy.review_message)}" class="case-viewport">
            ${scenario.mock_ui.mode === "sms" ? smsClientTemplate(lang, copy, scenario) : emailClientTemplate(lang, copy, scenario)}
          </section>

          <fieldset class="selection-panel sticky top-24">
            <div class="mb-5">
              <span class="scenario-type">${escapeHtml(copy.your_selection)}</span>
            </div>
            <legend class="selection-title">${escapeHtml(copy.select_suspicious)}</legend>
            <p class="selection-help">${escapeHtml(copy.select_suspicious_help)}</p>

            <div class="space-y-3">
              ${scenario.elements.map((element) => elementOptionTemplate(element)).join("")}
            </div>

            <button type="submit" class="pg-button primary mt-6 w-full">${escapeHtml(copy.view_result)}</button>
          </fieldset>
        </form>
      </section>`;
  }

  function elementOptionTemplate(element) {
    return `
      <label class="element-option">
        <input type="checkbox" name="selected_elements" value="${attr(element.id)}" class="mt-1 h-4 w-4 accent-cyan-400">
        <div>
          <p class="font-medium">${escapeHtml(element.label)}</p>
          <p class="text-sm text-slate-400 font-mono break-all">${escapeHtml(element.display)}</p>
        </div>
      </label>`;
  }

  function emailClientTemplate(lang, copy, scenario) {
    const ui = scenario.mock_ui;
    const body = (ui.body || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const initial = (ui.footer || "M").slice(0, 1).toUpperCase();
    const searchText = lang === "es" ? "Buscar en el correo" : "Search mail";
    const inboxText = lang === "es" ? "Recibidos" : "Inbox";
    const starredText = lang === "es" ? "Destacados" : "Starred";
    const sentText = lang === "es" ? "Enviados" : "Sent";
    const toMeText = lang === "es" ? "para mí" : "to me";
    const linkPreviewText = lang === "es" ? "Vista previa del enlace" : "Link preview";

    return `
      <div class="case-device case-device-mail" aria-label="${attr(copy.review_message)}">
        <div class="mail-app-window">
          <header class="mail-app-header">
            <div class="mail-left-tools">
              <button type="button" class="mail-round-icon" aria-label="Menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
              <div class="mail-brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6 7.5-6"/></svg></div>
              <span class="mail-brand-name">Mail</span>
            </div>

            <div class="mail-searchbar">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="7"/></svg>
              <span>${escapeHtml(searchText)}</span>
            </div>

            <div class="mail-header-actions">
              <button type="button" class="mail-round-icon" aria-label="Help"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.8 1c0 1.8-2.3 2.1-2.3 3.7M12 17h.01"/></svg></button>
              <button type="button" class="mail-round-icon" aria-label="Settings"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg></button>
              <div class="mail-account-badge">${lang === "es" ? "JD" : "JS"}</div>
            </div>
          </header>

          <main class="mail-reading-area">
            <aside class="mail-mini-nav" aria-hidden="true">
              <div class="mail-mini-nav-item active"><svg viewBox="0 0 24 24"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"/><path d="M4 13h4.2a2.5 2.5 0 0 0 2.3 1.5h3a2.5 2.5 0 0 0 2.3-1.5H20"/></svg><span>${escapeHtml(inboxText)}</span></div>
              <div class="mail-mini-nav-item"><svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z"/></svg><span>${escapeHtml(starredText)}</span></div>
              <div class="mail-mini-nav-item"><svg viewBox="0 0 24 24"><path d="m4 12 16-8-4 16-3.5-6.5L4 12Z"/><path d="m20 4-7.5 9.5"/></svg><span>${escapeHtml(sentText)}</span></div>
            </aside>

            <article class="mail-message-panel">
              <div class="mail-message-toolbar">
                <button type="button" class="mail-round-icon compact"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>
                <button type="button" class="mail-round-icon compact"><svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button>
                <button type="button" class="mail-round-icon compact"><svg viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01"/></svg></button>
                <span class="mail-toolbar-spacer"></span>
                <span class="mail-time">${lang === "es" ? "8:42 a. m." : "8:42 AM"}</span>
              </div>

              <div class="mail-subject-line-v4"><h2>${escapeHtml(ui.subject)}</h2><span>${escapeHtml(inboxText)}</span></div>

              <div class="mail-sender-row-v4">
                <div class="mail-sender-avatar-v4">${escapeHtml(initial)}</div>
                <div class="mail-sender-meta-v4">
                  <div class="mail-sender-primary"><strong>${escapeHtml(ui.footer)}</strong><small>&lt;${escapeHtml(ui.sender)}&gt;</small></div>
                  <button type="button">${escapeHtml(toMeText)} ▾</button>
                </div>
              </div>

              ${ui.preheader ? `<div class="mail-warning-strip">${escapeHtml(ui.preheader)}</div>` : ""}
              <div class="mail-message-body-v4">${body}</div>
              <div class="mail-cta-v4"><button type="button">${escapeHtml(ui.button)}</button></div>
              <div class="mail-link-preview-v4"><div class="mail-link-icon-v4"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.1 0l2.1-2.1a5 5 0 0 0-7.1-7.1L11 4.9"/><path d="M14 11a5 5 0 0 0-7.1 0l-2.1 2.1a5 5 0 0 0 7.1 7.1L13 19.1"/></svg></div><div><p>${escapeHtml(linkPreviewText)}</p><span>${escapeHtml(ui.link_preview)}</span></div></div>
            </article>
          </main>
        </div>
      </div>`;
  }

  function smsClientTemplate(lang, copy, scenario) {
    const ui = scenario.mock_ui;
    const body = (ui.body || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const initial = (ui.sender || "M").slice(0, 1).toUpperCase();
    const textMessage = lang === "es" ? "Mensaje de texto" : "Text Message";
    const dateLabel = lang === "es" ? "Hoy 9:32 a. m." : "Today 9:32 AM";

    return `
      <div class="case-device case-device-sms" aria-label="${attr(copy.review_message)}">
        <div class="sms-phone-shell">
          <div class="sms-phone-screen">
            <div class="sms-dynamic-island" aria-hidden="true"></div>
            <div class="sms-statusbar" aria-hidden="true">
              <span class="sms-time">5:13</span>
              <div class="sms-system-icons">
                <div class="ios-cellular" role="img" aria-label="Cellular signal"><span></span><span></span><span></span><span></span></div>
                <svg class="ios-wifi" viewBox="0 0 26 20" role="img" aria-label="Wi-Fi signal"><path d="M2.05 6.35C8.1 1.4 17.9 1.4 23.95 6.35c.28.23.3.66.04.92l-2.2 2.2c-.22.22-.56.24-.8.04C16.6 5.86 9.4 5.86 5.01 9.51c-.24.2-.58.18-.8-.04l-2.2-2.2c-.26-.26-.24-.69.04-.92Z"/><path d="M6.7 11.05c3.65-2.98 8.95-2.98 12.6 0 .28.23.3.65.04.91l-2.18 2.18c-.22.22-.56.24-.8.05-1.95-1.52-4.77-1.52-6.72 0-.24.19-.58.17-.8-.05l-2.18-2.18c-.26-.26-.24-.68.04-.91Z"/><path d="M11.15 16.05c1.03-.85 2.67-.85 3.7 0 .27.22.29.64.04.89l-1.5 1.5c-.22.22-.56.22-.78 0l-1.5-1.5c-.25-.25-.23-.67.04-.89Z"/></svg>
                <div class="ios-battery" role="img" aria-label="Battery 76 percent"><span>76</span></div>
              </div>
            </div>

            <header class="sms-conversation-header">
              <div class="sms-back-icon">‹</div>
              <div class="sms-contact-card"><div class="sms-contact-avatar">${escapeHtml(initial)}</div><strong>${escapeHtml(ui.sender)}</strong><span>${escapeHtml(textMessage)}</span></div>
              <div class="sms-info-icon">i</div>
            </header>

            <main class="sms-message-area">
              <div class="sms-date-label">${escapeHtml(dateLabel)}</div>
              <div class="sms-bubble-v4">${body}</div>
              <div class="sms-link-preview-v4"><div class="sms-link-thumb"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg></div><div><strong>${escapeHtml(ui.button)}</strong><span>${escapeHtml(ui.link_preview)}</span></div></div>
              <p class="sms-quiet-footer">${escapeHtml(ui.footer)}</p>
            </main>

            <footer class="sms-composer-v4"><button type="button" class="sms-plus">+</button><div>${escapeHtml(textMessage)}</div><button type="button" class="sms-audio"><svg viewBox="0 0 24 24"><path d="M12 3v18M8 7v10M16 7v10M4 10v4M20 10v4"/></svg></button></footer>
          </div>
        </div>
      </div>`;
  }

  function resultTemplate(lang, copy, scenario, selectedIds) {
    const result = Scoring.calculateScore(scenario, selectedIds, lang);
    const nextScenario = getNextScenario(lang, scenario.id);

    return `
      <section class="result-section max-w-6xl mx-auto px-6 py-12" aria-live="polite">
        <div class="mb-8">
          <a href="${attr(sectionUrl("scenarios"))}" data-scroll-target="scenarios" class="back-link">← ${escapeHtml(copy.back_to_scenarios)}</a>
          <p class="section-kicker mt-5">${escapeHtml(scenario.title)}</p>
          <h1 class="text-4xl md:text-5xl font-black mt-3 mb-3">${escapeHtml(copy.result)}</h1>
        </div>

        <div class="score-panel mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div><p class="text-sm text-slate-400 mb-2">${escapeHtml(copy.score)}</p><p class="text-6xl font-bold text-cyan-400">${escapeHtml(result.score)}/100</p></div>
            <div><p class="text-sm text-slate-400 mb-2">${escapeHtml(copy.level)}</p><p class="text-2xl font-semibold">${escapeHtml(result.level)}</p></div>
          </div>
        </div>

        <div class="space-y-4">${result.details.map((item) => resultDetailTemplate(item, copy)).join("")}</div>

        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <a href="${attr(hrefForRoute(`/scenario/${encodeURIComponent(scenario.id)}`))}" data-link="/scenario/${attr(encodeURIComponent(scenario.id))}" class="pg-button secondary">${escapeHtml(copy.retry)}</a>
          ${nextScenario ? `<a href="${attr(hrefForRoute(`/scenario/${encodeURIComponent(nextScenario.id)}`))}" data-link="/scenario/${attr(encodeURIComponent(nextScenario.id))}" class="pg-button primary">${escapeHtml(copy.next_scenario)}</a>` : `<a href="${attr(sectionUrl("scenarios"))}" data-scroll-target="scenarios" class="pg-button primary">${escapeHtml(copy.finish_training)}</a>`}
          <a href="${attr(sectionUrl("scenarios"))}" data-scroll-target="scenarios" class="pg-button secondary">${escapeHtml(copy.more_scenarios)}</a>
        </div>
      </section>`;
  }

  function resultDetailTemplate(item, copy) {
    const badgeMap = {
      correct: { text: copy.correct, className: "bg-emerald-500/20 text-emerald-300" },
      missed: { text: copy.missed, className: "bg-red-500/20 text-red-300" },
      false_positive: { text: copy.false_positive, className: "bg-amber-500/20 text-amber-300" },
      safe: { text: copy.safe, className: "bg-slate-700 text-slate-300" }
    };
    const badge = badgeMap[item.status] || badgeMap.safe;

    return `
      <div class="result-detail">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div><h2 class="font-semibold">${escapeHtml(item.label)}</h2><p class="text-sm text-slate-400 font-mono break-all">${escapeHtml(item.display)}</p></div>
          <span class="text-xs rounded-full ${badge.className} px-3 py-1">${escapeHtml(badge.text)}</span>
        </div>
        <p class="text-sm text-slate-300 leading-6">${escapeHtml(item.explanation)}</p>
      </div>`;
  }

  function attachHandlers(lang) {
    document.querySelectorAll("[data-link]").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        navigate(element.getAttribute("data-link"));
      });
    });

    document.querySelectorAll("[data-scroll-target]").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        const target = element.getAttribute("data-scroll-target");
        if (getRoute().name !== "home") {
          window.history.pushState({}, "", sectionUrl(target));
          render();
          setTimeout(() => scrollToTarget(target), 50);
        } else {
          window.history.pushState({}, "", sectionUrl(target));
          scrollToTarget(target);
        }
      });
    });

    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.addEventListener("click", () => setLang(button.getAttribute("data-lang-toggle")));
    });

    document.querySelectorAll("[data-scenario-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const scenarioId = form.getAttribute("data-scenario-form");
        const scenario = getScenario(lang, scenarioId);
        const copy = t(lang);
        const selectedIds = [...form.querySelectorAll('input[name="selected_elements"]:checked')].map((input) => input.value);

        appRoot.innerHTML = resultTemplate(lang, copy, scenario, selectedIds);
        attachHandlers(lang);
        initScrollReveals();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  let _scrollSpyCleanup = null;
  let _mobileNavCleanup = null;

  function initMobileNav(lang) {
    if (_mobileNavCleanup) { _mobileNavCleanup(); _mobileNavCleanup = null; }

    const menuBtn = headerRoot.querySelector(".mobile-menu-btn");
    const navEl = headerRoot.querySelector(".header-nav");
    if (!menuBtn || !navEl) return;

    function close() {
      navEl.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", lang === "es" ? "Abrir menú" : "Open menu");
    }

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navEl.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen
        ? (lang === "es" ? "Cerrar menú" : "Close menu")
        : (lang === "es" ? "Abrir menú" : "Open menu"));
    });

    navEl.addEventListener("click", close);

    const onDocClick = (e) => {
      if (!headerRoot.contains(e.target)) close();
    };
    document.addEventListener("click", onDocClick);
    _mobileNavCleanup = () => document.removeEventListener("click", onDocClick);
  }

  function initScrollSpy() {
    if (_scrollSpyCleanup) { _scrollSpyCleanup(); _scrollSpyCleanup = null; }

    const navLinks = [...document.querySelectorAll("#site-header nav a[data-scroll-target]")];
    if (!navLinks.length) return;

    const targets = navLinks
      .map((link) => ({ link, section: document.getElementById(link.dataset.scrollTarget) }))
      .filter(({ section }) => section);

    if (!targets.length) return;

    function update() {
      const threshold = window.scrollY + Math.round(window.innerHeight * 0.5);
      let current = null;
      for (const { link, section } of targets) {
        if (section.getBoundingClientRect().top + window.scrollY <= threshold) current = link;
      }
      navLinks.forEach((l) => l.classList.toggle("nav-active", l === current));
    }

    window.addEventListener("scroll", update, { passive: true });
    _scrollSpyCleanup = () => window.removeEventListener("scroll", update);
    update();
  }

  function initScrollReveals() {
    const revealItems = [...document.querySelectorAll(`
      .home-section .section-heading,
      .home-section .scenario-card,
      .home-section .signal-card,
      .home-section .phishing-explain-card,
      .home-section .panel:not(.report-panel),
      .home-section .report-channels-col,
      .home-section .how-step-card,
      .home-section .timeline-step,
      .home-section .ethics-panel
    `)];

    if (!revealItems.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    revealItems.forEach((item, index) => {
      item.classList.add("reveal-on-scroll");
      item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 240)}ms`);
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  }

  function scrollToTarget(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const headerHeight = headerRoot ? headerRoot.offsetHeight : 0;
    const sectionTop = target.getBoundingClientRect().top + window.scrollY;
    const availableHeight = window.innerHeight - headerHeight;
    const offsetFromTop = Math.max(0, (availableHeight - target.offsetHeight) / 2);
    window.scrollTo({ top: Math.max(0, sectionTop - headerHeight - offsetFromTop), behavior: "smooth" });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(assetUrl("sw.js")).catch(() => {});
    });
  }

  window.addEventListener("hashchange", () => {
    normalizeInitialUrl();
    render();
  });
  window.addEventListener("popstate", render);
  document.addEventListener("DOMContentLoaded", () => {
    normalizeInitialUrl();
    render();
  });
})();
