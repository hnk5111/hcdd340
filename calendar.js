const STORAGE_KEY = "powr_calendar"; // localStorage key

const monthYearEl = document.getElementById("monthYear");
const calendarGridEl = document.getElementById("calendarGrid");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let currentDate = new Date(); // month being viewed
let workoutsByDate = loadWorkouts();

function loadWorkouts() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.error("Error loading workouts from localStorage", e);
        return {};
    }
}

function saveWorkouts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workoutsByDate));
}

function formatKey(year, monthIndex, day) {
    const m = (monthIndex + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    return `${year}-${m}-${d}`;
}

function renderCalendar(date) {
    calendarGridEl.innerHTML = "";

    const year = date.getFullYear();
    const monthIndex = date.getMonth(); // 0-11

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];
    monthYearEl.textContent = `${monthNames[monthIndex]} ${year}`;

    const firstDayIndex = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const today = new Date();
    const isToday = (y, m, d) =>
        y === today.getFullYear() &&
        m === today.getMonth() &&
        d === today.getDate();

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day", "empty");
        calendarGridEl.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.classList.add("day");

        if (isToday(year, monthIndex, day)) {
            cell.classList.add("today");
        }

        const numberEl = document.createElement("div");
        numberEl.classList.add("day-number");
        numberEl.textContent = day;
        cell.appendChild(numberEl);

        const key = formatKey(year, monthIndex, day);
        const workout = workoutsByDate[key];

        if (workout) {
            const workoutEl = document.createElement("div");
            workoutEl.classList.add("day-workout");
            workoutEl.textContent = workout; // e.g., "Squat", "Bench", "Rest"
            cell.appendChild(workoutEl);
        }

        cell.addEventListener("click", () => handleDayClick(year, monthIndex, day));

        calendarGridEl.appendChild(cell);
    }
}

function handleDayClick(year, monthIndex, day) {
    const key = formatKey(year, monthIndex, day);
    const existingValue = workoutsByDate[key] || "";

    const labelDate = `${monthIndex + 1}/${day}/${year}`;
    const input = prompt(
        `What are you doing on ${labelDate}?\n` +
        `Enter a workout (e.g., "Squat", "Bench", "Rest").\n` +
        `Leave empty and press OK to clear.`,
        existingValue
    );

    if (input === null) {
        return;
    }

    const trimmed = input.trim();

    if (trimmed === "") {
        // clear entry for that day
        delete workoutsByDate[key];
    } else {
        // save/update entry
        workoutsByDate[key] = trimmed;
    }

    saveWorkouts();
    renderCalendar(currentDate);
}

prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

renderCalendar(currentDate);