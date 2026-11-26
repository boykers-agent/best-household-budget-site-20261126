// views/transactions.js — the full ledger: filter by category, type and text,
// add a transaction, edit one in place, delete one. Every control works.


let filterCat = 'all';
let filterType = 'all';
let filterText = '';
let editingId = null;

function renderTransactions() {
  const state = HL.getState();
  let list = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (filterCat !== 'all') list = list.filter((t) => t.cat === filterCat);
  if (filterType !== 'all') list = list.filter((t) => t.type === filterType);
  if (filterText) {
    const q = filterText.toLowerCase();
    list = list.filter((t) => t.desc.toLowerCase().includes(q));
  }
  const income = list.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const spent = list.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  const catOptions = ['<option value="all">All categories</option>'].concat(
    HL.CATEGORIES.map((c) => '<option value="' + c.id + '"' + (filterCat === c.id ? ' selected' : '') + '>' + c.name + '</option>')
  ).join('');

  const rows = list.map((t) => {
    const cat = HL.CATEGORIES.find((c) => c.id === t.cat);
    if (editingId === t.id) {
      return '<tr class="editing"><td colspan="5"><form class="edit-form" data-edit="' + t.id + '">' +
        '<input name="desc" value="' + HL.escapeHtml(t.desc) + '" required maxlength="80" aria-label="Description">' +
        '<input name="date" type="date" value="' + t.date + '" required aria-label="Date">' +
        '<select name="cat">' + HL.CATEGORIES.map((c) =>
          '<option value="' + c.id + '"' + (t.cat === c.id ? ' selected' : '') + '>' + c.name + '</option>').join('') + '</select>' +
        '<input name="amount" type="number" min="0.01" step="0.01" value="' + t.amount.toFixed(2) + '" required aria-label="Amount">' +
        '<button class="btn small" type="submit">Save</button>' +
        '<button class="btn small ghost" type="button" data-cancel-edit>Cancel</button>' +
        '</form></td></tr>';
    }
    return '<tr><td>' + HL.niceDate(t.date) + '</td><td>' + HL.escapeHtml(t.desc) + '</td>' +
      '<td><span class="chip" style="--chip:' + (t.type === 'income' ? '#2e9e6b' : (cat ? cat.color : '#888')) + '">' +
      (t.type === 'income' ? 'Income' : (cat ? cat.name : 'Other')) + '</span></td>' +
      '<td class="num ' + (t.type === 'income' ? 'in' : 'out') + '">' +
      (t.type === 'income' ? '+' : '−') + HL.money(t.amount) + '</td>' +
      '<td class="row-actions"><button class="btn small ghost" data-edit="' + t.id + '">Edit</button> ' +
      '<button class="btn small danger" data-delete="' + t.id + '">Delete</button></td></tr>';
  }).join('');

  return '' +
    '<section class="page-head"><div><h1>Transactions</h1>' +
    '<p class="lede">Every dollar in and out for ' + HL.MONTH_LABEL + ' — ' + list.length +
    ' shown, ' + HL.money(income) + ' in and ' + HL.money(spent) + ' out.</p></div></section>' +

    '<section class="card"><h2>Add a transaction</h2>' +
    '<form id="add-tx" class="form-grid">' +
    '<label>Description<input name="desc" required maxlength="80" placeholder="e.g. GreenMart weekly shop"></label>' +
    '<label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></label>' +
    '<label>Category<select name="cat">' + HL.CATEGORIES.map((c) =>
      '<option value="' + c.id + '">' + c.name + '</option>').join('') + '</select></label>' +
    '<label>Date<input name="date" type="date" value="2026-11-26" required></label>' +
    '<label>Type<select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label>' +
    '<button class="btn primary" type="submit">Add transaction</button>' +
    '</form><p class="form-note" id="add-note">New entries save to this browser and appear at once.</p></section>' +

    '<section class="card"><h2>Filter the ledger</h2>' +
    '<div class="filters">' +
    '<select id="f-cat" aria-label="Filter by category">' + catOptions + '</select>' +
    '<select id="f-type" aria-label="Filter by type">' +
    '<option value="all"' + (filterType === 'all' ? ' selected' : '') + '>Income &amp; expenses</option>' +
    '<option value="expense"' + (filterType === 'expense' ? ' selected' : '') + '>Expenses only</option>' +
    '<option value="income"' + (filterType === 'income' ? ' selected' : '') + '>Income only</option></select>' +
    '<input id="f-text" type="search" placeholder="Search descriptions…" value="' + HL.escapeHtml(filterText) + '" aria-label="Search descriptions">' +
    '</div>' +
    '<table class="tx-table"><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>' +
    '<tbody>' + (rows || '<tr><td colspan="5">No transactions match these filters.</td></tr>') + '</tbody></table>' +
    '</section>';
}

function bindTransactions(root, rerender) {
  const addForm = root.querySelector('#add-tx');
  if (addForm) addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(addForm);
    const amount = parseFloat(data.get('amount'));
    if (!amount || amount <= 0) return;
    HL.addTransaction({
      date: data.get('date') || '2026-11-26',
      desc: String(data.get('desc')).trim(),
      cat: data.get('type') === 'income' ? null : data.get('cat'),
      type: data.get('type'),
      amount: Math.round(amount * 100) / 100,
    });
    rerender();
    const note = root.querySelector('#add-note');
    if (note) note.textContent = 'Saved. The new transaction is now in the ledger.';
  });

  const fCat = root.querySelector('#f-cat');
  if (fCat) fCat.addEventListener('change', () => { filterCat = fCat.value; rerender(); });
  const fType = root.querySelector('#f-type');
  if (fType) fType.addEventListener('change', () => { filterType = fType.value; rerender(); });
  const fText = root.querySelector('#f-text');
  if (fText) fText.addEventListener('input', () => { filterText = fText.value; rerender(false); });

  root.querySelectorAll('[data-delete]').forEach((btn) => btn.addEventListener('click', () => {
    if (window.confirm('Delete this transaction?')) { HL.deleteTransaction(btn.dataset.delete); rerender(); }
  }));
  root.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => {
    if (btn.tagName === 'BUTTON' && btn.closest('tr') && !btn.closest('.editing')) {
      editingId = btn.dataset.edit; rerender();
    }
  }));
  root.querySelectorAll('[data-cancel-edit]').forEach((btn) => btn.addEventListener('click', () => {
    editingId = null; rerender();
  }));
  root.querySelectorAll('form[data-edit]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    HL.updateTransaction(form.dataset.edit, {
      desc: String(data.get('desc')).trim(),
      date: data.get('date'),
      cat: data.get('cat'),
      amount: Math.round(parseFloat(data.get('amount')) * 100) / 100,
    });
    editingId = null;
    rerender();
  }));
}

HL.renderTransactions = renderTransactions;
HL.bindTransactions = bindTransactions;
