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


async function getMedia() {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    /* use the stream */
  } catch (err) {
    /* handle the error */
  }
}



