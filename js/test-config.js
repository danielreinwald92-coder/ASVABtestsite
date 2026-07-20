// Shared test configuration for Mission ASVAB.
(function (root) {
  const TEST_CONFIGS = {
    diagnostic: {
      type: 'diagnostic',
      label: 'Starting-Point Diagnostic',
      title: '20-Minute Starting-Point Diagnostic',
      sectionCode: 'AFQT AREAS',
      description: 'A short, independent practice diagnostic across Arithmetic Reasoning, Mathematics Knowledge, Word Knowledge, and Paragraph Comprehension. It gives you a study starting point, not an official score or guaranteed predictor.',
      startButtonText: 'Start 20-Minute Diagnostic',
      sections: ['AR', 'WK', 'PC', 'MK'],
      sectionOverrides: {
        AR: { questionsPerTest: 4, timeLimit: 6 * 60, difficultyPlan: [2, 2, 3, 4] },
        WK: { questionsPerTest: 6, timeLimit: 3 * 60, difficultyPlan: [2, 2, 3, 3, 3, 4] },
        PC: { questionsPerTest: 4, timeLimit: 6 * 60, difficultyPlan: [2, 2, 3, 4] },
        MK: { questionsPerTest: 4, timeLimit: 5 * 60, difficultyPlan: [2, 2, 3, 4] }
      }
    },
    quick: {
      type: 'quick',
      label: 'AFQT Practice',
      title: 'AFQT Practice Test',
      sectionCode: 'AFQT',
      description: 'The 4 sections that determine your AFQT score: Arithmetic Reasoning, Word Knowledge, Paragraph Comprehension, and Mathematics Knowledge.',
      startButtonText: 'Start AFQT Practice',
      sections: ['AR', 'WK', 'PC', 'MK']
    },
    full: {
      type: 'full',
      label: 'Full ASVAB',
      title: 'Full ASVAB Practice',
      sectionCode: 'ALL',
      description: 'Complete all 8 CAT-ASVAB sections for your AFQT score plus line scores that determine MOS qualification.',
      startButtonText: 'Start Full ASVAB Test',
      sections: ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC']
    }
  };

  const AFQT_SECTIONS = ['AR', 'WK', 'PC', 'MK'];

  function getTestConfig(type) {
    return TEST_CONFIGS[type] || TEST_CONFIGS.quick;
  }

  function getSectionsForType(type) {
    return [...getTestConfig(type).sections];
  }

  function getSectionSettings(type, code, quizManager) {
    const config = getTestConfig(type);
    const base = quizManager && quizManager.getSectionInfo
      ? quizManager.getSectionInfo(code)
      : null;
    const override = config.sectionOverrides && config.sectionOverrides[code];
    if (!base && !override) return null;
    return { ...(base || {}), ...(override || {}) };
  }

  function getTestTypeFromSections(sections) {
    if (!Array.isArray(sections)) return 'single';
    if (sections.length === TEST_CONFIGS.quick.sections.length &&
      TEST_CONFIGS.quick.sections.every((code, index) => sections[index] === code)) {
      return 'afqt';
    }
    if (sections.length === TEST_CONFIGS.full.sections.length &&
      TEST_CONFIGS.full.sections.every((code, index) => sections[index] === code)) {
      return 'full';
    }
    return sections.length === 1 ? 'single' : 'custom';
  }

  function getTestDetails(type, quizManager) {
    const config = getTestConfig(type);
    const details = config.sections.reduce((currentDetails, code) => {
      const sectionInfo = getSectionSettings(type, code, quizManager);

      if (sectionInfo) {
        currentDetails.totalQuestions += sectionInfo.questionsPerTest;
        currentDetails.totalTimeSeconds += sectionInfo.timeLimit;
      }

      return currentDetails;
    }, {
      totalQuestions: 0,
      totalTimeSeconds: 0,
      totalTimeMinutes: 0
    });

    details.totalTimeMinutes = Math.ceil(details.totalTimeSeconds / 60);
    return details;
  }

  const api = {
    AFQT_SECTIONS,
    TEST_CONFIGS,
    getTestConfig,
    getSectionsForType,
    getSectionSettings,
    getTestTypeFromSections,
    getTestDetails
  };

  root.MissionASVABConfig = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
