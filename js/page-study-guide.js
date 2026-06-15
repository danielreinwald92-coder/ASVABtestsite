// Page logic for study-guide.html (study-guide SPA)
// Externalized from an inline <script> (CSP script-src hardening).
// Inline on* attributes were replaced with a single delegated click listener
// keyed off data-action/data-* hooks. Loaded at end of <body> after
// js/section-config.js and js/quiz-data.js; courses.js is lazy-loaded on demand.
(function () {
    let currentCourse = null, currentChapter = null, currentQuiz = null;
    let currentQuestionIndex = 0, score = 0, selectedOption = null, answered = false;
    let completedChapters = JSON.parse(localStorage.getItem('completedChapters') || '{}');

    // Vocabulary flashcards for Word Knowledge
    const vocabFlashcards = [
      { word: 'Abate', definition: 'To reduce or lessen', example: 'The storm began to abate after midnight.' },
      { word: 'Candid', definition: 'Honest and straightforward', example: 'She gave a candid assessment of the situation.' },
      { word: 'Diligent', definition: 'Hardworking and careful', example: 'The diligent student studied every night.' },
      { word: 'Elusive', definition: 'Hard to catch or define', example: 'The elusive answer finally came to him.' },
      { word: 'Frugal', definition: 'Careful with money, not wasteful', example: 'His frugal habits helped him save money.' },
      { word: 'Gregarious', definition: 'Sociable, enjoys company', example: 'The gregarious host welcomed every guest.' },
      { word: 'Hinder', definition: 'To slow down or obstruct', example: 'Bad weather will hinder our progress.' },
      { word: 'Imminent', definition: 'About to happen very soon', example: 'The imminent deadline caused stress.' },
      { word: 'Jovial', definition: 'Cheerful and friendly', example: 'His jovial personality made everyone smile.' },
      { word: 'Keen', definition: 'Sharp, eager, or intense', example: 'She has a keen eye for detail.' },
      { word: 'Lethargic', definition: 'Sluggish, lacking energy', example: 'The hot weather made everyone lethargic.' },
      { word: 'Mundane', definition: 'Ordinary, not exciting', example: 'He was bored with mundane daily tasks.' },
      { word: 'Novice', definition: 'A beginner', example: 'As a novice, she needed extra training.' },
      { word: 'Obsolete', definition: 'No longer used or outdated', example: 'Typewriters are now obsolete.' },
      { word: 'Prudent', definition: 'Wise and careful in decisions', example: 'It was prudent to save for emergencies.' },
      { word: 'Resilient', definition: 'Able to recover quickly', example: 'The resilient team bounced back from defeat.' },
      { word: 'Sparse', definition: 'Thinly scattered, not dense', example: 'The sparse vegetation offered little shade.' },
      { word: 'Tenacious', definition: 'Persistent, not giving up', example: 'Her tenacious attitude led to success.' },
      { word: 'Urbane', definition: 'Sophisticated and polished', example: 'The urbane diplomat handled the situation well.' },
      { word: 'Viable', definition: 'Capable of working or succeeding', example: 'Is this a viable solution to the problem?' },
      { word: 'Wary', definition: 'Cautious, on guard', example: 'Be wary of offers that seem too good.' },
      { word: 'Zealous', definition: 'Very enthusiastic', example: 'The zealous volunteers worked all day.' },
      { word: 'Ambiguous', definition: 'Having more than one meaning, unclear', example: 'The ambiguous instructions confused everyone.' },
      { word: 'Brevity', definition: 'Shortness, being brief', example: 'The brevity of his speech was appreciated.' },
      { word: 'Concise', definition: 'Brief but complete', example: 'Write a concise summary of the article.' },
      { word: 'Denounce', definition: 'To publicly criticize', example: 'Leaders denounced the violent actions.' },
      { word: 'Exemplary', definition: 'Serving as an excellent example', example: 'Her exemplary work earned a promotion.' },
      { word: 'Feasible', definition: 'Possible and practical', example: 'The plan was feasible within our budget.' },
      { word: 'Gratuitous', definition: 'Unnecessary, uncalled for', example: 'The movie had gratuitous violence.' },
      { word: 'Hypothetical', definition: 'Based on assumption, not real', example: 'Let\'s consider a hypothetical situation.' }
    ];

    // Formula data for cheat sheet and flashcards - ASVAB essentials only
    const formulaData = {
      'Percentages': [
        { name: 'Find the Part', formula: 'Part = Whole × Percent', description: 'Convert percent to decimal first (20% = 0.20)', example: '20% of 150 = 150 × 0.20 = 30' },
        { name: 'Find the Percent', formula: 'Percent = Part ÷ Whole', description: 'Divide then multiply by 100', example: '30 out of 150 = 30÷150 = 0.20 = 20%' }
      ],
      'Proportions': [
        { name: 'Cross Multiply', formula: 'a/b = c/d → a×d = b×c', description: 'The #1 most useful trick on the ASVAB', example: '3/4 = x/20 → 3×20 = 4×x → x = 15' },
        { name: 'Unit Rate', formula: 'Rate = Total ÷ Units', description: 'Find the cost or value per one item', example: '$45 for 5 items = $9 each' }
      ],
      'Distance, Rate, Time': [
        { name: 'Distance', formula: 'Distance = Rate × Time', description: 'How far you travel', example: '60 mph × 2 hours = 120 miles' },
        { name: 'Rate', formula: 'Rate = Distance ÷ Time', description: 'How fast you go', example: '120 miles ÷ 2 hours = 60 mph' },
        { name: 'Time', formula: 'Time = Distance ÷ Rate', description: 'How long it takes', example: '120 miles ÷ 60 mph = 2 hours' }
      ],
      'Area': [
        { name: 'Rectangle', formula: 'A = length × width', description: 'Multiply the two sides', example: '8 × 5 = 40 square feet' },
        { name: 'Triangle', formula: 'A = ½ × base × height', description: 'Half of base times height', example: '½ × 10 × 6 = 30' },
        { name: 'Circle', formula: 'A = π × r²', description: 'Pi (3.14) times radius squared', example: '3.14 × 5² = 78.5' }
      ],
      'Perimeter': [
        { name: 'Rectangle', formula: 'P = 2l + 2w', description: 'Add all four sides', example: '2(8) + 2(5) = 26 feet' },
        { name: 'Circle (Circumference)', formula: 'C = π × diameter', description: 'Pi times the diameter across', example: '3.14 × 10 = 31.4' }
      ],
      'Right Triangles': [
        { name: 'Pythagorean Theorem', formula: 'a² + b² = c²', description: 'Two short sides squared = long side squared', example: '3² + 4² = 5² → 9 + 16 = 25 ✓' }
      ],
      'Averages': [
        { name: 'Mean (Average)', formula: 'Average = Sum ÷ Count', description: 'Add all numbers, divide by how many', example: '(80 + 90 + 100) ÷ 3 = 90' }
      ]
    };

    // Video resources by section
    const videoResources = {
      AR: [
        { id: 'O0brxMViHuk', title: 'ASVAB Study Guide - Arithmetic Reasoning Review', channel: 'Mometrix Test Preparation' },
        { id: 'JsNDcbUPKEI', title: 'How to Solve ASVAB Arithmetic Reasoning Word Problems', channel: 'ASVAB Boot Camp' },
        { id: 'BHc3Bjb3BIc', title: 'Arithmetic Reasoning Practice Test (115 Questions)', channel: 'Grammar Hero' }
      ],
      MK: [
        { id: 'LJ14urgyIGA', title: 'ASVAB Mathematics Knowledge 2023', channel: 'The Organic Chemistry Tutor' },
        { id: 'e5fpdRtRMMk', title: 'ASVAB 2025 Mathematical Knowledge Practice Test', channel: 'ASVAB Coach' },
        { id: 'HUsYt61FkxI', title: 'Math Knowledge: Algebra & Word Problem Practice', channel: 'ASVAB Boot Camp' }
      ],
      WK: [
        { id: 'jcnZpzGr8s4', title: 'ASVAB Word Knowledge Study Guide', channel: 'Mometrix Test Preparation' },
        { id: 'opftbWXzDFY', title: 'How to Raise Your Word Knowledge Score', channel: 'ASVAB Boot Camp' },
        { id: 'G_4wCzm1JYU', title: 'Word Knowledge Practice Test (40 Questions)', channel: 'ASVAB Coach' }
      ],
      PC: [
        { id: 'LrTL3sl1F9k', title: 'ASVAB Paragraph Comprehension Study Guide', channel: 'Mometrix Test Preparation' },
        { id: 'FAT3Zlut11Y', title: 'How to Raise Your PC Score', channel: 'ASVAB Boot Camp' },
        { id: 'd4MRxAPoW28', title: 'How to PASS Paragraph Comprehension (2 Hour Class)', channel: 'ASVAB Coach' }
      ]
    };

    // Section Practice state
    let sectionPractice = {
      code: null,
      questions: [],
      answers: {},
      currentIndex: 0,
      timeLimit: 0,
      timeRemaining: 0,
      timerInterval: null
    };

    function showView(name) {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById(name + '-view').classList.add('active');
      window.scrollTo(0, 0);
    }

    function shuffleArray(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    // Lazy-load the large course data bundle (js/courses.js, ~217KB) on demand
    // instead of as a render-blocking <script> in the initial page load.
    // courses.js declares a top-level `const courses` shared across classic
    // scripts, so once it executes the bare `courses` identifier is available
    // here. The promise is cached so the script is only ever injected once.
    let _coursesPromise = null;
    function loadCourses() {
      if (typeof courses !== 'undefined') return Promise.resolve();
      if (_coursesPromise) return _coursesPromise;
      _coursesPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'js/courses.js';
        s.onload = () => {
          if (typeof courses !== 'undefined') resolve();
          else reject(new Error('courses.js loaded but `courses` is undefined'));
        };
        s.onerror = () => reject(new Error('Failed to load js/courses.js'));
        document.head.appendChild(s);
      });
      return _coursesPromise;
    }

    async function initHome() {
      try {
        await loadCourses();
      } catch (e) {
        console.error(e);
      }
      const grid = document.getElementById('course-grid');
      grid.innerHTML = '';

      const allCourses = [
        { code: 'AR', available: true },
        { code: 'MK', available: true },
        { code: 'WK', available: true },
        { code: 'PC', available: true }
      ];

      allCourses.forEach(({code, available}) => {
        const course = (typeof courses !== 'undefined') ? courses[code] : null;
        const card = document.createElement('div');

        if (course && available) {
          const done = course.chapters.filter(ch => completedChapters[ch.id]).length;
          card.className = 'course-card';
          card.onclick = () => showCourse(code);
          card.innerHTML = `
            <div class="icon">${course.icon}</div>
            <h3>${course.name}</h3>
            <p>${course.description}</p>
            <div class="meta">${course.chapters.length} chapters • ${done}/${course.chapters.length} completed</div>
          `;
        } else {
          const names = { MK: 'Math Knowledge', WK: 'Word Knowledge', PC: 'Paragraph Comprehension' };
          const icons = { MK: '🔢', WK: '📖', PC: '📄' };
          card.className = 'course-card coming-soon';
          card.innerHTML = `
            <div class="icon">${icons[code]}</div>
            <h3>${names[code]}</h3>
            <p>Coming soon</p>
            <div class="meta">In development</div>
          `;
        }
        grid.appendChild(card);
      });
    }

    function showCourse(code) {
      currentCourse = courses[code];
      currentCourse.code = code;
      showView('course');
      document.getElementById('course-header').innerHTML = `
        <div class="icon">${currentCourse.icon}</div>
        <h1>${currentCourse.name}</h1>
        <p>${currentCourse.description}</p>
      `;
      const list = document.getElementById('chapter-list');
      list.innerHTML = '';
      currentCourse.chapters.forEach((ch, i) => {
        const done = completedChapters[ch.id];
        const card = document.createElement('div');
        card.className = 'chapter-card' + (done ? ' completed' : '');
        card.onclick = () => showLesson(ch);
        card.innerHTML = `
          <div class="chapter-num">${done ? '✓' : i + 1}</div>
          <div class="chapter-info"><h3>${ch.title}</h3><p>${ch.description}</p></div>
          <div class="chapter-arrow">→</div>
        `;
        list.appendChild(card);
      });

      // Add Video Resources section
      const videos = videoResources[code];
      if (videos && videos.length > 0) {
        const videoSection = document.createElement('div');
        videoSection.className = 'video-resources';
        videoSection.innerHTML = `
          <div class="video-resources-header">
            <div class="yt-icon"></div>
            <h3>Video Resources</h3>
          </div>
          <div class="video-grid">
            ${videos.map(v => `
              <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" class="video-card">
                <div class="video-thumbnail">
                  <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" loading="lazy">
                  <div class="video-play-btn"></div>
                </div>
                <div class="video-info">
                  <h4>${v.title}</h4>
                  <span class="channel">${v.channel}</span>
                </div>
              </a>
            `).join('')}
          </div>
        `;
        list.appendChild(videoSection);
      }

      // Add Study Tools section (contextual to course)
      const toolsSection = document.createElement('div');
      toolsSection.className = 'video-resources'; // reuse styling

      if (code === 'AR' || code === 'MK') {
        toolsSection.innerHTML = `
          <div class="video-resources-header">
            <h3>📚 Study Tools</h3>
          </div>
          <div class="tools-grid">
            <div class="tool-card" data-action="show-flashcards" data-type="formulas">
              <div class="icon">🃏</div>
              <h3>Formula Flashcards</h3>
              <p>Drill the essential math formulas</p>
            </div>
            <div class="tool-card" data-action="show-formulas">
              <div class="icon">📋</div>
              <h3>Formula Cheat Sheet</h3>
              <p>Quick reference for all formulas</p>
            </div>
          </div>
        `;
        list.appendChild(toolsSection);
      } else if (code === 'WK') {
        toolsSection.innerHTML = `
          <div class="video-resources-header">
            <h3>📚 Study Tools</h3>
          </div>
          <div class="tools-grid">
            <div class="tool-card" data-action="show-flashcards" data-type="vocab">
              <div class="icon">🃏</div>
              <h3>Vocabulary Flashcards</h3>
              <p>Learn 30 common ASVAB words</p>
            </div>
          </div>
        `;
        list.appendChild(toolsSection);
      }

      // Add Section Practice card
      const completedCount = currentCourse.chapters.filter(ch => completedChapters[ch.id]).length;
      const allCompleted = completedCount === currentCourse.chapters.length;
      const sectionConfig = asvabData.sections[code];
      const timeMinutes = sectionConfig ? Math.floor(sectionConfig.timeLimit / 60) : 15;
      const questionCount = sectionConfig ? sectionConfig.questionsPerTest : 15;

      const practiceCard = document.createElement('div');
      practiceCard.className = 'section-practice-card' + (allCompleted ? '' : ' locked');
      practiceCard.innerHTML = allCompleted ? `
        <span class="badge">Ready to Practice</span>
        <h3>Section Practice Test</h3>
        <p>Test your knowledge with a timed practice quiz using real ASVAB-style questions.</p>
        <div class="meta">${questionCount} questions • ${timeMinutes} minutes • Timed</div>
        <button class="section-practice-btn" data-action="start-section-practice" data-code="${code}">Start Practice Test →</button>
      ` : `
        <span class="badge">Locked</span>
        <h3>Section Practice Test</h3>
        <p>Complete all ${currentCourse.chapters.length} chapters to unlock the timed practice test.</p>
        <div class="meta">${completedCount}/${currentCourse.chapters.length} chapters completed</div>
      `;
      list.appendChild(practiceCard);
    }

    function showLesson(chapter) {
      currentChapter = chapter;
      showView('lesson');
      document.getElementById('lesson-back-btn').onclick = () => showCourse(Object.keys(courses).find(k => courses[k] === currentCourse));

      let html = `
        <div class="lesson-header">
          <p class="chapter-label">Chapter ${currentCourse.chapters.indexOf(chapter) + 1}</p>
          <h2>${chapter.title}</h2>
        </div>
        <div class="lesson-intro">${chapter.lesson.intro}</div>
      `;

      chapter.lesson.concepts.forEach(c => {
        const visual = c.svg ? `<div class="diagram-svg">${c.svg}</div>` : (c.diagram ? `<pre class="diagram">${c.diagram}</pre>` : '');
        html += `<div class="concept-section"><h3>${c.title}</h3><p>${c.content}</p>${visual}</div>`;
      });

      chapter.lesson.examples.forEach(ex => {
        const visual = ex.svg ? `<div class="diagram-svg">${ex.svg}</div>` : (ex.diagram ? `<pre class="diagram">${ex.diagram}</pre>` : '');
        html += `
          <div class="example-box">
            <h4>Worked Example</h4>
            <p class="problem">${ex.problem}</p>
            ${visual}
            ${ex.steps.map((s, i) => `<div class="step"><span class="step-num">${i + 1}</span><span class="step-text">${s}</span></div>`).join('')}
            ${ex.tip ? `<div class="tip-box"><strong>💡 Tip:</strong> ${ex.tip}</div>` : ''}
          </div>
        `;
      });

      html += `
        <div class="summary-box"><h4>Key Takeaway</h4><p>${chapter.lesson.summary}</p></div>
        <button class="start-quiz-btn" data-action="start-quiz">Start Chapter Quiz →</button>
      `;
      document.getElementById('lesson-container').innerHTML = html;
    }

    function startQuiz() {
      const qs = shuffleArray(currentChapter.questions).slice(0, currentChapter.quizConfig.questionsPerQuiz);
      currentQuiz = qs.map(q => ({ ...q, options: shuffleArray([...q.options]) }));
      currentQuestionIndex = 0;
      score = 0;
      showView('quiz');
      showQuestion();
    }

    function showQuestion() {
      const q = currentQuiz[currentQuestionIndex];
      selectedOption = null;
      answered = false;
      document.getElementById('quiz-progress-fill').style.width = (currentQuestionIndex / currentQuiz.length * 100) + '%';
      document.getElementById('quiz-progress-text').textContent = `${currentQuestionIndex + 1} of ${currentQuiz.length}`;
      document.getElementById('quiz-title').textContent = currentChapter.title + ' Quiz';

      const letters = ['A', 'B', 'C', 'D'];
      document.getElementById('question-card').innerHTML = `
        <p class="question-text">${q.text}</p>
        <ul class="options-list">
          ${q.options.map((o, i) => `
            <button class="option-btn" data-index="${i}" data-action="select-option">
              <span class="option-letter">${letters[i]}</span><span>${o.text}</span>
            </button>
          `).join('')}
        </ul>
        <button class="submit-btn" data-action="submit-answer" disabled>Check Answer</button>
        <div class="feedback-box" id="feedback-box">
          <h4 id="feedback-title"></h4>
          <p id="feedback-text"></p>
          <button class="next-btn" data-action="next-question">Continue</button>
        </div>
      `;
    }

    function selectOption(i) {
      if (answered) return;
      selectedOption = i;
      document.querySelectorAll('.option-btn').forEach((b, j) => b.classList.toggle('selected', j === i));
      document.querySelector('.submit-btn').disabled = false;
    }

    function submitAnswer() {
      if (selectedOption === null || answered) return;
      answered = true;
      const q = currentQuiz[currentQuestionIndex];
      const correctIdx = q.options.findIndex(o => o.correct);
      const isCorrect = selectedOption === correctIdx;
      if (isCorrect) score++;

      document.querySelectorAll('.option-btn').forEach((b, i) => {
        b.disabled = true;
        b.classList.remove('selected');
        if (i === correctIdx) b.classList.add('correct');
        else if (i === selectedOption && !isCorrect) b.classList.add('incorrect');
      });

      const fb = document.getElementById('feedback-box');
      fb.className = 'feedback-box show ' + (isCorrect ? 'correct' : 'incorrect');
      document.getElementById('feedback-title').textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect';
      document.getElementById('feedback-text').textContent = q.options[selectedOption].explanation;
      document.querySelector('.submit-btn').style.display = 'none';
    }

    function nextQuestion() {
      currentQuestionIndex++;
      if (currentQuestionIndex >= currentQuiz.length) showResults();
      else showQuestion();
    }

    function showResults() {
      showView('results');
      const pct = score / currentQuiz.length;
      const passed = pct >= currentChapter.quizConfig.passingScore;
      if (passed) {
        completedChapters[currentChapter.id] = true;
        localStorage.setItem('completedChapters', JSON.stringify(completedChapters));
      }
      const need = Math.ceil(currentChapter.quizConfig.passingScore * currentQuiz.length);
      document.getElementById('results-card').innerHTML = `
        <div class="results-icon">${passed ? '🎉' : '📚'}</div>
        <h2>${passed ? 'Chapter Complete!' : 'Keep Practicing'}</h2>
        <div class="results-score">${score}<span>/${currentQuiz.length}</span></div>
        <p class="results-message">${passed ? "Great job! You've mastered this chapter." : `You need ${need} correct to pass. Review the lesson and try again!`}</p>
        <div class="results-buttons">
          ${passed ? `<button class="result-btn primary" data-action="show-course" data-code="${Object.keys(courses).find(k => courses[k] === currentCourse)}">Continue Learning</button>` :
            `<button class="result-btn primary" data-action="show-lesson-current">Review Lesson</button>
             <button class="result-btn secondary" data-action="start-quiz">Try Quiz Again</button>`}
        </div>
      `;
    }

    // ============================================
    // SECTION PRACTICE FUNCTIONS
    // ============================================

    function startSectionPractice(code) {
      const config = asvabData.sections[code];
      const questions = asvabData.questions[code];

      if (!config || !questions || questions.length === 0) {
        alert('Questions not available for this section yet.');
        return;
      }

      // Shuffle and select questions
      const shuffled = shuffleArray([...questions]);
      const selected = shuffled.slice(0, config.questionsPerTest);

      sectionPractice = {
        code: code,
        questions: selected,
        answers: {},
        currentIndex: 0,
        timeLimit: config.timeLimit,
        timeRemaining: config.timeLimit,
        timerInterval: null
      };

      showView('section-practice');
      document.getElementById('section-practice-title').textContent = config.name + ' Practice';
      document.getElementById('section-practice-back-btn').onclick = () => {
        if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
          clearInterval(sectionPractice.timerInterval);
          showCourse(code);
        }
      };

      startSectionTimer();
      showSectionQuestion();
    }

    function startSectionTimer() {
      updateTimerDisplay();
      sectionPractice.timerInterval = setInterval(() => {
        sectionPractice.timeRemaining--;
        updateTimerDisplay();
        if (sectionPractice.timeRemaining <= 0) {
          clearInterval(sectionPractice.timerInterval);
          submitSectionPractice();
        }
      }, 1000);
    }

    function updateTimerDisplay() {
      const mins = Math.floor(sectionPractice.timeRemaining / 60);
      const secs = sectionPractice.timeRemaining % 60;
      const timer = document.getElementById('section-practice-timer');
      timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

      timer.classList.remove('warning', 'danger');
      if (sectionPractice.timeRemaining <= 60) {
        timer.classList.add('danger');
      } else if (sectionPractice.timeRemaining <= 300) {
        timer.classList.add('warning');
      }
    }

    function showSectionQuestion() {
      const q = sectionPractice.questions[sectionPractice.currentIndex];
      const total = sectionPractice.questions.length;
      const current = sectionPractice.currentIndex + 1;

      document.getElementById('section-practice-progress').textContent = `Question ${current} of ${total}`;

      const letters = ['A', 'B', 'C', 'D'];
      const savedAnswer = sectionPractice.answers[sectionPractice.currentIndex];

      document.getElementById('section-question-card').innerHTML = `
        <div class="section-question-num">Question ${current}</div>
        <div class="section-question-text">${q.text}</div>
        <div class="section-options">
          ${q.options.map((opt, i) => `
            <button class="section-option-btn ${savedAnswer === i ? 'selected' : ''}" data-action="select-section-answer" data-index="${i}">
              <span class="letter">${letters[i]}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
        <div class="section-quiz-nav">
          <button class="section-nav-btn secondary" data-action="prev-section-question" ${current === 1 ? 'disabled' : ''}>← Previous</button>
          ${current === total ?
            `<button class="section-nav-btn primary" data-action="submit-section-practice">Submit Test</button>` :
            `<button class="section-nav-btn primary" data-action="next-section-question">Next →</button>`
          }
        </div>
      `;
    }

    function selectSectionAnswer(index) {
      sectionPractice.answers[sectionPractice.currentIndex] = index;
      document.querySelectorAll('.section-option-btn').forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
      });
    }

    function prevSectionQuestion() {
      if (sectionPractice.currentIndex > 0) {
        sectionPractice.currentIndex--;
        showSectionQuestion();
      }
    }

    function nextSectionQuestion() {
      if (sectionPractice.currentIndex < sectionPractice.questions.length - 1) {
        sectionPractice.currentIndex++;
        showSectionQuestion();
      }
    }

    function submitSectionPractice() {
      clearInterval(sectionPractice.timerInterval);

      const unanswered = sectionPractice.questions.length - Object.keys(sectionPractice.answers).length;
      if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`)) {
          return;
        }
      }

      let correct = 0;
      sectionPractice.questions.forEach((q, i) => {
        if (sectionPractice.answers[i] === q.correct) correct++;
      });

      const total = sectionPractice.questions.length;
      const pct = Math.round((correct / total) * 100);
      const timeUsed = sectionPractice.timeLimit - sectionPractice.timeRemaining;
      const mins = Math.floor(timeUsed / 60);
      const secs = timeUsed % 60;

      let message, icon;
      if (pct >= 80) {
        icon = '🎉';
        message = "Excellent! You're well-prepared for this section of the ASVAB.";
      } else if (pct >= 60) {
        icon = '👍';
        message = "Good progress! Review the chapters for topics you missed.";
      } else {
        icon = '📚';
        message = "Keep studying! Go back through the chapters and try again.";
      }

      showView('section-results');
      document.getElementById('section-results-card').innerHTML = `
        <div class="icon">${icon}</div>
        <h2>${asvabData.sections[sectionPractice.code].name} Complete</h2>
        <div class="score">${pct}<span>%</span></div>
        <div class="stats">
          <div class="stat">
            <div class="stat-value correct">${correct}</div>
            <div class="stat-label">Correct</div>
          </div>
          <div class="stat">
            <div class="stat-value incorrect">${total - correct}</div>
            <div class="stat-label">Incorrect</div>
          </div>
          <div class="stat">
            <div class="stat-value">${mins}:${secs.toString().padStart(2, '0')}</div>
            <div class="stat-label">Time Used</div>
          </div>
        </div>
        <p class="message">${message}</p>
        <div class="section-results-btns">
          <button class="section-nav-btn primary" data-action="start-section-practice" data-code="${sectionPractice.code}">Try Again</button>
          <button class="section-nav-btn secondary" data-action="show-course" data-code="${sectionPractice.code}">Back to Course</button>
        </div>
      `;
    }

    // ============================================
    // FORMULA CHEAT SHEET FUNCTIONS
    // ============================================

    let currentFormulaCategory = 'All';

    function showFormulas() {
      showView('formulas');

      // Set back button to return to current course
      const backBtn = document.getElementById('formulas-back-btn');
      if (currentCourse && currentCourse.code) {
        backBtn.onclick = () => showCourse(currentCourse.code);
      } else {
        backBtn.onclick = () => showView('home');
      }

      renderFormulaTabs();
      renderFormulas('All');
    }

    function renderFormulaTabs() {
      const tabs = document.getElementById('formula-tabs');
      const categories = ['All', ...Object.keys(formulaData)];
      tabs.innerHTML = categories.map(cat => `
        <button class="formula-tab ${cat === currentFormulaCategory ? 'active' : ''}" data-action="render-formulas" data-category="${cat}">${cat}</button>
      `).join('');
    }

    function renderFormulas(category) {
      currentFormulaCategory = category;
      renderFormulaTabs();

      const grid = document.getElementById('formula-grid');
      let formulas = [];

      if (category === 'All') {
        Object.entries(formulaData).forEach(([cat, items]) => {
          items.forEach(f => formulas.push({ ...f, category: cat }));
        });
      } else {
        formulas = formulaData[category].map(f => ({ ...f, category }));
      }

      grid.innerHTML = formulas.map(f => `
        <div class="formula-card">
          <h4>${f.name}</h4>
          <div class="formula">${f.formula}</div>
          <div class="description">${f.description}</div>
          <div class="example"><strong>Example:</strong> ${f.example}</div>
        </div>
      `).join('');
    }

    // ============================================
    // FLASHCARD FUNCTIONS
    // ============================================

    let flashcardState = {
      cards: [],
      currentIndex: 0,
      flipped: false,
      known: [],
      studying: []
    };

    function showFlashcards(type) {
      flashcardState.cards = [];
      flashcardState.type = type;

      if (type === 'vocab') {
        // Build vocabulary cards
        vocabFlashcards.forEach(v => {
          flashcardState.cards.push({
            category: 'Vocabulary',
            question: v.word,
            answer: v.definition,
            explanation: v.example
          });
        });
      } else {
        // Build formula cards
        Object.entries(formulaData).forEach(([category, formulas]) => {
          formulas.forEach(f => {
            flashcardState.cards.push({
              category,
              question: f.name,
              answer: f.formula,
              explanation: f.description + '. Example: ' + f.example
            });
          });
        });
      }

      // Shuffle cards
      flashcardState.cards = shuffleArray(flashcardState.cards);
      flashcardState.currentIndex = 0;
      flashcardState.flipped = false;
      flashcardState.known = [];
      flashcardState.studying = [];

      showView('flashcards');

      // Update header based on type
      const header = document.querySelector('#flashcards-view .flashcard-header h1');
      header.textContent = type === 'vocab' ? 'Vocabulary Flashcards' : 'Formula Flashcards';

      // Set back button to return to current course
      const backBtn = document.getElementById('flashcards-back-btn');
      if (currentCourse && currentCourse.code) {
        backBtn.onclick = () => showCourse(currentCourse.code);
      } else {
        backBtn.onclick = () => showView('home');
      }

      renderFlashcard();
    }

    function renderFlashcard() {
      const card = flashcardState.cards[flashcardState.currentIndex];
      const total = flashcardState.cards.length;
      const current = flashcardState.currentIndex + 1;
      const isVocab = flashcardState.type === 'vocab';

      document.getElementById('flashcard-progress').textContent = `Card ${current} of ${total}`;

      document.getElementById('flashcard-front').innerHTML = `
        <div class="category">${card.category}</div>
        <div class="question">${card.question}</div>
        <div class="hint">Tap to reveal ${isVocab ? 'definition' : 'formula'}</div>
      `;

      document.getElementById('flashcard-back').innerHTML = `
        <div class="answer">${card.answer}</div>
        <div class="explanation">${isVocab ? '"' + card.explanation + '"' : card.explanation}</div>
      `;

      // Reset flip state
      document.getElementById('flashcard').classList.remove('flipped');
      flashcardState.flipped = false;

      // Update nav buttons
      document.getElementById('prevCardBtn').disabled = flashcardState.currentIndex === 0;
      document.getElementById('nextCardBtn').disabled = flashcardState.currentIndex === total - 1;
    }

    function flipCard() {
      const card = document.getElementById('flashcard');
      card.classList.toggle('flipped');
      flashcardState.flipped = !flashcardState.flipped;
    }

    function prevCard() {
      if (flashcardState.currentIndex > 0) {
        flashcardState.currentIndex--;
        renderFlashcard();
      }
    }

    function nextCard() {
      if (flashcardState.currentIndex < flashcardState.cards.length - 1) {
        flashcardState.currentIndex++;
        renderFlashcard();
      }
    }

    function markCard(status) {
      const cardIndex = flashcardState.currentIndex;

      if (status === 'knew') {
        flashcardState.known.push(cardIndex);
      } else {
        flashcardState.studying.push(cardIndex);
      }

      // Move to next card or show completion
      if (flashcardState.currentIndex < flashcardState.cards.length - 1) {
        flashcardState.currentIndex++;
        renderFlashcard();
      } else {
        // Show completion summary
        const knewCount = flashcardState.known.length;
        const studyCount = flashcardState.studying.length;
        const total = flashcardState.cards.length;

        document.getElementById('flashcard-front').innerHTML = `
          <div class="category">Complete!</div>
          <div class="question">You reviewed all ${total} cards</div>
          <div class="hint">${knewCount} mastered • ${studyCount} need review</div>
        `;
        document.getElementById('flashcard').classList.remove('flipped');
      }
    }


    // Delegated click handling replaces the former inline on* attributes so the
    // page needs no inline JS (CSP script-src hardening).
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      switch (el.dataset.action) {
        case 'show-home': showView('home'); break;
        case 'flip-card': flipCard(); break;
        case 'prev-card': prevCard(); break;
        case 'next-card': nextCard(); break;
        case 'mark-card': markCard(el.dataset.status); break;
        case 'show-flashcards': showFlashcards(el.dataset.type); break;
        case 'show-formulas': showFormulas(); break;
        case 'start-section-practice': startSectionPractice(el.dataset.code); break;
        case 'start-quiz': startQuiz(); break;
        case 'select-option': selectOption(Number(el.dataset.index)); break;
        case 'submit-answer': submitAnswer(); break;
        case 'next-question': nextQuestion(); break;
        case 'show-course': showCourse(el.dataset.code); break;
        case 'show-lesson-current': showLesson(currentChapter); break;
        case 'select-section-answer': selectSectionAnswer(Number(el.dataset.index)); break;
        case 'prev-section-question': prevSectionQuestion(); break;
        case 'submit-section-practice': submitSectionPractice(); break;
        case 'next-section-question': nextSectionQuestion(); break;
        case 'render-formulas': renderFormulas(el.dataset.category); break;
      }
    });

    initHome();
})();
