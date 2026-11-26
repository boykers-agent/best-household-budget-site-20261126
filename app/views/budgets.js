// views/budgets.js — monthly limits per category: what is spent, what is left,
// and an inline editor to change a limit. Over-budget categories are flagged.


let editingCat = null;

function renderBudgets() {
  const state = HL.getState();
  const byCat = HL.spentByCategory();
  const total = HL.totalBudget();
  const spent = Object.values(byCat).reduce((a, b) => a + b, 0);

  const cards = HL.CATEGORIES.map((c) => {
    const s = byCat[c.id] || 0;
    const limit = state.budgets[c.id];
    const left = limit - s;
    const over = left < 0;
    let editor = '';
    if (editingCat === c.id) {
      editor = '<form class="limit-form" data-limit="' + c.id + '">' +
        '<label>Monthly limit ($) <input name="limit" type="number" min="0" step="5" value="' + limit + '" required></label>' +
        '<button class="btn small" type="submit">Save</button>' +
        '<button class="btn small ghost" type="button" data-cancel-limit>Cancel</button></form>';
    } else {
      editor = '<button class="btn small ghost" data-set-limit="' + c.id + '">Change limit</button>';
    }
    return '<article class="card budget-card' + (over ? ' over' : '') + '">' +
      '<div class="budget-head"><span class="bill-dot" style="background:' + c.color + '"></span>' +
      '<h3>' + c.name + '</h3>' +
      (over ? '<span class="flag">Over by ' + HL.money(-left) + '</span>' : '') + '</div>' +
      HL.budgetBar(s, limit) +
      '<p class="budget-left">' + (over
        ? 'You are ' + HL.money(-left) + ' over this month. Move money from another category or trim a shop.'
        : HL.money(left) + ' left for the rest of November (' + HL.pct(left, limit) + '% of the limit).') + '</p>' +
      editor + '</article>';
  }).join('');

  return '' +
    '<section class="page-head"><div><h1>Budgets</h1>' +
    '<p class="lede">November 2026 limits for the Rivera household — ' + HL.money(spent) +
    ' spent of ' + HL.money0(total) + ' planned (' + HL.pct(spent, total) + '%). Set a limit that fits real life, then watch the bars.</p></div></section>' +
    '<section class="budget-grid">' + cards + '</section>' +
    '<section class="card tip"><h2>How the household keeps to it</h2>' +
    '<p>Groceries get one big weekly shop instead of daily top-ups; dining out is capped at two meals a week; ' +
    'whatever is left in a category on the 30th rolls into the emergency fund. Change any limit above and the ' +
    'dashboard, the category chart and this page all update at once.</p></section>';
}

function bindBudgets(root, rerender) {
  root.querySelectorAll('[data-set-limit]').forEach((btn) => btn.addEventListener('click', () => {
    editingCat = btn.dataset.setLimit; rerender();
  }));
  root.querySelectorAll('[data-cancel-limit]').forEach((btn) => btn.addEventListener('click', () => {
    editingCat = null; rerender();
  }));
  root.querySelectorAll('form[data-limit]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const limit = parseFloat(new FormData(form).get('limit'));
    if (!Number.isNaN(limit) && limit >= 0) HL.setBudget(form.dataset.limit, limit);
    editingCat = null;
    rerender();
  }));
}

HL.renderBudgets = renderBudgets;
HL.bindBudgets = bindBudgets;
