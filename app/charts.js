// charts.js — small SVG chart builders with no library: horizontal bars for
// spending by category, vertical bars for the monthly trend, and a donut for
// how the month's budget is split. All output is inline SVG, so it renders
// with no network and no font dependency. Classic script: attaches to HL.

var HL = window.HL || (window.HL = {});

function hbarRows(rows, maxValue) {
  // rows: [{ label, value, color, note }]
  return rows.map(function (r) {
    var w = maxValue > 0 ? Math.max(2, Math.round((r.value / maxValue) * 100)) : 0;
    return '<div class="hbar-row">' +
      '<div class="hbar-label"><span class="hbar-dot" style="background:' + r.color + '"></span>' +
      r.label + '</div>' +
      '<div class="hbar-track"><div class="hbar-fill" style="width:' + w + '%;background:' + r.color + '"></div></div>' +
      '<div class="hbar-value">' + HL.money0(r.value) + '</div>' +
      (r.note ? '<div class="hbar-note">' + r.note + '</div>' : '') +
      '</div>';
  }).join('');
}

function vbarChart(points, height) {
  // points: [{ label, value, color, highlight }]
  var h = height || 180;
  var max = Math.max.apply(null, points.map(function (p) { return p.value; }).concat([1]));
  var bw = 46;
  var gap = 18;
  var width = points.length * (bw + gap) + gap;
  var baseline = h - 28;
  var bars = '';
  points.forEach(function (p, i) {
    var bh = Math.max(3, Math.round(((h - 48) * p.value) / max));
    var x = gap + i * (bw + gap);
    var y = baseline - bh;
    bars += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh +
      '" rx="4" fill="' + p.color + '"' + (p.highlight ? ' stroke="#1d4ed8" stroke-width="2"' : '') + '/>' +
      '<text x="' + (x + bw / 2) + '" y="' + (y - 6) + '" text-anchor="middle" class="chart-num">' +
      HL.money0(p.value) + '</text>' +
      '<text x="' + (x + bw / 2) + '" y="' + (h - 8) + '" text-anchor="middle" class="chart-lab">' +
      p.label + '</text>';
  });
  return '<svg viewBox="0 0 ' + width + ' ' + h + '" class="vbar" role="img" aria-label="Monthly spending chart">' +
    '<line x1="0" y1="' + baseline + '" x2="' + width + '" y2="' + baseline + '" class="chart-axis"/>' +
    bars + '</svg>';
}

function donut(segments, size) {
  // segments: [{ value, color, label }]; returns an SVG donut with a centre total.
  var s = size || 180;
  var total = segments.reduce(function (a, b) { return a + b.value; }, 0);
  var r = 70;
  var c = 2 * Math.PI * r;
  var offset = 0;
  var circles = '';
  for (var k = 0; k < segments.length; k++) {
    var seg = segments[k];
    if (seg.value <= 0) continue;
    var frac = seg.value / total;
    circles += '<circle r="' + r + '" cx="' + (s / 2) + '" cy="' + (s / 2) + '" fill="none" ' +
      'stroke="' + seg.color + '" stroke-width="26" stroke-dasharray="' +
      (frac * c).toFixed(1) + ' ' + (c - frac * c).toFixed(1) + '" ' +
      'stroke-dashoffset="' + (-offset * c).toFixed(1) + '" transform="rotate(-90 ' + (s / 2) + ' ' + (s / 2) + ')"/>';
    offset += frac;
  }
  return '<svg viewBox="0 0 ' + s + ' ' + s + '" class="donut" role="img" aria-label="Budget split chart">' +
    '<circle r="' + r + '" cx="' + (s / 2) + '" cy="' + (s / 2) + '" fill="none" stroke="#e8e4dc" stroke-width="26"/>' +
    circles +
    '<text x="50%" y="47%" text-anchor="middle" class="donut-total">' + HL.money0(total) + '</text>' +
    '<text x="50%" y="60%" text-anchor="middle" class="donut-cap">budgeted</text>' +
    '</svg>';
}

function budgetBar(spent, limit) {
  var p = HL.pct(spent, limit);
  var cls = p >= 100 ? 'over' : p >= 85 ? 'warn' : 'ok';
  return '<div class="budget-track"><div class="budget-fill ' + cls +
    '" style="width:' + Math.min(100, p) + '%"></div></div>' +
    '<div class="budget-meta"><span>' + HL.money0(spent) + ' of ' + HL.money0(limit) + '</span>' +
    '<span class="' + cls + '">' + p + '% used</span></div>';
}

HL.hbarRows = hbarRows;
HL.vbarChart = vbarChart;
HL.donut = donut;
HL.budgetBar = budgetBar;
