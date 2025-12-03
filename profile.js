// --- Data & storage ---
const DEFAULT_WORKOUTS = [
  {
    id: '1',
    date: '2024-11-30',
    exercises: [
      { name: 'Squat', sets: 3, reps: 8, weight: 225 },
      { name: 'Bench Press', sets: 3, reps: 8, weight: 185 },
      { name: 'Deadlift', sets: 3, reps: 5, weight: 315 }
    ],
    wilksScore: 285
  },
  {
    id: '2',
    date: '2024-11-27',
    exercises: [
      { name: 'Squat', sets: 3, reps: 8, weight: 220 },
      { name: 'Overhead Press', sets: 3, reps: 8, weight: 95 },
      { name: 'Barbell Row', sets: 3, reps: 8, weight: 155 }
    ],
    wilksScore: 278
  },
  {
    id: '3',
    date: '2024-11-25',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 8, weight: 180 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 70 },
      { name: 'Tricep Dips', sets: 3, reps: 12, weight: 0 }
    ],
    wilksScore: 272
  },
  {
    id: '4',
    date: '2024-11-23',
    exercises: [
      { name: 'Deadlift', sets: 3, reps: 5, weight: 305 },
      { name: 'Front Squat', sets: 3, reps: 8, weight: 185 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 360 }
    ],
    wilksScore: 280
  }
];

const STORAGE_KEY = 'responsive_workouts_v1';
let workouts = loadWorkouts();

// --- Load / save ---
function loadWorkouts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_WORKOUTS.map(w => ({
    ...w,
    exercises: w.exercises.map(e => ({ ...e }))
  }));
}

function saveWorkouts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  } catch (e) {
    console.warn('storage failed', e);
  }
}

// --- DOM refs ---
const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const workoutCardsEl = document.getElementById('workoutCards');
const addBtn = document.getElementById('addWorkoutBtn');
const addModal = document.getElementById('addWorkoutModal');
const cancelAdd = document.getElementById('cancelAdd');
const saveWorkoutBtn = document.getElementById('saveWorkout');
const addDateInput = document.getElementById('addDate');
const exerciseListEl = document.getElementById('exerciseList');
const detailsModal = document.getElementById('detailsModal');
const detailsBody = document.getElementById('detailsBody');
const closeDetailsBtn = document.getElementById('closeDetails');

let wilksChart = null;
let totalChart = null;

// --- Init on DOM ready ---
document.addEventListener('DOMContentLoaded', () => {
  initSidebarBehavior();
  initCharts();
  renderAll();
  initNavButtons();
});

// --- Sidebar / hamburger ---
function initSidebarBehavior() {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1000 && sidebar.classList.contains('open')) {
      const inside = sidebar.contains(e.target) || hamburger.contains(e.target);
      if (!inside) closeSidebar();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      addModal.classList.add('hidden');
      detailsModal.classList.add('hidden');
    }
  });

  if (window.innerWidth <= 1000) {
    sidebar.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  } else {
    sidebar.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000) {
      sidebar.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    } else {
      sidebar.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

function openSidebar() {
  sidebar.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

// --- Charts ---
function initCharts() {
  const wilksCanvas = document.getElementById('wilksChart');
  const totalCanvas = document.getElementById('totalChart');
  if (!wilksCanvas || !totalCanvas) return;

  const wilksCtx = wilksCanvas.getContext('2d');
  const totalCtx = totalCanvas.getContext('2d');

  wilksChart = new Chart(wilksCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Wilks',
        data: [],
        borderColor: '#ff4d4d',
        backgroundColor: 'rgba(255,77,77,0.15)',
        tension: 0.25,
        pointRadius: 4,
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'Wilks Score' } }
      }
    }
  });

  totalChart = new Chart(totalCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Total Volume',
        data: [],
        backgroundColor: '#4c4c4c',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'Lift Volume (lbs)' } }
      }
    }
  });
}

function updateCharts() {
  if (!wilksChart || !totalChart) return;

  const sorted = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sorted.map(w => formatDateLabel(w.date));
  const wilksData = sorted.map(w => w.wilksScore);
  const totalVolumes = sorted.map(w => computeTotalVolume(w));

  wilksChart.data.labels = labels;
  wilksChart.data.datasets[0].data = wilksData;
  wilksChart.update();

  totalChart.data.labels = labels;
  totalChart.data.datasets[0].data = totalVolumes;
  totalChart.update();
}

// --- Rendering ---
function renderAll() {
  renderWorkoutCards();
  updateCharts();
  saveWorkouts();
}

