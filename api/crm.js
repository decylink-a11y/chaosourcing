const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function send(res, status, body) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(status).json(body);
}

function idFor(kind) {
  const prefix = kind === "quotes" ? "QT" : "INQ";
  return prefix + "-" + crypto.randomUUID().slice(0, 8).toUpperCase();
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return send(res, 200, { ok: true });
  }

  const kind = req.query.kind === "quotes" ? "quotes" : "leads";

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("crm_records")
      .select("*")
      .eq("kind", kind)
      .order("created_at", { ascending: false });
    if (error) return send(res, 500, { error: error.message });
    return send(res, 200, { data });
  }

  if (req.method === "POST") {
    const record = req.body || {};
    const id = record.id || idFor(kind);
    const { error } = await supabase.from("crm_records").insert({
      id,
      kind,
      data: record
    });
    if (error) return send(res, 500, { error: error.message });
    return send(res, 201, { id });
  }

  if (req.method === "PATCH") {
    const id = req.query.id;
    const { error } = await supabase
      .from("crm_records")
      .update({
        data: req.body || {},
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
    if (error) return send(res, 500, { error: error.message });
    return send(res, 200, { ok: true });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    const { error } = await supabase.from("crm_records").delete().eq("id", id);
    if (error) return send(res, 500, { error: error.message });
    return send(res, 200, { ok: true });
  }

  return send(res, 405, { error: "Method not allowed" });
};
