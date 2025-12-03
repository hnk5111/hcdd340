// populateTable()

// liftDay: String
// function populateTable(liftDay) {
//     const table = document.querySelector("workout_table")
//     // collect JSON data based on the liftDay

//     let numExercises = 2 // will be the number of exercises in the JSON
//     for(let i = 0; i < numExercises; i++) {
//         let tr = document.createElement("tr")
//         // add text of the exercises to the tr
//         // add the tr to the table
//     }
// }


let default_workouts = {
    "one" : {
        "name": "heavy1",
        "day": 1,
        "isHeavyDay": true,
        "exercises": ["pause bench", "1rm bench"]
    },
    "two" : {
        "name": "heavy2",
        "day": 2,
        "isHeavyDay": true,
        "exercises": ["pause squat", "1rm squat"]
    }
}


tableWorkout()
function tableWorkout() {
    // let table = document.createElement("table")


    console.log(default_workouts);
}


function collapse() {
    let tr = document.querySelector("row1")
    tr.classList.toggle("collapse")
}