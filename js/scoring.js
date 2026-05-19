// Shared scoring helpers for practice-test result estimates.
(function (root) {
  const AFQT_SECTIONS = root.MissionASVABConfig?.AFQT_SECTIONS || ['AR', 'WK', 'PC', 'MK'];

  function getSectionPercent(sectionResults, code) {
    const section = sectionResults && sectionResults[code];
    if (!section || !section.total) return 0;
    return Math.round((section.correct / section.total) * 100);
  }

  function calculateAFQTEstimate(sectionResults) {
    if (!sectionResults) return null;

    const hasAFQTSection = AFQT_SECTIONS.some((code) => sectionResults[code]);
    if (!hasAFQTSection) return null;

    const arScore = getSectionPercent(sectionResults, 'AR');
    const mkScore = getSectionPercent(sectionResults, 'MK');
    const wkScore = getSectionPercent(sectionResults, 'WK');
    const pcScore = getSectionPercent(sectionResults, 'PC');
    const veScore = (wkScore + pcScore) / 2;
    const rawAFQT = (2 * veScore + arScore + mkScore) / 4;

    return Math.min(99, Math.max(1, Math.round(rawAFQT)));
  }

  function calculateLineScores(sectionResults) {
    if (!sectionResults) return null;

    const requiredSections = ['AR', 'WK', 'PC', 'MK', 'GS', 'AS', 'MC', 'EI'];
    const hasSections = requiredSections.filter((code) => sectionResults[code]).length;
    if (hasSections < 5) return null;

    const wkScore = getSectionPercent(sectionResults, 'WK');
    const pcScore = getSectionPercent(sectionResults, 'PC');
    const veScore = Math.round((wkScore + pcScore) / 2);
    const arScore = getSectionPercent(sectionResults, 'AR');
    const mkScore = getSectionPercent(sectionResults, 'MK');
    const gsScore = getSectionPercent(sectionResults, 'GS');
    const asScore = getSectionPercent(sectionResults, 'AS');
    const mcScore = getSectionPercent(sectionResults, 'MC');
    const eiScore = getSectionPercent(sectionResults, 'EI');

    return {
      GT: { name: 'General Technical', score: Math.round((veScore + arScore) * 0.75) },
      CL: { name: 'Clerical', score: Math.round((veScore + arScore + mkScore) * 0.5) },
      CO: { name: 'Combat', score: Math.round((arScore + asScore + mcScore) * 0.5) },
      EL: { name: 'Electronics', score: Math.round((gsScore + arScore + mkScore + eiScore) * 0.375) },
      FA: { name: 'Field Artillery', score: Math.round((arScore + mkScore + mcScore) * 0.5) },
      GM: { name: 'General Maintenance', score: Math.round((gsScore + asScore + mkScore + eiScore) * 0.375) },
      MM: { name: 'Mechanical Maintenance', score: Math.round((asScore + mcScore + eiScore) * 0.5) },
      OF: { name: 'Operators & Food', score: Math.round((veScore + asScore + mcScore) * 0.5) },
      SC: { name: 'Surveillance & Comms', score: Math.round((veScore + arScore + asScore + mcScore) * 0.375) },
      ST: { name: 'Skilled Technical', score: Math.round((veScore + gsScore + mkScore + mcScore) * 0.375) }
    };
  }

  const api = {
    getSectionPercent,
    calculateAFQTEstimate,
    calculateLineScores
  };

  root.MissionASVABScoring = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
