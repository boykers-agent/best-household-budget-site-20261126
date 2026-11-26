// views/goals.js — savings goals with progress bars, an add-funds control and
// a form to start a new goal. Progress is always shown against the target.


function renderGoals() {
  const state = HL.getState();
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);

  const cards = state.goals.map((g) => {
    const p = HL.pct(g.saved, g.target);
    const done = g.saved >= g.target;
    return '<article class="card goal-card">' +
      '<div class="goal-head"><h3>' + HL.escapeHtml(g.name) + '</h3>' +
      '<span class="goal-pct">' + p + '%</span></div>' +
      '<p class="goal-note">' + HL.escapeHtml(g.note) + '</p>' +
      '<div class="budget-track"><div class="budget-fill ' + (done ? 'ok' : 'warn') +
      '" style="width:' + Math.min(100, p) + '%"></div></div>' +
      '<div class="budget-meta"><span>' + HL.money(g.saved) + ' saved</span>' +
      '<span>Target ' + HL.money0(g.target) + '</span></div>' +
      '<p class="goal-left">' + (done ? 'Goal reached — well done.' :
        HL.money(g.target - g.saved) + ' to go. At $400 a month this takes ' +
        Math.ceil((g.target - g.saved) / 400) + ' more months.') + '</p>' +
      (done ? '' : '<form class="fund-form" data-fund="' + g.id + '">' +
        '<label>Add funds ($) <input name="amount" type="number" min="1" step="1" required placeholder="100"></label>' +
        '<button class="btn small" type="submit">Add to goal</button></form>') +
      '</article>';
  }).join('');

  return '' +
    '<section class="page-head"><div><h1>Savings goals</h1>' +
    '<p class="lede">Three things the household is saving for — ' + HL.money(totalSaved) +
    ' put aside of ' + HL.money0(totalTarget) + ' in targets (' + HL.pct(totalSaved, totalTarget) + '% there).</p></div></section>' +
    '<section class="goal-grid">' + cards + '</section>' +
    '<section class="card"><h2>Start a new goal</h2>' +
    '<form id="add-goal" class="form-grid">' +
    '<label>Goal name<input name="name" required maxlength="60" placeholder="e.g. Christmas gifts"></label>' +
    '<label>Target amount ($) <input name="target" type="number" min="10" step="10" required placeholder="500"></label>' +
    '<button class="btn primary" type="submit">Create goal</button>' +
    '</form><p class="form-note" id="goal-note">A new goal starts at $0 saved and appears above right away.</p></section>';
}

function bindGoals(root, rerender) {
  root.querySelectorAll('form[data-fund]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(new FormData(form).get('amount'));
    if (amount && amount > 0) HL.addToGoal(form.dataset.fund, Math.round(amount));
    rerender();
  }));
  const addForm = root.querySelector('#add-goal');
  if (addForm) addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(addForm);
    const target = parseFloat(data.get('target'));
    if (!target || target <= 0) return;
    HL.addGoal(String(data.get('name')).trim(), Math.round(target));
    rerender();
    const note = root.querySelector('#goal-note');
    if (note) note.textContent = 'Goal created and added to the list above.';
  });
}

HL.renderGoals = renderGoals;
HL.bindGoals = bindGoals;
