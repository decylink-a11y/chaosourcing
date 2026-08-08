(function (root) {
  var PREFIX = "globalroots_crm_";
  var ADMIN_KEY = "globalroots_crm_admin";

  function load(kind) {
    try {
      var raw = localStorage.getItem(PREFIX + kind);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (error) {
      return [];
    }
  }

  function save(kind, records) {
    localStorage.setItem(PREFIX + kind, JSON.stringify(records));
    return records;
  }

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function add(kind, record) {
    var records = load(kind);
    var prefix = kind === "quotes" ? "QT" : "INQ";
    record.id = uid(prefix);
    record.createdAt = new Date().toISOString();
    records.unshift(record);
    save(kind, records);
    return record;
  }

  function update(kind, id, patch) {
    var records = load(kind);
    var target = records.find(function (item) { return item.id === id; });
    if (!target) return null;
    Object.assign(target, patch);
    save(kind, records);
    return target;
  }

  function remove(kind, id) {
    var records = load(kind).filter(function (item) { return item.id !== id; });
    save(kind, records);
    return records;
  }

  function exportCsv(records) {
    if (!records || !records.length) return "";
    var headers = Object.keys(records[0]);
    var escape = function (value) {
      var text = value === null || value === undefined ? "" : String(value);
      return '"' + text.replace(/"/g, '""') + '"';
    };
    var lines = [headers.map(escape).join(",")];
    records.forEach(function (record) {
      lines.push(headers.map(function (key) { return escape(record[key]); }).join(","));
    });
    return lines.join("\r\n");
  }

  function computeQuote(quantity, unitPrice) {
    var qty = Number(quantity) || 0;
    var unit = Number(unitPrice) || 0;
    return Math.max(0, qty) * Math.max(0, unit);
  }

  function apiUrl(kind, id) {
    var base = (window.SITE_CONFIG && window.SITE_CONFIG.apiBase) || "";
    var url = base + "/api/crm?kind=" + encodeURIComponent(kind);
    if (id) url += "&id=" + encodeURIComponent(id);
    return url;
  }

  function apiRequest(method, kind, payload, id) {
    var options = {
      method: method,
      headers: { "Content-Type": "application/json" }
    };
    var token = root.sessionStorage ? root.sessionStorage.getItem(ADMIN_KEY) : "";
    if (token) options.headers["X-Admin-Password"] = token;
    if (payload) options.body = JSON.stringify(payload);
    return root.fetch(apiUrl(kind, id), options).then(function (response) {
      if (!response.ok) throw new Error("CRM API " + response.status);
      return response.json();
    });
  }

  function loginAdmin(password) {
    var options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": password
      }
    };
    return root.fetch(apiUrl("leads"), options).then(function (response) {
      if (!response.ok) throw new Error("Invalid admin password");
      root.sessionStorage.setItem(ADMIN_KEY, password);
      return true;
    });
  }

  function logoutAdmin() {
    root.sessionStorage.removeItem(ADMIN_KEY);
  }

  function loadRemote(kind) {
    return apiRequest("GET", kind).then(function (body) {
      return (body.data || []).map(function (row) {
        var data = row.data || {};
        var record = {};
        Object.keys(data).forEach(function (key) {
          record[key] = data[key];
        });
        record.id = row.id || record.id;
        record.createdAt = record.createdAt || row.created_at;
        record.updatedAt = row.updated_at;
        return record;
      });
    });
  }

  function addRemote(kind, record) {
    return apiRequest("POST", kind, record).then(function (body) {
      return Object.assign({}, record, { id: body.id || record.id });
    });
  }

  function updateRemote(kind, id, patch) {
    return apiRequest("PATCH", kind, patch, id).then(function () {
      return true;
    });
  }

  function removeRemote(kind, id) {
    return apiRequest("DELETE", kind, null, id).then(function () {
      return true;
    });
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { uid: uid, exportCsv: exportCsv, computeQuote: computeQuote };
  }

  root.CRM = {
    load: load,
    save: save,
    add: add,
    update: update,
    remove: remove,
    exportCsv: exportCsv,
    computeQuote: computeQuote,
    loadRemote: loadRemote,
    addRemote: addRemote,
    updateRemote: updateRemote,
    removeRemote: removeRemote,
    loginAdmin: loginAdmin,
    logoutAdmin: logoutAdmin
  };
})(typeof window !== "undefined" ? window : globalThis);
