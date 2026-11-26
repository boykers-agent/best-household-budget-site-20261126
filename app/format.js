// format.js — money and date formatting for the whole site. One place, so every
// figure on every page is written the same way. Classic script: attaches to HL.

var HL = window.HL || (window.HL = {});

function money(amount) {
  return '$' + Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function money0(amount) {
  return '$' + Math.round(Number(amount)).toLocaleString('en-US');
}

function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

function niceDate(iso) {
  var parts = iso.split('-').map(Number);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[parts[1] - 1] + ' ' + parts[2] + ', ' + parts[0];
}

function shortDate(iso) {
  var parts = iso.split('-').map(Number);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[parts[1] - 1] + ' ' + parts[2];
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

HL.money = money;
HL.money0 = money0;
HL.pct = pct;
HL.niceDate = niceDate;
HL.shortDate = shortDate;
HL.escapeHtml = escapeHtml;
