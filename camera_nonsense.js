// // source:
// // https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos

// const width = 320; // We will scale the photo width to this
// let height = 0; // This will be computed based on the input stream

// let streaming = false;

// // variable balling
// const video = document.getElementById("video");
// const canvas = document.getElementById("canvas");
// const photo = document.getElementById("photo");
// const startButton = document.getElementById("start-button");
// const allowButton = document.getElementById("permissions-button");


// allowButton.addEventListener("click", () => {
//   navigator.mediaDevices
//     .getUserMedia({ video: true, audio: true })
//     .then((stream) => {
//       video.srcObject = stream;
//       video.play();
//     })
//     .catch((err) => {
//       console.error(`An error occurred: ${err}`);
//     });
// });

// // this only runs the first time it is called (via the condition)
// video.addEventListener("canplay", (ev) => {
//   if (!streaming) { // the condition
//     height = video.videoHeight / (video.videoWidth / width);

//     video.setAttribute("width", width);
//     video.setAttribute("height", height);
//     canvas.setAttribute("width", width);
//     canvas.setAttribute("height", height);
//     streaming = true;
//   }
// });


// async function getMedia() {

//   getUserMedia({
//     video: true,
//     audio: true
//   })
//   // let stream = null;

//   // try {
//   //   stream = await navigator.mediaDevices.getUserMedia({
//   //       video: true,
//   //       audio: true,
//   //   });
//   //   /* use the stream */
//   // } catch (err) {
//   //   /* handle the error */
//   // }
// }

// // https://www.geeksforgeeks.org/javascript/how-to-open-web-cam-in-javascript/
// document.addEventListener("DOMContentLoaded", () => {
//     let but = document.getElementById("but");
//     let video = document.getElementById("vid");
//     let mediaDevices = navigator.mediaDevices;
//     // video.muted = true;
//     but.addEventListener("click", () => {

//         // Accessing the user camera and video.
//         mediaDevices
//             .getUserMedia({
//                 video: true,
//                 audio: true,
//             })
//             .then((stream) => {
//                 // Changing the source of video to current stream.
//                 video.srcObject = stream;
//                 video.addEventListener("loadedmetadata", () => {
//                     video.play();
//                 });
//             })
//             .catch(alert);
//     });
// });


activateCamera()

function activateCamera() {
    // source: https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos

    const width = 320; // photo width will be scaled to this
    let height = 0; // will eventually be computed based on input stream

    let streaming = false;

    // variables
    const video = document.querySelector("video");
    const canvas = document.querySelector("canvas");
    const photo = document.querySelector("photo");
    const startButton = document.querySelector("start-button");
    const allowButton = document.querySelector("permissions-button"); // not created yet in the HTML

    // request video stream after asking user for Allow Camera permission
    allowButton.addEventListener("click", () => {
        // windows.navigator.mediaDevices gets a MediaDevices object to get info about
            // avail media devices
            // find out contraints for media
            // and request access to media
        navigator.mediaDevices
            .getUserMedia({video: true, audio: false}) // request access
            .then((stream) => {
                video.srcObject = stream;
                video.play(); // starts the video stream
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
            });
    });

    // listens for the video to start playing
    // this is the buffering before the video
    // canplay essentially determines when media is ready to stop buffering
    video.addEventListener("canplay", (ev) => {
        if(!streaming) {
            height = video.videoHeight / (videoWidth/width);
            
            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            streaming = true;    
        }
    })

    // takes the picture when user clicks startButton
    startButton.addEventListener("click", (ev) => {
        takePicture(); // takes picture
        ev.preventDefault(); // prevents double clicking 
    })

    // creates image then converts to img to display the photo
    function clearPhoto() {
        // returns drawing context on the canas
        const context = canvas.getContext("2d") // creates CanvasRenderingContext2D object represeting 2D redering context
        context.fillStyle = "aaaaaa" // almost black screen
        context/fillRect(0, 0, canvas.width, canvas.height)

        const data = canvas.toDataURL("image/png")
        photo.setAttribute("src", data) // actually stores the photo
    }
    clearPhoto();

    // captures the photo
    // converts to PNG
    // displays photo in frame box
    function takePicture() {
        const context = canvas.getContext("2D");
        if(width && height) {
            canvas.width = width;
            canvas.height = height;

            // I think this takes the photo
            context.drawImage(video, 0, 0 , width, height)

            const data = canvas.toDataURL("image/png")
            photo.setAttribute("src", data); // displays photo 
        }
        else {
            clearPhoto();
        }
    }
}
