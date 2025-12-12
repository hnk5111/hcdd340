// LOCAL STORAGE
const STORAGE_KEY = "powr_calendar";

function loadWorkouts() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveWorkouts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workoutsByDate));
}

function formatKey(year, monthIndex, day) {
    return `${year}-${String(monthIndex+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

let currentDate = new Date();
let workoutsByDate = loadWorkouts();

const monthYearEl = document.getElementById("monthYear");
const calendarGridEl = document.getElementById("calendarGrid");

function renderCalendar(date) {
    calendarGridEl.innerHTML = "";

    const y = date.getFullYear();
    const m = date.getMonth();

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    monthYearEl.textContent = `${monthNames[m]} ${y}`;

    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m+1, 0).getDate();

    // empty squares
    for (let i = 0; i < firstDay; i++) {
        let cell = document.createElement("div");
        cell.classList.add("day", "empty");
        calendarGridEl.appendChild(cell);
    }

    // days
    for (let day = 1; day <= daysInMonth; day++) {
        let cell = document.createElement("div");
        cell.classList.add("day");

        let num = document.createElement("div");
        num.classList.add("day-number");
        num.textContent = day;
        cell.appendChild(num);

        let key = formatKey(y, m, day);
        if (workoutsByDate[key]) {
            let w = document.createElement("div");
            w.classList.add("day-workout");
            w.textContent = workoutsByDate[key];
            cell.appendChild(w);
        }

        cell.addEventListener("click", () => handleDayClick(y, m, day));
        calendarGridEl.appendChild(cell);
    }
}

function handleDayClick(y, m, d) {
    const key = formatKey(y, m, d);
    const current = workoutsByDate[key] || "";

    const input = prompt(`Workout for ${m+1}/${d}/${y}:`, current);
    if (input === null) return;

    const t = input.trim();

    if (t === "") {
        delete workoutsByDate[key];
    } else {
        workoutsByDate[key] = t;
    }

    saveWorkouts();
    renderCalendar(currentDate);
}

// Month buttons
document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});
document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// INITIAL RENDER
renderCalendar(currentDate);

// SIDEBAR (FROM PROFILE)
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// FAB BUTTON
document.getElementById("fab-add").addEventListener("click", () => {
    window.location.href = "workout.html";
});