(function () {
  var bound = false;

  function getLang() {
    return localStorage.getItem("site_lang") || document.documentElement.lang || "en";
  }

  function t(key, lang) {
    var target = window.I18N[lang] || window.I18N.en;
    var value = key.split(".").reduce(function (obj, part) {
      return obj && obj[part];
    }, target);
    return value || key;
  }

  function adminT(key) {
    return t("admin." + key, getLang());
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function statusOptions(selected) {
    var statuses = ["new", "contacted", "quoted", "won", "lost"];
    return statuses.map(function (status) {
      return '<option value="' + status + '"' + (status === selected ? " selected" : "") + ">" + escapeHtml(adminT("status" + status.charAt(0).toUpperCase() + status.slice(1))) + "</option>";
    }).join("");
  }

  function formatDate(iso) {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString();
  }

  function renderStats() {
    var leads = window.CRM.load("leads");
    var quotes = window.CRM.load("quotes");
    var newCount = leads.filter(function (lead) { return lead.status === "new"; }).length;
    var wonCount = leads.filter(function (lead) { return lead.status === "won"; }).length;
    var stats = [
      { value: leads.length, label: adminT("statsLeads") },
      { value: newCount, label: adminT("statsNew") },
      { value: quotes.length, label: adminT("statsQuotes") },
      { value: wonCount, label: adminT("statsWon") }
    ];
    document.getElementById("adminStats").innerHTML = stats.map(function (stat) {
      return '<div class="stat-card"><strong>' + stat.value + "</strong><span>" + escapeHtml(stat.label) + "</span></div>";
    }).join("");
  }

  function renderLeads() {
    var leads = window.CRM.load("leads");
    var table = document.getElementById("leadsTable");
    var empty = document.getElementById("leadsEmpty");
    empty.hidden = leads.length > 0;
    if (!leads.length) {
      table.querySelector("thead").innerHTML = "";
      table.querySelector("tbody").innerHTML = "";
      return;
    }
    var headers = ["id", "date", "name", "country", "contact", "category", "qty", "tradeTerm", "message", "status", "actions"];
    table.querySelector("thead").innerHTML = "<tr>" + headers.map(function (key) {
      return "<th>" + escapeHtml(adminT(key)) + "</th>";
    }).join("") + "</tr>";
    table.querySelector("tbody").innerHTML = leads.map(function (lead) {
      return "<tr>" +
        "<td>" + escapeHtml(lead.id) + "</td>" +
        "<td>" + escapeHtml(formatDate(lead.createdAt)) + "</td>" +
        "<td><strong>" + escapeHtml(lead.name) + "</strong>" + (lead.company ? "<br>" + escapeHtml(lead.company) : "") + "</td>" +
        "<td>" + escapeHtml(lead.country || "-") + "</td>" +
        "<td>" + escapeHtml(lead.whatsapp || "-") + (lead.email ? "<br>" + escapeHtml(lead.email) : "") + "</td>" +
        "<td>" + escapeHtml(lead.categoryName || lead.category || "-") + "</td>" +
        "<td>" + escapeHtml(lead.quantity || "-") + "</td>" +
        "<td>" + escapeHtml(lead.tradeTerm || "-") + "</td>" +
        "<td>" + escapeHtml(lead.message || "-") + "</td>" +
        '<td><select data-lead-status data-id="' + escapeHtml(lead.id) + '">' + statusOptions(lead.status || "new") + "</select></td>" +
        '<td><div class="table-actions">' +
          '<button class="btn btn-secondary btn-small" type="button" data-lead-quote data-id="' + escapeHtml(lead.id) + '">' + escapeHtml(adminT("createQuote")) + "</button>" +
          '<button class="btn btn-secondary btn-small" type="button" data-lead-delete data-id="' + escapeHtml(lead.id) + '">' + escapeHtml(adminT("delete")) + "</button>" +
        "</div></td>" +
      "</tr>";
    }).join("");
  }

  function renderQuotes() {
    var quotes = window.CRM.load("quotes");
    var table = document.getElementById("quotesTable");
    var empty = document.getElementById("quotesEmpty");
    empty.hidden = quotes.length > 0;
    if (!quotes.length) {
      table.querySelector("thead").innerHTML = "";
      table.querySelector("tbody").innerHTML = "";
      return;
    }
    var headers = ["quoteNo", "date", "name", "country", "quoteProduct", "quoteQty", "quotePrice", "total", "quoteValid", "quoteNotes", "actions"];
    table.querySelector("thead").innerHTML = "<tr>" + headers.map(function (key) {
      return "<th>" + escapeHtml(adminT(key)) + "</th>";
    }).join("") + "</tr>";
    table.querySelector("tbody").innerHTML = quotes.map(function (quote) {
      var total = window.CRM.computeQuote(quote.quantity, quote.unitPrice);
      return "<tr>" +
        "<td>" + escapeHtml(quote.id) + "</td>" +
        "<td>" + escapeHtml(formatDate(quote.createdAt)) + "</td>" +
        "<td><strong>" + escapeHtml(quote.clientName) + "</strong>" + (quote.company ? "<br>" + escapeHtml(quote.company) : "") + "</td>" +
        "<td>" + escapeHtml(quote.country || "-") + "</td>" +
        "<td>" + escapeHtml(quote.product || "-") + "</td>" +
        "<td>" + escapeHtml(quote.quantity || "-") + "</td>" +
        "<td>" + escapeHtml((quote.currency || "USD") + " " + (quote.unitPrice || "0")) + "</td>" +
        "<td><strong>" + escapeHtml((quote.currency || "USD") + " " + total.toFixed(2)) + "</strong></td>" +
        "<td>" + escapeHtml(quote.validDays || "-") + "d</td>" +
        "<td>" + escapeHtml(quote.notes || "-") + "</td>" +
        '<td><div class="table-actions">' +
          '<button class="btn btn-primary btn-small" type="button" data-quote-print data-id="' + escapeHtml(quote.id) + '">' + escapeHtml(adminT("print")) + "</button>" +
          '<button class="btn btn-secondary btn-small" type="button" data-quote-delete data-id="' + escapeHtml(quote.id) + '">' + escapeHtml(adminT("delete")) + "</button>" +
        "</div></td>" +
      "</tr>";
    }).join("");
  }

  function render() {
    renderStats();
    renderLeads();
    renderQuotes();
  }

  function downloadCsv() {
    var activePanel = document.querySelector(".admin-panel.active");
    var kind = activePanel && activePanel.id === "quotesPanel" ? "quotes" : "leads";
    var records = window.CRM.load(kind);
    var csv = window.CRM.exportCsv(records);
    if (!csv) return;
    var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = kind + "-" + new Date().toISOString().slice(0, 10) + ".csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function showQuoteFromLead(lead) {
    var form = document.getElementById("manualQuoteForm");
    form.elements.clientName.value = lead.name || "";
    form.elements.product.value = lead.categoryName || lead.category || "";
    form.elements.quantity.value = lead.quantity || 1;
    form.elements.notes.value = (lead.country ? "Country: " + lead.country + "\n" : "") + (lead.message || "");
    document.querySelector('[data-tab="quotes"]').click();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function printQuote(id) {
    var quote = window.CRM.load("quotes").find(function (item) { return item.id === id; });
    if (!quote) return;
    var total = window.CRM.computeQuote(quote.quantity, quote.unitPrice).toFixed(2);
    var currency = quote.currency || "USD";
    var brand = window.SITE_CONFIG.brand.en;
    var lang = getLang();
    var sheet = document.getElementById("printSheet");
    sheet.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0d5c4b;padding-bottom:18px;">' +
        "<div><strong style='font-size:1.4rem;'>" + escapeHtml(brand) + "</strong><br>" + escapeHtml(window.SITE_CONFIG.owner.name) + "<br>" + escapeHtml(window.SITE_CONFIG.contact.city) + "</div>" +
        "<div style='text-align:end;'><h2 style='margin:0;'>" + escapeHtml(adminT("printQuoteTitle")) + "</h2><strong>" + escapeHtml(quote.id) + "</strong></div>" +
      "</div>" +
      '<div class="print-grid">' +
        "<div><span>" + escapeHtml(adminT("printDate")) + "</span>" + escapeHtml(formatDate(quote.createdAt)) + "</div>" +
        "<div><span>" + escapeHtml(adminT("printValid")) + "</span>" + escapeHtml(quote.validDays || "-") + " days</div>" +
        "<div><span>" + escapeHtml(adminT("printClient")) + "</span>" + escapeHtml(quote.clientName || "-") + "</div>" +
        "<div><span>" + escapeHtml(adminT("printCountry")) + "</span>" + escapeHtml(quote.country || "-") + "</div>" +
        "<div><span>" + escapeHtml(adminT("printProduct")) + "</span>" + escapeHtml(quote.product || "-") + "</div>" +
        "<div><span>" + escapeHtml(adminT("printQty")) + "</span>" + escapeHtml(quote.quantity || "-") + "</div>" +
        "<div><span>" + escapeHtml(adminT("printPrice")) + "</span>" + escapeHtml(currency + " " + quote.unitPrice) + "</div>" +
      "</div>" +
      '<div class="print-total">' + escapeHtml(adminT("total")) + ": " + escapeHtml(currency + " " + total) + "</div>" +
      (quote.notes ? '<p style="margin-top:22px;"><strong>' + escapeHtml(adminT("printNotes")) + '</strong><br>' + escapeHtml(quote.notes) + "</p>" : "");
    document.getElementById("printOverlay").hidden = false;
  }

  function bindEvents() {
    document.querySelectorAll(".admin-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        document.querySelectorAll(".admin-tab").forEach(function (item) { item.classList.remove("active"); });
        document.querySelectorAll(".admin-panel").forEach(function (panel) { panel.classList.remove("active"); });
        tab.classList.add("active");
        document.getElementById(tab.getAttribute("data-tab") === "leads" ? "leadsPanel" : "quotesPanel").classList.add("active");
      });
    });

    document.getElementById("manualQuoteForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      var data = new FormData(form);
      var record = {
        clientName: String(data.get("clientName") || "").trim(),
        product: String(data.get("product") || "").trim(),
        quantity: Number(data.get("quantity") || 0),
        unitPrice: Number(data.get("unitPrice") || 0),
        currency: String(data.get("currency") || "USD"),
        validDays: Number(data.get("validDays") || 15),
        notes: String(data.get("notes") || "").trim(),
        status: "quoted"
      };
      window.CRM.add("quotes", record);
      form.reset();
      render();
    });

    document.getElementById("leadsTable").addEventListener("change", function (event) {
      if (!event.target.matches("[data-lead-status]")) return;
      window.CRM.update("leads", event.target.getAttribute("data-id"), { status: event.target.value });
      render();
    });

    document.getElementById("leadsTable").addEventListener("click", function (event) {
      var button = event.target.closest("[data-lead-quote], [data-lead-delete]");
      if (!button) return;
      var id = button.getAttribute("data-id");
      var lead = window.CRM.load("leads").find(function (item) { return item.id === id; });
      if (button.hasAttribute("data-lead-quote") && lead) {
        showQuoteFromLead(lead);
      }
      if (button.hasAttribute("data-lead-delete") && confirm(adminT("deleteConfirm"))) {
        window.CRM.remove("leads", id);
        render();
      }
    });

    document.getElementById("quotesTable").addEventListener("click", function (event) {
      var button = event.target.closest("[data-quote-print], [data-quote-delete]");
      if (!button) return;
      var id = button.getAttribute("data-id");
      if (button.hasAttribute("data-quote-print")) {
        printQuote(id);
      }
      if (button.hasAttribute("data-quote-delete") && confirm(adminT("deleteConfirm"))) {
        window.CRM.remove("quotes", id);
        render();
      }
    });

    document.getElementById("exportCsv").addEventListener("click", downloadCsv);
    document.getElementById("refreshAdmin").addEventListener("click", render);
    document.getElementById("closePrint").addEventListener("click", function () {
      document.getElementById("printOverlay").hidden = true;
    });
  }

  window.initAdmin = function () {
    if (!bound) {
      bindEvents();
      bound = true;
    }
    render();
  };
})();
