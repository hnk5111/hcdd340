// =========================
// Calendar + Workouts integration
// - Reads real workouts from: powr_workouts_v1 (same as Profile)
// - Keeps optional quick notes on days in: powr_calendar
// - Shows Previous Workouts cards on this page too
// =========================

const WORKOUTS_KEY = "powr_workouts_v1";   // SAME KEY AS profile.js
const NOTES_KEY   = "powr_calendar";      // quick day notes (optional)

// calendar DOM
const monthYearEl = document.getElementById("monthYear");
const calendarGridEl = document.getElementById("calendarGrid");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

// sidebar / hamburger
const sidebarEl = document.getElementById("sidebar");
const hamburgerBtn = document.getElementById("hamburger");

// + button + modals
const addWorkoutBtn = document.getElementById("addWorkoutBtn");
const addWorkoutModal = document.getElementById("addWorkoutModal");
const detailsModal = document.getElementById("detailsModal");

const addDateEl = document.getElementById("addDate");
const addWilksEl = document.getElementById("addWilks");
const addExercisesEl = document.getElementById("addExercises");
const cancelAddBtn = document.getElementById("cancelAdd");
const saveWorkoutBtn = document.getElementById("saveWorkout");

const detailsBodyEl = document.getElementById("detailsBody");
const closeDetailsBtn = document.getElementById("closeDetails");

// previous workouts container
const workoutCardsEl = document.getElementById("workoutCards");

// state
let currentDate = new Date();
let workouts = loadWorkouts();
let notesByDate = loadNotes();

// -------------------------
// storage helpers
function safeJSONParse(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
}

function loadWorkouts() {
    return safeJSONParse(localStorage.getItem(WORKOUTS_KEY), []);
}

function saveWorkouts() {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

function loadNotes() {
    return safeJSONParse(localStorage.getItem(NOTES_KEY), {});
}

function saveNotes() {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notesByDate));
}

function formatKey(year, monthIndex, day) {
    const m = String(monthIndex + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
}

function formatPrettyDate(yyyyMMdd) {
    // yyyy-mm-dd -> "Nov 30"
    const [y, m, d] = yyyyMMdd.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function workoutsForDate(key) {
    return workouts.filter(w => w && w.date === key);
}

// -------------------------
// sidebar behavior (mobile)
if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
        sidebarEl.classList.toggle("open");
    });
}

// close sidebar after clicking a link on mobile
if (sidebarEl) {
    sidebarEl.addEventListener("click", (e) => {
        if (e.target && e.target.matches("a.navbtn")) {
            sidebarEl.classList.remove("open");
        }
    });
}

// -------------------------
// calendar rendering
function renderCalendar(date) {
    workouts = loadWorkouts(); // ALWAYS re-read latest workouts
    notesByDate = loadNotes();

    calendarGridEl.innerHTML = "";

    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];
    monthYearEl.textContent = `${monthNames[monthIndex]} ${year}`;

    const firstDayIndex = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // blanks
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day", "empty");
        calendarGridEl.appendChild(emptyCell);
    }

    // days
    for (let day = 1; day <= daysInMonth; day++) {
        const key = formatKey(year, monthIndex, day);

        const cell = document.createElement("div");
        cell.classList.add("day");

        const num = document.createElement("div");
        num.classList.add("day-number");
        num.textContent = day;
        cell.appendChild(num);

        // real workouts (from Profile storage)
        const dayWorkouts = workoutsForDate(key);
        if (dayWorkouts.length) {
            cell.classList.add("has-workout");

            // show most recent workout summary
            const w = dayWorkouts[dayWorkouts.length - 1];
            const exCount = Array.isArray(w.exercises) ? w.exercises.length : 0;

            // IMPORTANT: profile uses wilksScore
            const wilks = (w.wilksScore ?? "");

            const line = `${exCount} exercise(s)${wilks !== "" && wilks !== null ? ` • Wilks: ${wilks}` : ""}`;

            const workoutEl = document.createElement("div");
            workoutEl.classList.add("day-workout");
            workoutEl.textContent = line;
            cell.appendChild(workoutEl);
        }

        // optional quick note
        const note = notesByDate[key];
        if (note) {
            const noteEl = document.createElement("div");
            noteEl.classList.add("day-note");
            noteEl.textContent = note;
            cell.appendChild(noteEl);
        }

        // click behavior:
        // - normal click: edit quick note
        // - SHIFT + click: add real workout for that date
        cell.addEventListener("click", (evt) => {
            if (evt.shiftKey) {
                openAddWorkoutModal(key);
                return;
            }
            handleDayNoteClick(key);
        });

        // double click: open details if workout exists
        cell.addEventListener("dblclick", () => {
            const dayWorkouts2 = workoutsForDate(key);
            if (dayWorkouts2.length) openDetailsModal(key);
        });

        calendarGridEl.appendChild(cell);
    }

    renderPreviousWorkouts();
}

