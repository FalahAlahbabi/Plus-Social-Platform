const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profileBio = document.getElementById("profileBio");
const profileImage = document.getElementById("profileImage");
const profileStats = document.getElementById("profileStats");
const bioForm = document.getElementById("bioForm");
const bioInput = document.getElementById("bioInput");
const myPostsContainer = document.getElementById("myPostsContainer");
const profileLogoutBtn = document.getElementById("profileLogoutBtn");
const savePictureBtn = document.getElementById("savePictureBtn");

let allUsers = [];
let myPosts = [];

function getCurrentUser() {
    const currentUser = localStorage.getItem("currentUser");
    return currentUser ? JSON.parse(currentUser) : null;
}

function saveCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

async function fetchUsers() {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to load users");
    }

    return data;
}

async function fetchUserPosts(userId) {
    const response = await fetch(`/api/users/${userId}/posts`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to load user posts");
    }

    return data;
}

async function updateBioRequest(userId, bio) {
    const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bio,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to update bio");
    }

    return data;
}

async function updatePictureRequest(userId, profilePicture) {
    const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            profilePicture,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to update profile picture");
    }

    return data;
}

function formatPostTime(value) {
    if (!value) return "";
    return new Date(value).toLocaleString();
}

function renderProfile() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "/Html/login.html";
        return;
    }

    profileUsername.textContent = currentUser.username;
    profileEmail.textContent = currentUser.email;
    profileBio.textContent = currentUser.bio ? currentUser.bio : "No bio yet.";
    bioInput.value = currentUser.bio ? currentUser.bio : "";
    profileImage.src = currentUser.profilePicture
        ? currentUser.profilePicture
        : "/assets/images/default-avatar.png";

    if (profileStats) {
        const followingCount = (currentUser.following || []).length;
        const followersCount = allUsers.filter(function (user) {
            const followingList = user.following || [];
            return user.id !== currentUser.id && followingList.includes(currentUser.id);
        }).length;

        profileStats.innerHTML = `
            <span class="stat-item" id="followingToggle" style="cursor:pointer;">
                <strong>${followingCount}</strong> Following
            </span>
            <span class="stat-divider">·</span>
            <span class="stat-item">
                <strong>${followersCount}</strong> Followers
            </span>
        `;

        const followingToggle = document.getElementById("followingToggle");

        if (followingToggle) {
            followingToggle.addEventListener("click", function () {
                showFollowingList(currentUser, allUsers);
            });
        }
    }
}

function showFollowingList(currentUser, users) {
    const followingIds = currentUser.following || [];

    if (followingIds.length === 0) {
        alert("You are not following anyone yet.");
        return;
    }

    const followingNames = followingIds.map(function (id) {
        const user = users.find(function (u) {
            return u.id === id;
        });

        return user ? user.username : "Unknown";
    });

    alert("You are following:\n" + followingNames.join(", "));
}

function renderMyPosts() {
    const currentUser = getCurrentUser();

    myPostsContainer.innerHTML = "";

    const onlyMyPosts = myPosts.filter(function (post) {
        return post.userId === currentUser.id;
    });

    if (onlyMyPosts.length === 0) {
        myPostsContainer.innerHTML = "<p>You have not created any posts yet.</p>";
        return;
    }

    onlyMyPosts.forEach(function (post) {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");

        const content = document.createElement("p");
        content.textContent = post.content;

        const time = document.createElement("div");
        time.classList.add("post-time");
        time.textContent = formatPostTime(post.createdAt);

        const meta = document.createElement("p");
        meta.textContent =
            "Likes: " + (post.likes ? post.likes.length : 0) +
            " | Comments: " + (post.comments ? post.comments.length : 0);

        const detailsBtn = document.createElement("button");
        detailsBtn.classList.add("post-btn");
        detailsBtn.textContent = "View Details";
        detailsBtn.style.marginTop = "10px";

        detailsBtn.addEventListener("click", function () {
            localStorage.setItem("selectedPostId", post.id);
            window.location.href = "/Html/post.html";
        });

        postCard.appendChild(content);
        postCard.appendChild(time);
        postCard.appendChild(meta);
        postCard.appendChild(detailsBtn);

        myPostsContainer.appendChild(postCard);
    });
}

if (bioForm) {
    bioForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const currentUser = getCurrentUser();
        const newBio = bioInput.value.trim();

        try {
            const updatedUser = await updateBioRequest(currentUser.id, newBio);

            updatedUser.following = currentUser.following || [];
            saveCurrentUser(updatedUser);

            renderProfile();
            alert("Bio updated successfully!");
        } catch (error) {
            console.error("Bio update error:", error);
            alert("Could not update bio.");
        }
    });
}

if (savePictureBtn) {
    savePictureBtn.addEventListener("click", async function () {
        const selectedPictureInput = document.querySelector('input[name="editProfilePicture"]:checked');

        if (!selectedPictureInput) {
            alert("Please choose a profile picture first.");
            return;
        }

        const newPicture = selectedPictureInput.value;
        const currentUser = getCurrentUser();

        try {
            const updatedUser = await updatePictureRequest(currentUser.id, newPicture);

            updatedUser.following = currentUser.following || [];
            saveCurrentUser(updatedUser);

            renderProfile();
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Profile picture update error:", error);
            alert("Could not update profile picture.");
        }
    });
}

if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "/Html/login.html";
    });
}

async function loadProfileData() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "/Html/login.html";
        return;
    }

    try {
        const [users, posts] = await Promise.all([
            fetchUsers(),
            fetchUserPosts(currentUser.id),
        ]);

        allUsers = users;
        myPosts = posts;

        const freshCurrentUser = users.find(function (user) {
            return user.id === currentUser.id;
        });

        if (freshCurrentUser) {
            freshCurrentUser.following = currentUser.following || [];
            saveCurrentUser(freshCurrentUser);
        }

        renderProfile();
        renderMyPosts();
    } catch (error) {
        console.error("Profile loading error:", error);
        myPostsContainer.innerHTML = "<p>Could not load profile data.</p>";
    }
}

loadProfileData();