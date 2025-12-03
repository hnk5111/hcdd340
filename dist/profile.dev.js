"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// --- Data & storage ---
var DEFAULT_WORKOUTS = [{
  id: '1',
  date: '2024-11-30',
  exercises: [{
    name: 'Squat',
    sets: 3,
    reps: 8,
    weight: 225
  }, {
    name: 'Bench Press',
    sets: 3,
    reps: 8,
    weight: 185
  }, {
    name: 'Deadlift',
    sets: 3,
    reps: 5,
    weight: 315
  }],
  wilksScore: 285
}, {
  id: '2',
  date: '2024-11-27',
  exercises: [{
    name: 'Squat',
    sets: 3,
    reps: 8,
    weight: 220
  }, {
    name: 'Overhead Press',
    sets: 3,
    reps: 8,
    weight: 95
  }, {
    name: 'Barbell Row',
    sets: 3,
    reps: 8,
    weight: 155
  }],
  wilksScore: 278
}, {
  id: '3',
  date: '2024-11-25',
  exercises: [{
    name: 'Bench Press',
    sets: 3,
    reps: 8,
    weight: 180
  }, {
    name: 'Incline Dumbbell Press',
    sets: 3,
    reps: 10,
    weight: 70
  }, {
    name: 'Tricep Dips',
    sets: 3,
    reps: 12,
    weight: 0
  }],
  wilksScore: 272
}, {
  id: '4',
  date: '2024-11-23',
  exercises: [{
    name: 'Deadlift',
    sets: 3,
    reps: 5,
    weight: 305
  }, {
    name: 'Front Squat',
    sets: 3,
    reps: 8,
    weight: 185
  }, {
    name: 'Leg Press',
    sets: 3,
    reps: 12,
    weight: 360
  }],
  wilksScore: 280
}];
var STORAGE_KEY = 'responsive_workouts_v1';
var workouts = loadWorkouts(); // --- Load / save ---

function loadWorkouts() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return DEFAULT_WORKOUTS.map(function (w) {
    return _objectSpread({}, w, {
      exercises: w.exercises.map(function (e) {
        return _objectSpread({}, e);
      })
    });
  });
}

function saveWorkouts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  } catch (e) {
    console.warn('storage failed', e);
  }
} // --- DOM refs ---


var sidebar = document.getElementById('sidebar');
var hamburger = document.getElementById('hamburger');
var workoutCardsEl = document.getElementById('workoutCards');
var addBtn = document.getElementById('addWorkoutBtn');
var addModal = document.getElementById('addWorkoutModal');
var cancelAdd = document.getElementById('cancelAdd');
var saveWorkoutBtn = document.getElementById('saveWorkout');
var addDateInput = document.getElementById('addDate');
var exerciseListEl = document.getElementById('exerciseList');
var detailsModal = document.getElementById('detailsModal');
var detailsBody = document.getElementById('detailsBody');
var closeDetailsBtn = document.getElementById('closeDetails');
var wilksChart = null;
var totalChart = null; // --- Init on DOM ready ---

document.addEventListener('DOMContentLoaded', function () {
  initSidebarBehavior();
  initCharts();
  renderAll();
  initNavButtons();
}); // --- Sidebar / hamburger ---

function initSidebarBehavior() {
  hamburger.addEventListener('click', function () {
    var expanded = hamburger.getAttribute('aria-expanded') === 'true';

    if (expanded) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1000 && sidebar.classList.contains('open')) {
      var inside = sidebar.contains(e.target) || hamburger.contains(e.target);
      if (!inside) closeSidebar();
    }
  });
  document.addEventListener('keydown', function (e) {
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

  window.addEventListener('resize', function () {
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
} // --- Charts ---


function initCharts() {
  var wilksCanvas = document.getElementById('wilksChart');
  var totalCanvas = document.getElementById('totalChart');
  if (!wilksCanvas || !totalCanvas) return;
  var wilksCtx = wilksCanvas.getContext('2d');
  var totalCtx = totalCanvas.getContext('2d');
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
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Wilks Score'
          }
        }
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
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Lift Volume (lbs)'
          }
        }
      }
    }
  });
}

function updateCharts() {
  if (!wilksChart || !totalChart) return;

  var sorted = _toConsumableArray(workouts).sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  var labels = sorted.map(function (w) {
    return formatDateLabel(w.date);
  });
  var wilksData = sorted.map(function (w) {
    return w.wilksScore;
  });
  var totalVolumes = sorted.map(function (w) {
    return computeTotalVolume(w);
  });
  wilksChart.data.labels = labels;
  wilksChart.data.datasets[0].data = wilksData;
  wilksChart.update();
  totalChart.data.labels = labels;
  totalChart.data.datasets[0].data = totalVolumes;
  totalChart.update();
} // --- Rendering ---


function renderAll() {
  renderWorkoutCards();
  updateCharts();
  saveWorkouts();
}

