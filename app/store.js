var HL = window.HL || (window.HL = {});

// store.js — the household's money: categories, budgets, transactions, goals,
// monthly history and upcoming bills. Seed data is the Rivera household's real
// November 2026 figures. Everything persists to localStorage (with an in-memory
// fallback when storage is unavailable) so edits survive a reload.

const CATEGORIES = [
  { id: 'groceries', name: 'Groceries', color: '#2e9e6b', code: 'GR' },
  { id: 'dining', name: 'Dining Out', color: '#e07856', code: 'DI' },
  { id: 'transport', name: 'Transport', color: '#4a7fb5', code: 'TR' },
  { id: 'housing', name: 'Housing', color: '#7a6bb5', code: 'HO' },
  { id: 'utilities', name: 'Utilities', color: '#b59a4a', code: 'UT' },
  { id: 'entertainment', name: 'Entertainment', color: '#c05a8a', code: 'EN' },
  { id: 'health', name: 'Health', color: '#4ab5a0', code: 'HE' },
  { id: 'kids', name: 'Kids & School', color: '#8a6d3b', code: 'KI' },
  { id: 'clothing', name: 'Clothing', color: '#5a7d8a', code: 'CL' },
  { id: 'household', name: 'Household', color: '#6b8e4e', code: 'HH' },
];

const MONTH_LABEL = 'November 2026';
const MONTH_KEY = '2026-11';

const SEED_BUDGETS = {
  groceries: 750, dining: 320, transport: 280, housing: 1650, utilities: 310,
  entertainment: 180, health: 220, kids: 350, clothing: 150, household: 200,
};

const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-02', desc: 'GreenMart weekly shop', cat: 'groceries', type: 'expense', amount: 142.35 },
  { id: 't02', date: '2026-11-02', desc: 'Metro monthly transit pass', cat: 'transport', type: 'expense', amount: 96.00 },
  { id: 't03', date: '2026-11-03', desc: 'City power & light bill', cat: 'utilities', type: 'expense', amount: 128.40 },
  { id: 't04', date: '2026-11-04', desc: 'Corner Bakery lunch', cat: 'dining', type: 'expense', amount: 24.80 },
  { id: 't05', date: '2026-11-05', desc: 'Pharmacy — allergy medicine', cat: 'health', type: 'expense', amount: 38.60 },
  { id: 't06', date: '2026-11-06', desc: 'Maya salary — first half', cat: null, type: 'income', amount: 1900.00 },
  { id: 't07', date: '2026-11-07', desc: 'GreenMart weekly shop', cat: 'groceries', type: 'expense', amount: 118.90 },
  { id: 't08', date: '2026-11-07', desc: 'Cinema — family movie night', cat: 'entertainment', type: 'expense', amount: 46.00 },
  { id: 't09', date: '2026-11-08', desc: 'Kids art class supplies', cat: 'kids', type: 'expense', amount: 52.75 },
  { id: 't10', date: '2026-11-09', desc: 'Fuel — Shell station', cat: 'transport', type: 'expense', amount: 41.20 },
  { id: 't11', date: '2026-11-10', desc: 'Internet & cable', cat: 'utilities', type: 'expense', amount: 89.00 },
  { id: 't12', date: '2026-11-11', desc: 'Pizzeria — Friday dinner', cat: 'dining', type: 'expense', amount: 38.50 },
  { id: 't13', date: '2026-11-12', desc: 'GreenMart weekly shop', cat: 'groceries', type: 'expense', amount: 156.40 },
  { id: 't14', date: '2026-11-13', desc: 'Daniel salary — first half', cat: null, type: 'income', amount: 1300.00 },
  { id: 't15', date: '2026-11-14', desc: 'Winter jackets for the kids', cat: 'clothing', type: 'expense', amount: 87.99 },
  { id: 't16', date: '2026-11-15', desc: 'Mortgage payment', cat: 'housing', type: 'expense', amount: 1650.00 },
  { id: 't17', date: '2026-11-16', desc: 'Dentist check-up — Leo', cat: 'health', type: 'expense', amount: 65.00 },
  { id: 't18', date: '2026-11-17', desc: 'GreenMart weekly shop', cat: 'groceries', type: 'expense', amount: 131.20 },
  { id: 't19', date: '2026-11-18', desc: 'School lunch program — November', cat: 'kids', type: 'expense', amount: 120.00 },
  { id: 't20', date: '2026-11-19', desc: 'Sushi takeaway', cat: 'dining', type: 'expense', amount: 44.30 },
  { id: 't21', date: '2026-11-20', desc: 'Maya salary — second half', cat: null, type: 'income', amount: 1900.00 },
  { id: 't22', date: '2026-11-21', desc: 'GreenMart weekly shop', cat: 'groceries', type: 'expense', amount: 98.60 },
  { id: 't23', date: '2026-11-21', desc: 'Streaming subscriptions', cat: 'entertainment', type: 'expense', amount: 32.97 },
  { id: 't24', date: '2026-11-22', desc: 'Cleaning supplies & paper goods', cat: 'household', type: 'expense', amount: 41.85 },
  { id: 't25', date: '2026-11-23', desc: 'Fuel — Shell station', cat: 'transport', type: 'expense', amount: 38.75 },
  { id: 't26', date: '2026-11-24', desc: 'Water bill', cat: 'utilities', type: 'expense', amount: 54.30 },
  { id: 't27', date: '2026-11-25', desc: 'Kids football boots', cat: 'kids', type: 'expense', amount: 64.50 },
  { id: 't28', date: '2026-11-26', desc: 'Daniel salary — second half', cat: null, type: 'income', amount: 1300.00 },
  { id: 't29', date: '2026-11-26', desc: 'Thanksgiving groceries — GreenMart', cat: 'groceries', type: 'expense', amount: 87.45 },
  { id: 't30', date: '2026-11-26', desc: 'Pharmacy — vitamins', cat: 'health', type: 'expense', amount: 22.40 },
];

