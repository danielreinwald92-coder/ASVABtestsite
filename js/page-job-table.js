// Filter box for the generated branch job tables (<branch>-asvab-scores.html).
(function () {
  const input = document.getElementById('jobFilter');
  const table = document.getElementById('jobTable');
  const empty = document.getElementById('jobFilterEmpty');
  if (!input || !table) return;
  const rows = Array.from(table.tBodies[0].rows);
  input.addEventListener('input', function () {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach(function (row) {
      const match = !q || (row.getAttribute('data-search') || '').indexOf(q) !== -1;
      row.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  });
})();