function renderWorkoutCards() {
  workoutCardsEl.innerHTML = '';
  var slice = workouts.slice(0, 4);
  slice.forEach(function (w) {
    var card = document.createElement('article');
    card.className = 'workout-card';
    card.tabIndex = 0;
    card.innerHTML = "\n      <h4>".concat(formatDateLabel(w.date), "</h4>\n      <p>Wilks: <strong>").concat(w.wilksScore, "</strong></p>\n      <p class=\"muted\">").concat(w.exercises.length, " exercise(s)</p>\n      <div style=\"margin-top:8px;display:flex;gap:8px;justify-content:flex-end\">\n        <button class=\"btn view\" data-id=\"").concat(w.id, "\">View</button>\n      </div>\n    ");
    workoutCardsEl.appendChild(card);
    card.querySelector('.view').addEventListener('click', function (e) {
      e.stopPropagation();
      openDetails(w.id);
    });
    card.addEventListener('click', function () {
      return openDetails(w.id);
    });
    card.addEventListener('keypress', function (ev) {
      if (ev.key === 'Enter') openDetails(w.id);
    });
  });
} // --- Details modal ---


function openDetails(id) {
  var w = workouts.find(function (x) {
    return x.id === id;
  });
  if (!w) return;
  detailsBody.innerHTML = buildDetailsHtml(w);
  detailsModal.classList.remove('hidden');
  var delBtn = detailsBody.querySelector('#deleteWorkout');

  if (delBtn) {
    delBtn.addEventListener('click', function () {
      if (!confirm('Delete workout?')) return;
      workouts = workouts.filter(function (x) {
        return x.id !== id;
      });
      saveWorkouts();
      detailsModal.classList.add('hidden');
      renderAll();
    });
  }
}

closeDetailsBtn.addEventListener('click', function () {
  detailsModal.classList.add('hidden');
});

function buildDetailsHtml(w) {
  var rows = w.exercises.map(function (ex) {
    return "\n    <div style=\"padding:6px 0;border-bottom:1px solid #eee\">\n      <div style=\"font-weight:600\">".concat(escapeHtml(ex.name || 'Unnamed'), "</div>\n      <div style=\"color:#666\">").concat(ex.sets, " sets \xD7 ").concat(ex.reps, " reps @ ").concat(ex.weight, " lbs</div>\n    </div>\n  ");
  }).join('');
  return "\n    <p><strong>Date:</strong> ".concat(formatDateLong(w.date), "</p>\n    <p><strong>Wilks Score:</strong> ").concat(w.wilksScore, "</p>\n    <div style=\"margin-top:12px\">").concat(rows || '<em>No exercises recorded</em>', "</div>\n    <div style=\"margin-top:12px;display:flex;gap:8px;justify-content:flex-end\">\n      <button id=\"deleteWorkout\" class=\"btn\" style=\"background:#ffecec;border:1px solid #f5c2c2;color:#a00\">Delete</button>\n    </div>\n  ");
} // --- Add workout modal ---


addBtn.addEventListener('click', function () {
  addModal.classList.remove('hidden');
  addDateInput.value = new Date().toISOString().slice(0, 10);
  addDateInput.focus();
});
cancelAdd.addEventListener('click', function () {
  addModal.classList.add('hidden');
});
saveWorkoutBtn.addEventListener('click', function () {
  var dateVal = addDateInput.value;

  if (!dateVal) {
    alert('Please choose a date.');
    return;
  }

  var rows = Array.from(exerciseListEl.querySelectorAll('.exercise-row'));
  var exercises = rows.map(function (row) {
    var name = row.querySelector('.ex-name').value.trim();
    var sets = parseInt(row.querySelector('.ex-sets').value || '0', 10);
    var reps = parseInt(row.querySelector('.ex-reps').value || '0', 10);
    var weight = parseInt(row.querySelector('.ex-weight').value || '0', 10);
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

  var totalVolume = exercises.reduce(function (s, e) {
    return s + e.sets * e.reps * e.weight;
  }, 0);
  var wilksScore = Math.round(200 + totalVolume / 50);
  var newWorkout = {
    id: Date.now().toString(),
    date: dateVal,
    exercises: exercises,
    wilksScore: wilksScore
  };
  workouts.unshift(newWorkout);
  saveWorkouts();
  addModal.classList.add('hidden');
  clearAddFields();
  renderAll();
});

function clearAddFields() {
  addDateInput.value = '';
  var rows = Array.from(exerciseListEl.querySelectorAll('.exercise-row'));
  rows.forEach(function (row) {
    row.querySelector('.ex-name').value = '';
    row.querySelector('.ex-sets').value = '';
    row.querySelector('.ex-reps').value = '';
    row.querySelector('.ex-weight').value = '';
  });
} // --- Utilities ---


function computeTotalVolume(workout) {
  return workout.exercises.reduce(function (sum, ex) {
    return sum + ex.sets * ex.reps * ex.weight;
  }, 0);
}

function formatDateLabel(d) {
  try {
    var dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  } catch (_unused) {
    return d;
  }
}

function formatDateLong(d) {
  try {
    var dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (_unused2) {
    return d;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
} // --- Nav buttons ---


function initNavButtons() {
  document.querySelectorAll('.navbtn').forEach(function (link) {
    link.addEventListener('click', function () {
      link.animate([{
        opacity: 1
      }, {
        opacity: 0.6
      }, {
        opacity: 1
      }], {
        duration: 300
      });
      if (window.innerWidth <= 1000) closeSidebar();
    });
  });
} // Expose for debugging


window.__responsiveApp = {
  getWorkouts: function getWorkouts() {
    return workouts;
  },
  renderAll: renderAll
};