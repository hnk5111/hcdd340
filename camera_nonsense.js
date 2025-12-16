activateCamera()

function activateCamera() {
    // source: https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos

    const width = 320; // photo width will be scaled to this
    let height = 0; // will eventually be computed based on input stream

    let streaming = false;

    // variables
    const video = document.querySelector("#video");
    const canvas = document.querySelector("#canvas");
    const photo = document.querySelector("#photo");
    const startButton = document.querySelector("#start-button");
    const allowButton = document.querySelector("#permissions-button"); 

    // request video stream after asking user for Allow Camera permission
    allowCamera();
    function allowCamera() {
        // windows.navigator.mediaDevices gets a MediaDevices object to get info about
            // avail media devices
            // find out contraints for media
            // and request access to media
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false }) // request access
            .then((stream) => {
                video.srcObject = stream;
                video.play(); // starts the video stream
            })
            .catch((err) => {
            console.error(`An error occurred: ${err}`);
            });
    }

    // listens for the video to start playing
    // this is the buffering before the video
    // canplay essentially determines when media is ready to stop buffering
    video.addEventListener("canplay", (ev) => {
        if(!streaming) {
            height = video.videoHeight / (video.videoWidth/width);
            
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
        context.fillRect(0, 0, canvas.width, canvas.height)

        const data = canvas.toDataURL("image/png")
        // photo.setAttribute("src", data) // actually stores the photo
    }
    clearPhoto();

    // captures the photo
    // converts to PNG
    // displays photo in frame box
    function takePicture() {
        const context = canvas.getContext("2d");
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL("image/png");
            // photo.setAttribute("src", data);

            // change to default code to store photo in localStorage
            localStorage.setItem("profilePicture", data)
        } 
        else {
            clearPhoto();
        }
    }

    

}

// this is mostly for me (Lawrence) to test to make sure that the saved photos actually save and store properly
// if(localStorage.getItem("profilePicture") != null) {
//     let img = document.createElement("img")
//     let div = document.querySelector("#profilePictureDiv")
//     img.src = localStorage.getItem("profilePicture")
//     div.appendChild(img)
// }