const userProfileContainer = document.getElementById("userProfileContainer");
const userPostsContainer = document.getElementById("userPostsContainer");
const userPostsTitle = document.getElementById("userPostsTitle");
const upLogoutBtn = document.getElementById("upLogoutBtn");

let allUsers = [];
let targetUser = null;
let targetPosts = [];

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

async function toggleFollowRequest(targetUserId, followerId) {
    const response = await fetch(`/api/users/${targetUserId}/follow`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            followerId,
        }),
    });

    const data = await response.json();

    if (!response.ok && response.status !== 409) {
        throw new Error(data.error || "Failed to update follow status");
    }

    return { status: response.status, data };
}

function formatPostTime(value) {
    if (!value) return "";
    return new Date(value).toLocaleString();
}

async function toggleFollow(targetUserId) {
    const currentUser = getCurrentUser();

    try {
        const result = await toggleFollowRequest(targetUserId, currentUser.id);

        if (result.status === 409) {
            currentUser.following = (currentUser.following || []).filter(function (id) {
                return id !== targetUserId;
            });
        } else {
            const followingList = currentUser.following || [];
            const alreadyFollowing = followingList.includes(targetUserId);

            if (alreadyFollowing) {
                currentUser.following = followingList.filter(function (id) {
                    return id !== targetUserId;
                });
            } else {
                currentUser.following = [...followingList, targetUserId];
            }
        }

        saveCurrentUser(currentUser);
        await loadUserProfileData();
    } catch (error) {
        console.error("Follow error:", error);
        alert("Could not update follow status.");
    }
}

function renderUserProfile() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "/Html/login.html";
        return;
    }

    if (!targetUser) {
        userProfileContainer.innerHTML = "<p>User not found.</p>";
        return;
    }

    if (targetUser.id === currentUser.id) {
        window.location.href = "/Html/profile.html";
        return;
    }

    const avatarSrc = targetUser.profilePicture
        ? targetUser.profilePicture
        : "/assets/images/default-avatar.png";

    const isFollowing = (currentUser.following || []).includes(targetUser.id);
    const followingCount = (targetUser.following || []).length;

    const followersCount = allUsers.filter(function (user) {
        const followingList = user.following || [];
        return followingList.includes(targetUser.id);
    }).length;

    userProfileContainer.innerHTML = `
        <div class="profile-image-box">
            <img src="${avatarSrc}" alt="${targetUser.username}" class="profile-image">
        </div>

        <h1 style="text-align:center;">${targetUser.username}</h1>
        <p style="text-align:center; color:#6b7280; margin-bottom:12px;">
            ${targetUser.bio ? targetUser.bio : "No bio yet."}
        </p>

        <div class="profile-stats">
            <span class="stat-item"><strong>${followingCount}</strong> Following</span>
            <span class="stat-divider">·</span>
            <span class="stat-item"><strong>${followersCount}</strong> Followers</span>
        </div>

        <div style="display:flex; justify-content:center; margin-top:16px;">
            <button id="followToggleBtn" class="primary-btn">
                ${isFollowing ? "Unfollow" : "Follow"}
            </button>
        </div>
    `;

    const followToggleBtn = document.getElementById("followToggleBtn");
    if (followToggleBtn) {
        followToggleBtn.addEventListener("click", async function () {
            await toggleFollow(targetUser.id);
        });
    }
}

function renderUserPosts() {
    if (!targetUser) {
        userPostsContainer.innerHTML = "<p>User not found.</p>";
        return;
    }

    userPostsTitle.textContent = targetUser.username + "'s Posts";
    userPostsContainer.innerHTML = "";

    if (!targetPosts || targetPosts.length === 0) {
        userPostsContainer.innerHTML = "<p>This user has not posted anything yet.</p>";
        return;
    }

    targetPosts.forEach(function (post) {
        const card = document.createElement("div");
        card.classList.add("post-card");

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

        card.appendChild(content);
        card.appendChild(time);
        card.appendChild(meta);
        card.appendChild(detailsBtn);

        userPostsContainer.appendChild(card);
    });
}

if (upLogoutBtn) {
    upLogoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "/Html/login.html";
    });
}

async function loadUserProfileData() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "/Html/login.html";
        return;
    }

    const selectedUserId = Number(localStorage.getItem("selectedUserId"));

    if (!selectedUserId) {
        userProfileContainer.innerHTML = "<p>User not found.</p>";
        userPostsContainer.innerHTML = "";
        return;
    }

    try {
        const [users, posts] = await Promise.all([
            fetchUsers(),
            fetchUserPosts(selectedUserId),
        ]);

        allUsers = users;
        targetPosts = posts;

        targetUser = users.find(function (user) {
            return user.id === selectedUserId;
        });

        renderUserProfile();
        renderUserPosts();
    } catch (error) {
        console.error("User profile loading error:", error);
        userProfileContainer.innerHTML = "<p>Could not load user profile.</p>";
        userPostsContainer.innerHTML = "<p>Could not load posts.</p>";
    }
}

loadUserProfileData();