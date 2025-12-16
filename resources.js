window.onload = function() {
    renderResources()
};

function renderResources() {
    if(localStorage.getItem("favoriteVideos") != null) {
        let favoriteVideosJSON = JSON.parse(localStorage.getItem("favoriteVideos"));
        let length = Object.keys(favoriteVideosJSON).length;

        let keys = Object.keys(favoriteVideosJSON);
        let div = document.querySelector("#saved-videos-div")
        div.innerHTML = ""
        for(let i = 0; i < length; i++) {
            let favVideo = (favoriteVideosJSON[keys[i]].link)
            let pTag = document.createElement("p")
            pTag.id = favVideo
            pTag.textContent = favVideo;
            div.appendChild(pTag)
        }
    }
}


function save(video_link) {
    if(localStorage.getItem("favoriteVideos") != null) {
        let favoriteVideosArray = JSON.parse(localStorage.getItem("favoriteVideos"));
        favoriteVideosArray[video_link] = {
            "link": video_link
        }
        localStorage.setItem("favoriteVideos", JSON.stringify(favoriteVideosArray))
    
    }
    else {
        let favoriteVideosJSON = {
            [video_link]: {
                "link": video_link
            }
        }
        localStorage.setItem("favoriteVideos", JSON.stringify(favoriteVideosJSON))        
    }

    console.log(video_link.substring(22, 29))
    let button = document.getElementById(video_link.substring(22, 29))
    button.textContent = "Saved!"
    renderResources()

}