(function () {
  var CONFIG = window.SITE_CONFIG;
  var I18N = window.I18N;
  var currentLang = "en";

  var ICONS = {
    lamp: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 1 3.6 10.8c-.7.6-1.1 1.2-1.1 2.2H9.5c0-1-.4-1.6-1.1-2.2A6 6 0 0 1 12 3z"/>',
    appliance: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h3"/>',
    bed: '<path d="M3 7v10M3 17h18M3 12h18v5M7 7v5M21 9v3"/>',
    shower: '<path d="M4 21h16M8 21V10M8 6a3 3 0 0 1 3-3M14 7l6-4M14 10l6-4"/>',
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    gift: '<rect x="3" y="8" width="18" height="4"/><path d="M5 12v8h14v-8M12 8v12M12 8s-1-5-4-5-3 4 0 5M12 8s1-5 4-5 3 4 0 5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    factory: '<path d="M3 21V9l6 4V9l6 4V3h6v18H3z"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-.5-2 .5-2H17a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    ship: '<path d="M3 17l2-4h14l2 4M5 17v3h14v-3M6 13l4-7h4l4 7M10 6V4h4v2"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
    chart: '<path d="M4 20h16M7 20v-6M12 20V8M17 20v-10"/>',
    bank: '<path d="M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 21h18"/>'
  };

  function pick(obj, lang) {
    if (!obj) return "";
    return obj[lang] || obj.en || obj.zh || "";
  }

  function t(key, lang) {
    var target = I18N[lang] || I18N.en;
    var value = key.split(".").reduce(function (obj, part) {
      return obj && obj[part];
    }, target);
    return value || key;
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function svgIcon(name) {
    var paths = ICONS[name] || ICONS.search;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  }

  function getInitialLang() {
    var queryLang = new URLSearchParams(window.location.search).get("lang");
    var savedLang = localStorage.getItem("site_lang");
    var browserLang = (navigator.language || "zh-CN").toLowerCase();
    var fallback = browserLang.indexOf("zh") === 0 ? "zh" : browserLang.indexOf("ar") === 0 ? "ar" : "en";
    var lang = queryLang || savedLang || fallback;
    return I18N[lang] ? lang : "en";
  }

  function renderStats(lang) {
    var container = document.getElementById("heroStats");
    container.innerHTML = CONFIG.stats.map(function (stat) {
      return '<div class="hero-stat"><strong>' + escapeHtml(stat.value) + "</strong><span>" + escapeHtml(pick(stat.label, lang)) + "</span></div>";
    }).join("");
  }

  function renderAbout(lang) {
    document.getElementById("personaName").textContent = CONFIG.owner.name;
    document.getElementById("personaRole").textContent = pick(CONFIG.owner.role, lang);
    document.getElementById("aboutPoints").innerHTML = t("about.points", lang).map(function (point) {
      return "<li>" + escapeHtml(point) + "</li>";
    }).join("");
  }

  function renderServices(lang) {
    var container = document.getElementById("serviceTrack");
    container.innerHTML = CONFIG.services.map(function (service) {
      return '<article class="business-card">' +
        '<img src="' + escapeHtml(service.image) + '" alt="' + escapeHtml(pick(service.title, lang)) + '">' +
        '<div class="business-card-content"><span class="business-card-icon">' + svgIcon(service.icon) + "</span><h3>" + escapeHtml(pick(service.title, lang)) + "</h3><p>" + escapeHtml(pick(service.desc, lang)) + "</p></div>" +
      "</article>";
    }).join("");
  }

  function renderProducts(lang) {
    var grid = document.getElementById("productGrid");
    var select = document.getElementById("quoteCategory");
    grid.innerHTML = CONFIG.categories.map(function (category) {
      return '<article class="product-card"><span class="icon-badge">' + svgIcon(category.icon) + "</span><h3>" + escapeHtml(pick(category.name, lang)) + "</h3><p>" + escapeHtml(pick(category.desc, lang)) + "</p></article>";
    }).join("");
    select.innerHTML = '<option value="">' + escapeHtml(t("quote.categoryPlaceholder", lang)) + "</option>" + CONFIG.categories.map(function (category) {
      return '<option value="' + escapeHtml(category.id) + '">' + escapeHtml(pick(category.name, lang)) + "</option>";
    }).join("");
  }

  function renderProcess(lang) {
    var container = document.getElementById("processGrid");
    container.innerHTML = CONFIG.process.map(function (step, index) {
      return '<article class="process-card"><span class="step-number">0' + (index + 1) + '</span><h3>' + escapeHtml(pick(step.title, lang)) + "</h3><p>" + escapeHtml(pick(step.desc, lang)) + "</p></article>";
    }).join("");
  }

  function renderTestimonials(lang) {
    var container = document.getElementById("testimonialGrid");
    container.innerHTML = t("testimonials.quotes", lang).map(function (quote) {
      return '<article class="testimonial-card"><p>' + escapeHtml(quote.text) + '</p><strong>' + escapeHtml(quote.name) + "</strong></article>";
    }).join("");
  }

  function renderContact(lang) {
    var contact = CONFIG.contact;
    var emailLink = document.getElementById("contactEmail");
    var whatsappLink = document.getElementById("contactWhatsapp");
    var facebookLink = document.getElementById("contactFacebook");
    var locationBtn = document.getElementById("contactLocation");
    emailLink.href = "mailto:" + contact.email;
    emailLink.title = contact.email;
    emailLink.setAttribute("aria-label", contact.email);
    var whatsappDigits = contact.whatsapp.replace(/[^0-9]/g, "");
    if (whatsappDigits.indexOf("00") === 0) whatsappDigits = whatsappDigits.slice(2);
    whatsappLink.href = "https://wa.me/" + whatsappDigits;
    whatsappLink.title = contact.whatsapp;
    whatsappLink.setAttribute("aria-label", contact.whatsapp);
    facebookLink.href = CONFIG.social.facebook;
    facebookLink.title = CONFIG.social.facebook;
    facebookLink.setAttribute("aria-label", CONFIG.social.facebook);
    locationBtn.title = contact.address || contact.city;
    locationBtn.setAttribute("aria-label", contact.address || contact.city);
    document.getElementById("facebookVideoLink").href = CONFIG.video.facebookPost;
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  function setupVideo() {
    var video = document.getElementById("promoVideo");
    var youtubeId = CONFIG.video.youtubeId;
    if (youtubeId) {
      var iframe = document.createElement("iframe");
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.src = "https://www.youtube.com/embed/" + encodeURIComponent(youtubeId);
      iframe.title = "Promotional video";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      video.replaceWith(iframe);
      return;
    }
    var source = video.querySelector("source");
    if (source) {
      source.src = CONFIG.video.file;
      source.type = CONFIG.video.file.toLowerCase().endsWith(".mp4") ? "video/mp4" : "video/webm";
    }
    video.poster = CONFIG.video.poster;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("site_lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = t("meta.title", lang);
    document.querySelector('meta[name="description"]').setAttribute("content", t("meta.description", lang));
    document.querySelector('meta[name="keywords"]').setAttribute("content", t("meta.keywords", lang));

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      node.textContent = key === "brandName" ? (CONFIG.brand[lang] || CONFIG.brand.en) : t(key, lang);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      node.placeholder = t(node.getAttribute("data-i18n-placeholder"), lang);
    });
    var langLabels = { zh: "中文", en: "English", ar: "العربية" };
    document.getElementById("langCurrentLabel").textContent = langLabels[lang] || lang;
    document.querySelectorAll(".lang-menu button[data-lang]").forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-lang") === lang);
    });

    renderStats(lang);
    renderAbout(lang);
    renderServices(lang);
    renderProducts(lang);
    renderProcess(lang);
    renderTestimonials(lang);
    renderContact(lang);
  }

  function route() {
    var isAdmin = window.location.hash.indexOf("#/admin") === 0;
    document.getElementById("publicSite").hidden = isAdmin;
    document.getElementById("adminView").hidden = !isAdmin;
    if (isAdmin && typeof window.initAdmin === "function") {
      window.initAdmin();
    }
  }

  function bindEvents() {
    var langSwitch = document.getElementById("langSwitch");
    var langCurrent = document.getElementById("langCurrent");
    var langMenu = document.getElementById("langMenu");

    function setLangMenu(open) {
      langMenu.hidden = !open;
      langSwitch.classList.toggle("open", open);
      langCurrent.setAttribute("aria-expanded", open ? "true" : "false");
    }

    langCurrent.addEventListener("click", function (event) {
      event.stopPropagation();
      setLangMenu(langMenu.hidden);
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest("#langSwitch")) setLangMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setLangMenu(false);
        var popup = document.getElementById("emailPopup");
        if (popup) popup.hidden = true;
        var locationPopup = document.getElementById("locationPopup");
        if (locationPopup) locationPopup.hidden = true;
      }
    });

    document.querySelectorAll(".lang-menu button[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        var lang = button.getAttribute("data-lang");
        localStorage.setItem("site_lang", lang);
        if (history.replaceState) {
          var url = new URL(window.location.href);
          url.searchParams.set("lang", lang);
          history.replaceState(null, "", url);
        }
        applyLanguage(lang);
        setLangMenu(false);
      });
    });

    var emailButton = document.getElementById("contactEmail");
    var emailPopup = document.getElementById("emailPopup");
    var emailPopupValue = document.getElementById("emailPopupValue");
    var emailSendLink = document.getElementById("emailSendLink");
    var copyEmailButton = document.getElementById("copyEmail");
    var closeEmailPopupButton = document.getElementById("closeEmailPopup");

    function copyText(text, done) {
      function fallback() {
        var area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
          done();
        } finally {
          document.body.removeChild(area);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    }

    emailButton.addEventListener("click", function () {
      emailPopupValue.textContent = CONFIG.contact.email;
      emailSendLink.href = "mailto:" + CONFIG.contact.email;
      emailPopup.hidden = false;
    });
    closeEmailPopupButton.addEventListener("click", function () {
      emailPopup.hidden = true;
    });
    emailPopup.addEventListener("click", function (event) {
      if (event.target === emailPopup) emailPopup.hidden = true;
    });
    copyEmailButton.addEventListener("click", function () {
      var original = copyEmailButton.textContent;
      copyText(CONFIG.contact.email, function () {
        copyEmailButton.textContent = t("contact.copiedEmail", currentLang);
        setTimeout(function () {
          copyEmailButton.textContent = original;
        }, 1600);
      });
    });

    var locationButton = document.getElementById("contactLocation");
    var locationPopup = document.getElementById("locationPopup");
    var locationPopupValue = document.getElementById("locationPopupValue");
    var viewMapLink = document.getElementById("viewMapLink");
    var copyAddressButton = document.getElementById("copyAddress");
    var closeLocationPopupButton = document.getElementById("closeLocationPopup");

    function locationText() {
      return CONFIG.contact.address || CONFIG.contact.city;
    }

    locationButton.addEventListener("click", function () {
      var address = locationText();
      locationPopupValue.textContent = address;
      viewMapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
      locationPopup.hidden = false;
    });
    closeLocationPopupButton.addEventListener("click", function () {
      locationPopup.hidden = true;
    });
    locationPopup.addEventListener("click", function (event) {
      if (event.target === locationPopup) locationPopup.hidden = true;
    });
    copyAddressButton.addEventListener("click", function () {
      var original = copyAddressButton.textContent;
      copyText(locationText(), function () {
        copyAddressButton.textContent = t("contact.copiedAddress", currentLang);
        setTimeout(function () {
          copyAddressButton.textContent = original;
        }, 1600);
      });
    });

    var menuToggle = document.getElementById("menuToggle");
    var nav = document.getElementById("siteNav");
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.addEventListener("click", function () {
      nav.classList.remove("open");
    });

    var serviceSlider = document.getElementById("serviceSlider");
    var serviceAutoTimer = null;
    var servicePauseTimer = null;

    function stopServiceAuto() {
      clearInterval(serviceAutoTimer);
      clearTimeout(servicePauseTimer);
    }

    function startServiceAuto() {
      stopServiceAuto();
      serviceAutoTimer = setInterval(function () {
        var maxScroll = serviceSlider.scrollWidth - serviceSlider.clientWidth;
        var firstCard = serviceSlider.querySelector(".business-card");
        var step = firstCard ? firstCard.offsetWidth + 12 : 320;
        var next = serviceSlider.scrollLeft + step;
        if (next >= maxScroll - 10) next = 0;
        serviceSlider.scrollTo({ left: next, behavior: "smooth" });
      }, 2000);
    }

    function restartServiceAuto(delay) {
      stopServiceAuto();
      servicePauseTimer = setTimeout(startServiceAuto, delay || 5000);
    }

    serviceSlider.addEventListener("mouseenter", stopServiceAuto);
    serviceSlider.addEventListener("mouseleave", function () {
      restartServiceAuto(600);
    });
    serviceSlider.addEventListener("wheel", function () {
      restartServiceAuto(4000);
    }, { passive: true });
    serviceSlider.addEventListener("pointerdown", stopServiceAuto, { passive: true });
    serviceSlider.addEventListener("pointerup", function () {
      restartServiceAuto(3500);
    }, { passive: true });

    document.getElementById("servicePrev").addEventListener("click", function () {
      serviceSlider.scrollBy({ left: -360, behavior: "smooth" });
      restartServiceAuto(5000);
    });
    document.getElementById("serviceNext").addEventListener("click", function () {
      serviceSlider.scrollBy({ left: 360, behavior: "smooth" });
      restartServiceAuto(5000);
    });
    startServiceAuto();

    document.getElementById("quoteForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      var data = new FormData(form);
      var categoryId = String(data.get("category") || "");
      var category = CONFIG.categories.find(function (item) { return item.id === categoryId; });
      var record = {
        type: "quote_request",
        name: String(data.get("name") || "").trim(),
        company: String(data.get("company") || "").trim(),
        email: String(data.get("email") || "").trim(),
        whatsapp: String(data.get("whatsapp") || "").trim(),
        country: String(data.get("country") || "").trim(),
        category: categoryId,
        categoryName: category ? pick(category.name, currentLang) : "",
        quantity: String(data.get("quantity") || "").trim(),
        tradeTerm: String(data.get("tradeTerm") || "").trim(),
        message: String(data.get("message") || "").trim(),
        status: "new"
      };
      var saved = window.CRM.add("leads", record);
      window.CRM.addRemote("leads", saved).catch(function () {});
      var success = document.getElementById("quoteSuccess");
      success.hidden = false;
      success.textContent = t("quote.success", currentLang) + saved.id;
      form.reset();
      document.getElementById("quoteCategory").selectedIndex = 0;
    });

    window.addEventListener("hashchange", route);
  }

  function init() {
    currentLang = getInitialLang();
    applyLanguage(currentLang);
    setupVideo();
    bindEvents();
    route();
  }

  init();
  document.addEventListener("DOMContentLoaded", route);
})();