const SEED_GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 10000, saved: 8200, note: 'Six months of essential bills, kept in a separate savings account.' },
  { id: 'g2', name: 'Summer family trip', target: 3000, saved: 1850, note: 'A week by the coast in July 2027 — flights, stay and food.' },
  { id: 'g3', name: 'New car down payment', target: 7500, saved: 4200, note: 'Replacing the 2014 sedan before next winter.' },
];

const SEED_HISTORY = [
  { month: 'Jun 2026', income: 6400, spent: 4410 },
  { month: 'Jul 2026', income: 6400, spent: 4725 },
  { month: 'Aug 2026', income: 6550, spent: 4980 },
  { month: 'Sep 2026', income: 6400, spent: 4590 },
  { month: 'Oct 2026', income: 6400, spent: 4835 },
  { month: 'Nov 2026', income: 6400, spent: 0 }, // spent is computed live below
];

const SEED_BILLS = [
  { name: 'Mortgage payment', due: 'Dec 1', amount: 1650.00, cat: 'housing' },
  { name: 'City power & light', due: 'Dec 3', amount: 128.40, cat: 'utilities' },
  { name: 'Internet & cable', due: 'Dec 8', amount: 89.00, cat: 'utilities' },
  { name: 'Water bill', due: 'Dec 12', amount: 54.30, cat: 'utilities' },
  { name: 'School lunch program', due: 'Dec 15', amount: 120.00, cat: 'kids' },
  { name: 'Streaming subscriptions', due: 'Dec 21', amount: 32.97, cat: 'entertainment' },
];

const STORAGE_KEY = 'homeledger-rivera-v1';

function seedState() {
  return {
    budgets: { ...SEED_BUDGETS },
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    goals: SEED_GOALS.map((g) => ({ ...g })),
    history: SEED_HISTORY.map((h) => ({ ...h })),
    bills: SEED_BILLS.map((b) => ({ ...b })),
  };
}

let memoryFallback = null;

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && parsed.budgets) return parsed;
    }
  } catch (_e) { /* storage unavailable — fall through to memory */ }
  return null;
}

function persist(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_e) {
    memoryFallback = state; // keep working in-memory when storage is blocked
  }
}

let state = loadState() || seedState();
if (memoryFallback) state = memoryFallback;

function getState() { return state; }

function save() { persist(state); }

function resetDemo() {
  state = seedState();
  persist(state);
}

function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

function monthIncome() {
  return state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

function monthSpent() {
  return state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

function spentByCategory() {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of state.transactions) {
    if (t.type === 'expense' && t.cat && out[t.cat] !== undefined) out[t.cat] += t.amount;
  }
  return out;
}

function totalBudget() {
  return Object.values(state.budgets).reduce((a, b) => a + b, 0);
}

function addTransaction(tx) {
  const id = 't' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  state.transactions.push({ id, ...tx });
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  persist(state);
  return id;
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  persist(state);
}

function updateTransaction(id, patch) {
  const tx = state.transactions.find((t) => t.id === id);
  if (tx) Object.assign(tx, patch);
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  persist(state);
}

function setBudget(catId, limit) {
  state.budgets[catId] = Math.max(0, Math.round(limit));
  persist(state);
}

function addToGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (goal) goal.saved = Math.min(goal.target, goal.saved + amount);
  persist(state);
}

function addGoal(name, target) {
  const id = 'g' + Date.now().toString(36);
  state.goals.push({ id, name, target, saved: 0, note: 'Added by the household.' });
  persist(state);
  return id;
}

function historyWithCurrent() {
  return state.history.map((h) =>
    h.month === 'Nov 2026' ? { ...h, spent: monthSpent() } : h);
}

HL.CATEGORIES = CATEGORIES;
HL.MONTH_LABEL = MONTH_LABEL;
HL.MONTH_KEY = MONTH_KEY;
HL.getState = getState;
HL.save = save;
HL.resetDemo = resetDemo;
HL.categoryById = categoryById;
HL.monthIncome = monthIncome;
HL.monthSpent = monthSpent;
HL.spentByCategory = spentByCategory;
HL.totalBudget = totalBudget;
HL.addTransaction = addTransaction;
HL.deleteTransaction = deleteTransaction;
HL.updateTransaction = updateTransaction;
HL.setBudget = setBudget;
HL.addToGoal = addToGoal;
HL.addGoal = addGoal;
HL.historyWithCurrent = historyWithCurrent;
