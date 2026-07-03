// Answer explanations for the ASVAB question bank, keyed by question id
// (matches js/quiz-data.js question.id, e.g. "AR042"). One concise explanation
// per question. Loaded ON DEMAND (results review + tutor mode) via
// js/load-explanations.js — NEVER during a timed quiz.
// Contract enforced by scripts/validate-site.js. Format + authoring process:
// docs/superpowers/specs/2026-07-02-explanations-tutor-mode-design.md
(function (root) {
  const QUIZ_EXPLANATIONS = {
    // Populated in per-section batches (Phase C). Key = question id string.
  };

  root.QUIZ_EXPLANATIONS = QUIZ_EXPLANATIONS;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = QUIZ_EXPLANATIONS;
  }
})(typeof window !== 'undefined' ? window : this);
