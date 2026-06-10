(function () {
  "use strict";

  function calculateScore(scenario, selectedIds, lang = "es") {
    const selected = new Set(selectedIds || []);
    const elements = scenario.elements || [];
    const suspiciousIds = new Set(elements.filter((item) => item.is_suspicious).map((item) => item.id));
    const safeIds = new Set(elements.filter((item) => !item.is_suspicious).map((item) => item.id));

    const correctHits = [...selected].filter((id) => suspiciousIds.has(id));
    const missed = [...suspiciousIds].filter((id) => !selected.has(id));
    const falsePositives = [...selected].filter((id) => safeIds.has(id));

    const totalSuspicious = Math.max(suspiciousIds.size, 1);
    const baseScore = (correctHits.length / totalSuspicious) * 100;
    const penalty = falsePositives.length * 10;
    const score = Math.max(0, Math.min(100, Math.round(baseScore - penalty)));

    return {
      score,
      level: getLevel(score, lang),
      correct_hits: correctHits,
      missed,
      false_positives: falsePositives,
      details: buildDetails(elements, selected)
    };
  }

  function getLevel(score, lang = "es") {
    if (lang === "en") {
      if (score >= 90) return "Excellent detection";
      if (score >= 70) return "Good judgment";
      if (score >= 40) return "In training";
      return "High risk";
    }

    if (score >= 90) return "Excelente detección";
    if (score >= 70) return "Buen criterio";
    if (score >= 40) return "En entrenamiento";
    return "Riesgo alto";
  }

  function buildDetails(elements, selected) {
    return elements.map((item) => {
      const wasSelected = selected.has(item.id);
      let status = "safe";

      if (item.is_suspicious && wasSelected) status = "correct";
      else if (item.is_suspicious && !wasSelected) status = "missed";
      else if (!item.is_suspicious && wasSelected) status = "false_positive";

      return {
        id: item.id,
        label: item.label,
        display: item.display,
        is_suspicious: item.is_suspicious,
        was_selected: wasSelected,
        status,
        explanation: item.explanation
      };
    });
  }

  window.PhishGuardScoring = {
    calculateScore,
    getLevel,
    buildDetails
  };
})();
