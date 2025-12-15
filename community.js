// sidebar / hamburger
const sidebarEl = document.getElementById("sidebar");
const hamburgerBtn = document.getElementById("hamburger");

// sidebar behavior (mobile)
if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
        sidebarEl.classList.toggle("open");
    });
}

// close sidebar after clicking a link on mobile
if (sidebarEl) {
    sidebarEl.addEventListener("click", (e) => {
        if (e.target && e.target.matches("a.navbtn")) {
            sidebarEl.classList.remove("open");
        }
    });
}

 
 let posts = JSON.parse(localStorage.getItem("powrPosts") || "[]");

  // helper to persist
  function savePosts() {
  localStorage.setItem("powrPosts", JSON.stringify(posts));
  }

  // Topics list
  const topics = ["Help", "PR", "Gear", "Nutrition", "General"];

  // Elements
  const modalBackdrop = document.getElementById("newPostModal");
  const openNewPostBtn = document.getElementById("openNewPost");
  const closeModalBtn = document.getElementById("closeModal");
  const cancelPostBtn = document.getElementById("cancelPost");
  const newPostForm = document.getElementById("newPostForm");
  const postContentEl = document.getElementById("postContent");
  const submitPostBtn = document.getElementById("submitPost");
  const topicListEl = document.getElementById("topicList");
  const selectedTopicInput = document.getElementById("selectedTopic");
  const feedEl = document.getElementById("feed");

  // Build topic buttons
  let currentTopic = "General";

  topics.forEach((topic) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = topic;
    btn.className = "topic-btn" + (topic === currentTopic ? " active" : "");
    btn.addEventListener("click", () => {
      currentTopic = topic;
      selectedTopicInput.value = topic;

      document
        .querySelectorAll(".topic-btn")
        .forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");
    });
    topicListEl.appendChild(btn);
  });
  

  // Modal helpers
  function openModal() {
    modalBackdrop.classList.add("visible");
    postContentEl.focus();
  }

  function resetTopicButtons() {
    document.querySelectorAll(".topic-btn").forEach((b) => {
      if (b.textContent === "General") {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });
  }

  function closeModal() {
    modalBackdrop.classList.remove("visible");
    newPostForm.reset();
    postContentEl.value = "";
    submitPostBtn.disabled = true;
    currentTopic = "General";
    selectedTopicInput.value = "General";
    resetTopicButtons();
  }

  // Open/close events
  openNewPostBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  cancelPostBtn.addEventListener("click", closeModal);

  // Close when clicking backdrop
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // Enable/disable submit button
  postContentEl.addEventListener("input", () => {
    const value = postContentEl.value.trim();
    submitPostBtn.disabled = value.length === 0;
  });

function createPostElement(post) {
  const article = document.createElement("article");
  article.className = "post-card";
  article.setAttribute("data-topic", post.topic);

  const mainRow = document.createElement("div");
  mainRow.className = "post-main-row";

  const left = document.createElement("div");
  left.className = "post-left";
  const avatar = document.createElement("div");
  avatar.className = "avatar circle";
  avatar.textContent = "U";
  left.appendChild(avatar);

  const center = document.createElement("div");
  center.className = "post-center";

  const topMeta = document.createElement("div");
  topMeta.className = "post-top-meta";

  const nameSpan = document.createElement("span");
  nameSpan.className = "post-name";
  nameSpan.textContent = post.userName || "User12345";

  const dotSpan = document.createElement("span");
  dotSpan.className = "dot";
  dotSpan.textContent = "·";

  const timeSpan = document.createElement("span");
  timeSpan.className = "post-time";
  timeSpan.textContent = "Just now";

  topMeta.appendChild(nameSpan);
  topMeta.appendChild(dotSpan);
  topMeta.appendChild(timeSpan);
  center.appendChild(topMeta);

  if (post.locationText) {
    const locRow = document.createElement("div");
    locRow.className = "post-location-row";
    const locIcon = document.createElement("span");
    locIcon.className = "post-location-icon";
    locIcon.textContent = "📍";
    const locText = document.createElement("span");
    locText.className = "post-location-text";
    locText.textContent = post.locationText;
    locRow.appendChild(locIcon);
    locRow.appendChild(locText);
    center.appendChild(locRow);
  }

  const bodyP = document.createElement("p");
  bodyP.className = "post-content";
  bodyP.textContent = post.content;
  center.appendChild(bodyP);

  const footer = document.createElement("div");
  footer.className = "post-footer";
  center.appendChild(footer);

  const right = document.createElement("div");
  right.className = "post-right";
  const topicPill = document.createElement("span");
  topicPill.className = "topic-pill small";
  topicPill.textContent = post.topic;
  right.appendChild(topicPill);

  mainRow.appendChild(left);
  mainRow.appendChild(center);
  mainRow.appendChild(right);
  article.appendChild(mainRow);

  return article;
}

// Render saved posts when the page loads
posts.forEach((post) => {
  const el = createPostElement(post);
  feedEl.appendChild(el);
});


async function getLocationForPost() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      return resolve(null);
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const url =
            "https://api.bigdatacloud.net/data/reverse-geocode-client" +
            "?latitude=" + encodeURIComponent(latitude) +
            "&longitude=" + encodeURIComponent(longitude) +
            "&localityLanguage=en";

          const res = await fetch(url);
          const data = await res.json(); // city/region fields[web:26][web:58]

          const city =
            data.city || data.locality ||
            (data.localityInfo &&
             data.localityInfo.locality &&
             data.localityInfo.locality.name);
          const region =
            data.principalSubdivision ||
            (data.localityInfo &&
             data.localityInfo.administrative &&
             data.localityInfo.administrative[0] &&
             data.localityInfo.administrative[0].name);

          let text;
          if (city && region) text = `${city}, ${region}`;
          else if (city) text = city;
          else if (region) text = region;
          else if (data.countryName) text = data.countryName;
          else text = null;

          resolve(text);
        } catch (e) {
          console.error(e);
          resolve(null);
        }
      },
      (err) => {
        console.warn("Geo error:", err);
        resolve(null); // permission denied or other error
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

newPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = postContentEl.value.trim();
  if (!content) return;

  const topic = currentTopic;
  const locationText = await getLocationForPost(); // may be null

  // build your post card (using your formatted structure)
  const article = document.createElement("article");
  article.className = "post-card";
  article.setAttribute("data-topic", topic);

  const mainRow = document.createElement("div");
  mainRow.className = "post-main-row";

  const left = document.createElement("div");
  left.className = "post-left";
  const avatar = document.createElement("div");
  avatar.className = "avatar circle";
  avatar.textContent = "U";
  left.appendChild(avatar);

  const center = document.createElement("div");
  center.className = "post-center";

  const topMeta = document.createElement("div");
  topMeta.className = "post-top-meta";

  const nameSpan = document.createElement("span");
  nameSpan.className = "post-name";
  nameSpan.textContent = "User12345";

  const dotSpan = document.createElement("span");
  dotSpan.className = "dot";
  dotSpan.textContent = "·";

  const timeSpan = document.createElement("span");
  timeSpan.className = "post-time";
  timeSpan.textContent = "Just now";

  topMeta.appendChild(nameSpan);
  topMeta.appendChild(dotSpan);
  topMeta.appendChild(timeSpan);

  // location row only if we have a value
  if (locationText) {
    const locRow = document.createElement("div");
    locRow.className = "post-location-row";

    const locIcon = document.createElement("span");
    locIcon.className = "post-location-icon";
    locIcon.textContent = "📍";

    const locText = document.createElement("span");
    locText.className = "post-location-text";
    locText.textContent = locationText;

    locRow.appendChild(locIcon);
    locRow.appendChild(locText);
    center.appendChild(topMeta);
    center.appendChild(locRow);
  } else {
    center.appendChild(topMeta);
  }
  

  const bodyP = document.createElement("p");
  bodyP.className = "post-content";
  bodyP.textContent = content;
  center.appendChild(bodyP);

  const footer = document.createElement("div");
  footer.className = "post-footer";
  // …create like/comment buttons as you already do …
  center.appendChild(footer);

  const right = document.createElement("div");
  right.className = "post-right";
  const topicPill = document.createElement("span");
  topicPill.className = "topic-pill small";
  topicPill.textContent = topic;
  right.appendChild(topicPill);

  mainRow.appendChild(left);
  mainRow.appendChild(center);
  mainRow.appendChild(right);
  article.appendChild(mainRow);

  feedEl.insertBefore(article, feedEl.firstChild);

  const post = {
    id: Date.now(),
    userName: "User12345",
    topic,
    content,
    locationText,
    createdAt: Date.now()
  };

  posts.push(post);
  savePosts();
  closeModal();
});
