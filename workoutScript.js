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


    // creates all of the header
    let sets_header = document.createElement("th")
    sets_header.setAttribute("scope", "col")
    sets_header.textContent = "Sets"
    let reps_header = document.createElement("th")
    reps_header.setAttribute("scope", "col")
    reps_header.textContent = "Reps"
    let RPE_header = document.createElement("th")
    RPE_header.setAttribute("scope", "col")
    RPE_header.textContent = "RPE"   
    let video_record_header = document.createElement("th")
    video_record_header.setAttribute("scope", "col")
    video_record_header.textContent = "Recording Yourself"   

    // adds all headers to the table
    table.appendChild(sets_header)
    table.appendChild(reps_header)
    table.appendChild(RPE_header)
    table.appendChild(video_record_header)


    let workout_data = default_workouts[workoutDay]
    let exercises_list = workout_data.exercises_list
    for(exercise in exercises_list) {

        // creates rows 
        let exercise_tr = document.createElement("tr")

        // creates where the name of the exercise
        let exercise_name_td = document.createElement("td")

        // creates spinner object for tracking the number of reps actually completed
        let reps_spinner = document.createElement("input")
        reps_spinner.setAttribute("type", "number")
        reps_spinner.value = 8
        let reps_spinner_td = document.createElement("td")

        let rpe_td = document.createElement("td")
        rpe_td.textContent = 8
        
        let record_button = document.createElement("button")
        record_button.textContent = "record"
        // record_button.setAttribute("onclick", "recordingPopup()")
        record_button.addEventListener("click", () => recordingPopup());


        exercise_name_td.textContent = exercises_list[exercise]
        
        reps_spinner_td.appendChild(reps_spinner)

        exercise_tr.appendChild(exercise_name_td)
        exercise_tr.appendChild(reps_spinner_td)
        exercise_tr.appendChild(rpe_td)
        exercise_tr.appendChild(record_button)


        table.appendChild(exercise_tr)
        console.log(exercises_list[exercise])
    }

    // adds a div to put the table in
    let tables_div = document.getElementById("tables_div")
    tables_div.append(table)

    // console.log(default_workouts[workoutDay])
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

function recordingPopup() {
    // const input = 
    window.alert("Recording started!")
}

function record() {
    console.log('poop fart')

    var video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.style.width = '200px';
    video.style.height = '200px';

    /* Setting up the constraint */
    var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
    var constraints = {
        audio: false,
        video: {
        facingMode: facingMode
        }
    };

    /* Stream it to video element */
    navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
    video.srcObject = stream;
    });
}

// async function getMedia(constraints) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
        });
    /* use the stream */
  } catch (err) {
    /* handle the error */
  }
}