function renderWorkoutCards() {
  workoutCardsEl.innerHTML = '';
  const slice = workouts.slice(0, 4);
  slice.forEach(w => {
    const card = document.createElement('article');
    card.className = 'workout-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <h4>${formatDateLabel(w.date)}</h4>
      <p>Wilks: <strong>${w.wilksScore}</strong></p>
      <p class="muted">${w.exercises.length} exercise(s)</p>
      <div style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end">
        <button class="btn view" data-id="${w.id}">View</button>
      </div>
    `;
    workoutCardsEl.appendChild(card);

    card.querySelector('.view').addEventListener('click', (e) => {
      e.stopPropagation();
      openDetails(w.id);
    });

    card.addEventListener('click', () => openDetails(w.id));
    card.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') openDetails(w.id);
    });
  });
}

// --- Details modal ---
function openDetails(id) {
  const w = workouts.find(x => x.id === id);
  if (!w) return;
  detailsBody.innerHTML = buildDetailsHtml(w);
  detailsModal.classList.remove('hidden');

  const delBtn = detailsBody.querySelector('#deleteWorkout');
  if (delBtn) {
    delBtn.addEventListener('click', () => {
      if (!confirm('Delete workout?')) return;
      workouts = workouts.filter(x => x.id !== id);
      saveWorkouts();
      detailsModal.classList.add('hidden');
      renderAll();
    });
  }
}

closeDetailsBtn.addEventListener('click', () => {
  detailsModal.classList.add('hidden');
});

function buildDetailsHtml(w) {
  const rows = w.exercises.map(ex => `
    <div style="padding:6px 0;border-bottom:1px solid #eee">
      <div style="font-weight:600">${escapeHtml(ex.name || 'Unnamed')}</div>
      <div style="color:#666">${ex.sets} sets × ${ex.reps} reps @ ${ex.weight} lbs</div>
    </div>
  `).join('');

  return `
    <p><strong>Date:</strong> ${formatDateLong(w.date)}</p>
    <p><strong>Wilks Score:</strong> ${w.wilksScore}</p>
    <div style="margin-top:12px">${rows || '<em>No exercises recorded</em>'}</div>
    <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
      <button id="deleteWorkout" class="btn" style="background:#ffecec;border:1px solid #f5c2c2;color:#a00">Delete</button>
    </div>
  `;
}

// --- Add workout modal ---
addBtn.addEventListener('click', () => {
  addModal.classList.remove('hidden');
  addDateInput.value = new Date().toISOString().slice(0, 10);
  addDateInput.focus();
});

cancelAdd.addEventListener('click', () => {
  addModal.classList.add('hidden');
});

saveWorkoutBtn.addEventListener('click', () => {
  const dateVal = addDateInput.value;
  if (!dateVal) {
    alert('Please choose a date.');
    return;
  }

  const rows = Array.from(exerciseListEl.querySelectorAll('.exercise-row'));
  const exercises = rows.map(row => {
    const name = row.querySelector('.ex-name').value.trim();
    const sets = parseInt(row.querySelector('.ex-sets').value || '0', 10);
    const reps = parseInt(row.querySelector('.ex-reps').value || '0', 10);
    const weight = parseInt(row.querySelector('.ex-weight').value || '0', 10);
    if (!name && sets === 0 && reps === 0 && weight === 0) return null;
    return {
      name: name || 'Unnamed',
      sets: Math.max(0, sets),
      reps: Math.max(0, reps),
      weight: Math.max(0, weight)
    };
  }).filter(Boolean);

  if (exercises.length === 0) {
    if (!confirm('You are saving a workout with no exercises — continue?')) return;
  }

  const totalVolume = exercises.reduce(
    (s, e) => s + (e.sets * e.reps * e.weight),
    0
  );
  const wilksScore = Math.round(200 + (totalVolume / 50));

  const newWorkout = {
    id: Date.now().toString(),
    date: dateVal,
    exercises,
    wilksScore
  };

  workouts.unshift(newWorkout);
  saveWorkouts();
  addModal.classList.add('hidden');
  clearAddFields();
  renderAll();
});

function clearAddFields() {
  addDateInput.value = '';
  const rows = Array.from(exerciseListEl.querySelectorAll('.exercise-row'));
  rows.forEach(row => {
    row.querySelector('.ex-name').value = '';
    row.querySelector('.ex-sets').value = '';
    row.querySelector('.ex-reps').value = '';
    row.querySelector('.ex-weight').value = '';
  });
}

// --- Utilities ---
function computeTotalVolume(workout) {
  return workout.exercises.reduce(
    (sum, ex) => sum + (ex.sets * ex.reps * ex.weight),
    0
  );
}

function formatDateLabel(d) {
  try {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
}

function formatDateLong(d) {
  try {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return d;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

// --- Nav buttons ---
function initNavButtons() {
  document.querySelectorAll('.navbtn').forEach(link => {
    link.addEventListener('click', () => {
      link.animate(
        [{ opacity: 1 }, { opacity: 0.6 }, { opacity: 1 }],
        { duration: 300 }
      );
      if (window.innerWidth <= 1000) closeSidebar();
    });
  });
}

// Expose for debugging
window.__responsiveApp = {
  getWorkouts: () => workouts,
  renderAll
};
