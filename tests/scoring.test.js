const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function loadBrowserScript(path, context) {
  vm.runInNewContext(fs.readFileSync(path, "utf8"), context, { filename: path });
}

const context = { window: {} };
loadBrowserScript("web/assets/js/data.js", context);
loadBrowserScript("web/assets/js/scoring.js", context);

const data = context.window.PHISHGUARD_DATA;
const scoring = context.window.PhishGuardScoring;

assert.ok(data, "PHISHGUARD_DATA should be available");
assert.ok(scoring, "PhishGuardScoring should be available");

for (const lang of data.supportedLangs) {
  const scenarios = data.scenarios[lang];
  assert.ok(Array.isArray(scenarios), `${lang} scenarios should be an array`);
  assert.ok(scenarios.length > 0, `${lang} should include scenarios`);

  for (const scenario of scenarios) {
    assert.ok(scenario.id, "scenario should include id");
    assert.ok(scenario.title, `${scenario.id} should include title`);
    assert.ok(Array.isArray(scenario.elements), `${scenario.id} should include elements`);
    assert.ok(
      scenario.elements.some((element) => element.is_suspicious),
      `${scenario.id} should include at least one suspicious element`
    );

    const suspiciousIds = scenario.elements
      .filter((element) => element.is_suspicious)
      .map((element) => element.id);
    const safeIds = scenario.elements
      .filter((element) => !element.is_suspicious)
      .map((element) => element.id);

    assert.equal(scoring.calculateScore(scenario, suspiciousIds, lang).score, 100);

    if (safeIds.length) {
      const result = scoring.calculateScore(scenario, [safeIds[0]], lang);
      assert.ok(result.score < 100, `${scenario.id} should penalize false positives`);
      assert.equal(result.false_positives.length, 1);
    }
  }
}

console.log("scoring.test.js passed");
