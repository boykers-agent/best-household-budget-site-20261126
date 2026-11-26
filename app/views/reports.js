// views/reports.js — the six-month picture: income against spending, the
// biggest categories this month, and plain-language takeaways the household
// can act on. A range switch swaps the chart between six and three months.


let rangeMonths = 6;

function renderReports() {
  const history = HL.historyWithCurrent();
  const shown = history.slice(-rangeMonths);
  const avgSpent = Math.round(shown.reduce((a, h) => a + h.spent, 0) / shown.length);
  const avgIncome = Math.round(shown.reduce((a, h) => a + h.income, 0) / shown.length);
  const avgSaved = avgIncome - avgSpent;
  const bestMonth = shown.reduce((a, h) => (h.income - h.spent) > (a.income - a.spent) ? h : a, shown[0]);

  const byCat = HL.spentByCategory();
  const topCats = HL.CATEGORIES
    .map((c) => ({ ...c, spent: byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);
  const maxCat = topCats.length ? topCats[0].spent : 1;

  const tableRows = shown.map((h) => {
    const saved = h.income - h.spent;
    return '<tr><td>' + h.month + '</td><td class="num in">' + HL.money0(h.income) + '</td>' +
      '<td class="num out">' + HL.money0(h.spent) + '</td>' +
      '<td class="num">' + HL.money0(saved) + '</td>' +
      '<td class="num">' + HL.pct(saved, h.income) + '%</td></tr>';
  }).join('');

  return '' +
    '<section class="page-head"><div><h1>Reports</h1>' +
    '<p class="lede">Six months of the Rivera household, June to ' + HL.MONTH_LABEL +
    ' — what came in, what went out, and what stayed.</p></div>' +
    '<div class="range-switch" role="group" aria-label="Chart range">' +
    '<button class="btn small' + (rangeMonths === 6 ? ' primary' : ' ghost') + '" data-range="6">Last 6 months</button>' +
    '<button class="btn small' + (rangeMonths === 3 ? ' primary' : ' ghost') + '" data-range="3">Last 3 months</button>' +
    '</div></section>' +

    '<section class="cards">' +
    '<div class="card stat"><span class="stat-label">Average income / month</span>' +
    '<span class="stat-num">' + HL.money0(avgIncome) + '</span>' +
    '<span class="stat-sub">Steady at $6,400 plus one $150 bonus in August</span></div>' +
    '<div class="card stat"><span class="stat-label">Average spending / month</span>' +
    '<span class="stat-num out">' + HL.money0(avgSpent) + '</span>' +
    '<span class="stat-sub">Highest in August ($4,980), lowest in June ($4,410)</span></div>' +
    '<div class="card stat"><span class="stat-label">Average saved / month</span>' +
    '<span class="stat-num in">' + HL.money0(avgSaved) + '</span>' +
    '<span class="stat-sub">' + HL.pct(avgSaved, avgIncome) + '% of income kept on average</span></div>' +
    '<div class="card stat"><span class="stat-label">Best saving month</span>' +
    '<span class="stat-num">' + bestMonth.month + '</span>' +
    '<span class="stat-sub">' + HL.money0(bestMonth.income - bestMonth.spent) + ' kept — ' +
    HL.pct(bestMonth.income - bestMonth.spent, bestMonth.income) + '% of that month’s income</span></div>' +
    '</section>' +

    '<section class="grid-2">' +
    '<div class="card"><h2>Monthly spending</h2>' +
    '<p class="hint">Spending per month. November is counted to the 26th.</p>' +
    HL.vbarChart(shown.map((h) => ({
      label: h.month.split(' ')[0], value: h.spent,
      color: h.month === 'Nov 2026' ? '#1d4ed8' : '#7fb069',
      highlight: h.month === 'Nov 2026',
    })), 200) +
    '<table class="tx-table report-table"><thead><tr><th>Month</th><th class="num">Income</th>' +
    '<th class="num">Spent</th><th class="num">Saved</th><th class="num">Rate</th></tr></thead>' +
    '<tbody>' + tableRows + '</tbody></table></div>' +

    '<div class="card"><h2>Biggest costs this month</h2>' +
    '<p class="hint">Where November’s ' + HL.money(HL.monthSpent()) + ' went.</p>' +
    HL.hbarRows(topCats.map((c) => ({
      label: c.name, value: c.spent, color: c.color,
      note: HL.pct(c.spent, HL.monthSpent()) + '% of all spending',
    })), maxCat) +
    '<h2 class="sub-head">What this tells the household</h2>' +
    '<ul class="takeaways">' +
    '<li><b>Housing is the anchor:</b> the mortgage alone is ' + HL.pct(1650, HL.monthSpent()) +
    '% of November spending — it never moves, so the lever is everywhere else.</li>' +
    '<li><b>Groceries creep up in holiday weeks:</b> the Thanksgiving shop pushed the category to ' +
    HL.money0(byCat.groceries || 0) + ' of its ' + HL.money0(750) + ' budget with four days left.</li>' +
    '<li><b>August was the warning:</b> $4,980 spent, the highest in six months, mostly back-to-school costs. ' +
    'This year’s August needs a plan before July ends.</li>' +
    '<li><b>Saving works when it is automatic:</b> ' + HL.money0(avgSaved) + ' a month on average — ' +
    'enough to finish the emergency fund by February.</li>' +
    '</ul></div>' +
    '</section>';
}

function bindReports(root, rerender) {
  root.querySelectorAll('[data-range]').forEach((btn) => btn.addEventListener('click', () => {
    rangeMonths = Number(btn.dataset.range);
    rerender();
  }));
}

HL.renderReports = renderReports;
HL.bindReports = bindReports;
