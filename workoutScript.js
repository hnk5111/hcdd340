populateTable()

// liftDay: String
function populateTable(liftDay) {
    const table = document.querySelector("workout_table")
    // collect JSON data based on the liftDay

    let numExercises = 2 // will be the number of exercises in the JSON
    for(let i = 0; i < numExercises; i++) {
        let tr = document.createElement("tr")
        // add text of the exercises to the tr
        // add the tr to the table
    }
}


function collapse() {
    let tr = document.querySelector("row1")
    tr.classList.toggle("collapse")
}