function handleDayNoteClick(key) {
    const existingValue = notesByDate[key] || "";
    const input = prompt(
        `Quick note for ${key}\n(Leave empty to clear)`,
        existingValue
    );

    if (input === null) return;

    const trimmed = input.trim();
    if (!trimmed) delete notesByDate[key];
    else notesByDate[key] = trimmed;

    saveNotes();
    renderCalendar(currentDate);
}

// month nav
prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// -------------------------
// Previous Workouts cards (same as profile)
function renderPreviousWorkouts() {
    if (!workoutCardsEl) return;

    workoutCardsEl.innerHTML = "";

    const sorted = [...workouts]
        .filter(w => w && w.date)
        .sort((a,b) => String(b.date).localeCompare(String(a.date)));

    const top = sorted.slice(0, 6);
    if (!top.length) {
        const empty = document.createElement("div");
        empty.textContent = "No workouts yet. Tap + to add your first one.";
        empty.style.color = "#666";
        workoutCardsEl.appendChild(empty);
        return;
    }

    for (const w of top) {
        const card = document.createElement("div");
        card.className = "workout-card";

        const h = document.createElement("div");
        h.className = "date";
        h.textContent = formatPrettyDate(w.date);
        card.appendChild(h);

        const exCount = Array.isArray(w.exercises) ? w.exercises.length : 0;

        const meta1 = document.createElement("div");
        meta1.className = "meta";
        meta1.textContent = `Wilks: ${w.wilksScore ?? "—"}`;
        card.appendChild(meta1);

        const meta2 = document.createElement("div");
        meta2.className = "meta";
        meta2.textContent = `${exCount} exercise(s)`;
        card.appendChild(meta2);

        const btn = document.createElement("button");
        btn.className = "view";
        btn.textContent = "View";
        btn.addEventListener("click", () => openDetailsModal(w.date));
        card.appendChild(btn);

        workoutCardsEl.appendChild(card);
    }
}

// -------------------------
// Add workout modal
function openAddWorkoutModal(dateKey = null) {
    const now = new Date();
    const todayKey = formatKey(now.getFullYear(), now.getMonth(), now.getDate());

    addDateEl.value = dateKey || todayKey;
    addWilksEl.value = "";
    addExercisesEl.value = "";
    addWorkoutModal.classList.remove("hidden");
}

function closeAddWorkoutModal() {
    addWorkoutModal.classList.add("hidden");
}

function openDetailsModal(dateKey) {
    const list = workoutsForDate(dateKey);
    detailsBodyEl.innerHTML = "";

    const title = document.getElementById("detailsTitle");
    if (title) title.textContent = `Workout • ${formatPrettyDate(dateKey)}`;

    if (!list.length) {
        detailsBodyEl.textContent = "No workout saved for this day.";
        detailsModal.classList.remove("hidden");
        return;
    }

    for (const w of list) {
        const wrap = document.createElement("div");
        wrap.style.border = "1px solid #eee";
        wrap.style.borderRadius = "10px";
        wrap.style.padding = "10px";
        wrap.style.marginTop = "10px";

        const wilks = document.createElement("div");
        wilks.innerHTML = `<b>Wilks:</b> ${w.wilksScore ?? "—"}`;
        wrap.appendChild(wilks);

        const ex = document.createElement("div");
        const exList = Array.isArray(w.exercises) ? w.exercises : [];
        ex.innerHTML = `<b>Exercises:</b> ${exList.length ? exList.join(", ") : "—"}`;
        wrap.appendChild(ex);

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "btn secondary";
        del.style.marginTop = "10px";
        del.addEventListener("click", () => {
            workouts = workouts.filter(x => x !== w);
            saveWorkouts();
            detailsModal.classList.add("hidden");
            renderCalendar(currentDate);
        });
        wrap.appendChild(del);

        detailsBodyEl.appendChild(wrap);
    }

    detailsModal.classList.remove("hidden");
}

function closeDetailsModal() {
    detailsModal.classList.add("hidden");
}

function saveNewWorkout() {
    const date = (addDateEl.value || "").trim();
    if (!date) {
        alert("Please choose a date.");
        return;
    }

    const wilks = addWilksEl.value ? Number(addWilksEl.value) : null;

    const exercisesRaw = (addExercisesEl.value || "").trim();
    const exercises = exercisesRaw
        ? exercisesRaw.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const newWorkout = {
        id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())),
        date,
        wilksScore: Number.isFinite(wilks) ? wilks : null,
        exercises,
        createdAt: new Date().toISOString()
    };

    workouts.push(newWorkout);
    saveWorkouts();

    closeAddWorkoutModal();
    renderCalendar(currentDate);
}

// modal event wiring
addWorkoutBtn.addEventListener("click", () => openAddWorkoutModal());
cancelAddBtn.addEventListener("click", closeAddWorkoutModal);
saveWorkoutBtn.addEventListener("click", saveNewWorkout);
closeDetailsBtn.addEventListener("click", closeDetailsModal);

addWorkoutModal.addEventListener("click", (e) => {
    if (e.target === addWorkoutModal) closeAddWorkoutModal();
});
detailsModal.addEventListener("click", (e) => {
    if (e.target === detailsModal) closeDetailsModal();
});

// -------------------------
// boot
renderCalendar(currentDate);