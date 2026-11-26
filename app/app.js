// app.js — boots the site: hash routing between the five pages, shared header
// and navigation, and re-rendering after any edit. No framework, no network.
// Classic script: the view files above register their renderers on HL.

var HL = window.HL || (window.HL = {});

var ROUTES = [
  { hash: '#/dashboard', label: 'Dashboard', render: HL.renderDashboard, bind: null },
  { hash: '#/transactions', label: 'Transactions', render: HL.renderTransactions, bind: HL.bindTransactions },
  { hash: '#/budgets', label: 'Budgets', render: HL.renderBudgets, bind: HL.bindBudgets },
  { hash: '#/goals', label: 'Savings goals', render: HL.renderGoals, bind: HL.bindGoals },
  { hash: '#/reports', label: 'Reports', render: HL.renderReports, bind: HL.bindReports },
];

var viewEl = document.getElementById('view');
var navEl = document.getElementById('main-nav');

function currentRoute() {
  var hash = window.location.hash || '#/dashboard';
  for (var i = 0; i < ROUTES.length; i++) {
    if (ROUTES[i].hash === hash) return ROUTES[i];
  }
  return ROUTES[0];
}

function renderNav(active) {
  navEl.innerHTML = ROUTES.map(function (r) {
    return '<a href="' + r.hash + '"' + (r.hash === active.hash ? ' aria-current="page" class="active"' : '') + '>' +
      r.label + '</a>';
  }).join('');
}

function rerender() {
  var route = currentRoute();
  var focusId = document.activeElement && document.activeElement.id;
  var hadSearchFocus = focusId === 'f-text';
  renderNav(route);
  viewEl.innerHTML = route.render();
  if (route.bind) route.bind(viewEl, rerender);
  if (hadSearchFocus) {
    var box = document.getElementById('f-text');
    if (box) {
      box.focus();
      var len = box.value.length;
      box.setSelectionRange(len, len);
    }
  }
}

window.addEventListener('hashchange', rerender);
document.getElementById('reset-demo').addEventListener('click', function () {
  if (window.confirm('Reset the demo data to the original November figures? Your edits will be lost.')) {
    try { window.localStorage.removeItem('homeledger-rivera-v1'); } catch (_e) { /* ignore */ }
    window.location.hash = '#/dashboard';
    window.location.reload();
  }
});

rerender();
