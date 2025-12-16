localStorage.clear();
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

    let button = document.querySelector(`${video_link}button`)
    button.textContent = "Saved!"
}

renderResources()

function renderResources() {
    if(localStorage.getItem("favoriteVideos") != null) {
        let favoriteVideosJSON = 
        let keys = 
    }
}
