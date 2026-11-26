// views/dashboard.js — the overview page: month summary cards, spending by
// category, budget health, recent transactions and upcoming bills.


function renderDashboard() {
  const state = HL.getState();
  const income = HL.monthIncome();
  const spent = HL.monthSpent();
  const saved = income - spent;
  const budget = HL.totalBudget();
  const byCat = HL.spentByCategory();
  const topCats = HL.CATEGORIES
    .map((c) => ({ ...c, spent: byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 6);
  const maxCat = topCats.length ? topCats[0].spent : 1;
  const recent = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 7);
  const overBudget = HL.CATEGORIES.filter((c) => (byCat[c.id] || 0) > state.budgets[c.id]);
  const healthPct = HL.pct(spent, budget);

  const recentRows = recent.map((t) => {
    const cat = HL.CATEGORIES.find((c) => c.id === t.cat);
    const label = t.type === 'income' ? 'Income' : (cat ? cat.name : 'Other');
    const color = t.type === 'income' ? '#2e9e6b' : (cat ? cat.color : '#888');
    return '<tr><td>' + t.date.slice(5) + '</td><td>' + t.desc + '</td>' +
      '<td><span class="chip" style="--chip:' + color + '">' + label + '</span></td>' +
      '<td class="num ' + (t.type === 'income' ? 'in' : 'out') + '">' +
      (t.type === 'income' ? '+' : '−') + HL.money(t.amount) + '</td></tr>';
  }).join('');

  const billRows = state.bills.slice(0, 5).map((b) => {
    const cat = HL.CATEGORIES.find((c) => c.id === b.cat);
    return '<li><span class="bill-dot" style="background:' + (cat ? cat.color : '#888') + '"></span>' +
      '<span class="bill-name">' + b.name + '</span>' +
      '<span class="bill-due">Due ' + b.due + '</span>' +
      '<span class="bill-amt">' + HL.money(b.amount) + '</span></li>';
  }).join('');

  return '' +
    '<section class="page-head"><div><h1>Good evening, Rivera household</h1>' +
    '<p class="lede">Here is where the money stands in ' + HL.MONTH_LABEL +
    ' — income, spending, budgets and what is due next.</p></div>' +
    '<a class="btn primary" href="#/transactions">+ Add transaction</a></section>' +

    '<section class="cards">' +
    '<div class="card stat"><span class="stat-label">Income this month</span>' +
    '<span class="stat-num in">' + HL.money(income) + '</span>' +
    '<span class="stat-sub">2 salaries, paid in full</span></div>' +
    '<div class="card stat"><span class="stat-label">Spent this month</span>' +
    '<span class="stat-num out">' + HL.money(spent) + '</span>' +
    '<span class="stat-sub">' + healthPct + '% of the ' + HL.money0(budget) + ' budget</span></div>' +
    '<div class="card stat"><span class="stat-label">Left to save</span>' +
    '<span class="stat-num">' + HL.money(saved) + '</span>' +
    '<span class="stat-sub">' + HL.pct(saved, income) + '% of income kept this month</span></div>' +
    '<div class="card stat"><span class="stat-label">Budgets over limit</span>' +
    '<span class="stat-num ' + (overBudget.length ? 'out' : '') + '">' + overBudget.length + ' of 10</span>' +
    '<span class="stat-sub">' + (overBudget.length ? overBudget.map((c) => c.name).join(', ') + ' over' : 'All categories inside their limits') + '</span></div>' +
    '</section>' +

    '<section class="grid-2">' +
    '<div class="card"><h2>Where the money went</h2>' +
    '<p class="hint">Spending by category, ' + HL.MONTH_LABEL + ' to date.</p>' +
    HL.hbarRows(topCats.map((c) => ({
      label: c.name, value: c.spent, color: c.color,
      note: HL.pct(c.spent, state.budgets[c.id]) + '% of its ' + HL.money0(state.budgets[c.id]) + ' budget',
    })), maxCat) +
    '<p class="card-link"><a href="#/budgets">See all budgets →</a></p></div>' +

    '<div class="card"><h2>Budget split</h2>' +
    '<p class="hint">How the ' + HL.money0(budget) + ' monthly budget is shared out.</p>' +
    '<div class="donut-wrap">' + HL.donut(HL.CATEGORIES.map((c) => ({ value: state.budgets[c.id], color: c.color, label: c.name }))) +
    '<ul class="legend">' + HL.CATEGORIES.slice(0, 5).map((c) =>
      '<li><span class="bill-dot" style="background:' + c.color + '"></span>' + c.name +
      ' <b>' + HL.money0(state.budgets[c.id]) + '</b></li>').join('') +
    '<li class="legend-more">+ 5 more categories on the Budgets page</li></ul></div></div>' +
    '</section>' +

    '<section class="grid-2">' +
    '<div class="card"><h2>Recent transactions</h2>' +
    '<table class="tx-table"><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>' +
    '<tbody>' + recentRows + '</tbody></table>' +
    '<p class="card-link"><a href="#/transactions">All 30 transactions →</a></p></div>' +

    '<div class="card"><h2>Coming up</h2>' +
    '<p class="hint">Bills due in the next three weeks.</p>' +
    '<ul class="bills">' + billRows + '</ul>' +
    '<p class="card-link"><a href="#/reports">See the six-month report →</a></p></div>' +
    '</section>';
}

HL.renderDashboard = renderDashboard;
