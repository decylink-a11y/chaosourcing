const assert = require("node:assert");
const crm = require("./assets/js/crm.js");

assert(crm.uid("INQ").startsWith("INQ-"));
assert.strictEqual(crm.computeQuote(10, 5), 50);
assert.strictEqual(crm.computeQuote(-2, 5), 0);

const csv = crm.exportCsv([{ name: "A, B", note: 'x"y' }]);
assert(csv.includes('"A, B"'));
assert(csv.includes('"x""y"'));

console.log("CRM checks passed");
