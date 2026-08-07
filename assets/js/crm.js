(function (root) {
  var PREFIX = "globalroots_crm_";

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
    computeQuote: computeQuote
  };
})(typeof window !== "undefined" ? window : globalThis);
