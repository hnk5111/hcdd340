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
    "heavy1" : {
        "name": "heavy1",
        "day": 1,
        "isHeavyDay": true,
        "exercises_list": ["pause bench", "1rm bench"]
    },
    "heavy2" : {
        "name": "heavy2",
        "day": 2,
        "isHeavyDay": true,
        "exercises_list": ["pause squat", "1rm squat"]
    }
}

let individual_exercises = {
    "pause_squat": {
        "video_tutorial_link": "https://www.youtube.com/watch?v=nknf16JJTZo",
        "text_tutorial": "1. Squat 2. Pause 3. Go back up",
        "conversion_from_base": .8
    }
}


// tableWorkout("heavy1")
function defaultWorkoutTable(workoutDay) {
    let table = document.createElement("table")
    table.setAttribute("id", workoutDay)


    let sets_header = document.createElement("th")
    sets_header.setAttribute("scope", "col")
    sets_header.innerHTML = "Sets"
    let reps_header = document.createElement("th")
    reps_header.setAttribute("scope", "col")
    reps_header.innerHTML = "Reps"
    let RPE_header = document.createElement("th")
    RPE_header.setAttribute("scope", "col")
    RPE_header.innerHTML = "RPE"   

    table.appendChild(sets_header)
    table.appendChild(reps_header)
    table.appendChild(RPE_header)


    let workout_data = default_workouts[workoutDay]
    let exercises_list = workout_data.exercises_list
    for(exercise in exercises_list) {

        let exercise_tr = document.createElement("tr")
        let exercise_name_td= document.createElement("td")

        let reps_spinner = document.createElement("input")
        reps_spinner.setAttribute("type", "number")
        reps_spinner.value = 8
        let reps_spinner_td = document.createElement("td")
        
        exercise_name_td.textContent = exercises_list[exercise]
        
        reps_spinner_td.appendChild(reps_spinner)

        exercise_tr.appendChild(exercise_name_td)
        exercise_tr.appendChild(reps_spinner_td)

        table.appendChild(exercise_tr)
        console.log(exercises_list[exercise])
    }

    let tables_div = document.getElementById("tables_div")
    tables_div.append(table)




    // console.log(default_workouts[workoutDay])
    

    //     <!-- <table id = "workout_table">
    //     <th scope="col">exercise</th>
    //     <th>sets</th>
    //     <th>reps</th>
    //     <button onclick="collapse()"></button>
    //     <tr id="row1">
    //         <td>thing 1</td>
    //         <td>thing 1</td>
    //         <td>thing 1</td>
    //     </tr>
    // </table> -->
}

// createTable()
// function createTable() {
//     let tablez = document.createElement("table")
//     let th = document.createElement("th")
//     th.textContent = "header"
//     tablez.appendChild(th)

//     let tables_div = document.getElementById("tables_div")
//     tables_div.append(tablez)
// }


function collapse() {
    let tr = document.querySelector("row1")
    tr.classList.toggle("collapse")
}