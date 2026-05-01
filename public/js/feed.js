const welcomeMessage = document.getElementById("welcomeMessage");
const postForm = document.getElementById("postForm");
const postContent = document.getElementById("postContent");
const logoutBtn = document.getElementById("logoutBtn");
const usersContainer = document.getElementById("usersContainer");
const followingPostsContainer = document.getElementById("followingPostsContainer");
const explorePostsContainer = document.getElementById("explorePostsContainer");

let allUsers = [];
let allPosts = [];
let followingPosts = [];
let explorePosts = [];

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

async function fetchPosts(userId) {
    const response = await fetch(`/api/posts?userId=${userId}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to load posts");
    }

    return data;
}

async function createPostRequest(userId, content) {
    const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            content,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
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

    if (!response.ok) {
        throw new Error(data.error || "Failed to update follow status");
    }

    return data;
}

async function toggleLikeRequest(postId, userId) {
    const response = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to update like");
    }

    return data;
}

async function addCommentRequest(postId, userId, text) {
    const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            text,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to add comment");
    }

    return data;
}

async function deletePostRequest(postId, userId) {
    const response = await fetch(`/api/posts/${postId}?userId=${userId}`, {
        method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
    }

    return data;
}

function formatPostTime(value) {
    if (!value) return "";
    return new Date(value).toLocaleString();
}

function splitPostsForFeed() {
    const currentUser = getCurrentUser();
    const followingIds = currentUser.following || [];

    followingPosts = allPosts.filter(function (post) {
        return post.userId === currentUser.id || followingIds.includes(post.userId);
    });

    explorePosts = allPosts.filter(function (post) {
        return post.userId !== currentUser.id && !followingIds.includes(post.userId);
    });
}

function getFollowersCount(userId) {
    return allUsers.filter(function (user) {
        const followingList = user.following || [];
        return followingList.includes(userId);
    }).length;
}

function renderUsers(searchText = "") {
    const currentUser = getCurrentUser();

    usersContainer.innerHTML = "";

    const searchWrapper = document.createElement("div");
    searchWrapper.classList.add("user-search-wrapper");

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search users";
    searchInput.classList.add("user-search-input");
    searchInput.value = searchText;

    searchInput.addEventListener("input", function () {
        renderUsers(searchInput.value);
    });

    searchWrapper.appendChild(searchInput);
    usersContainer.appendChild(searchWrapper);

    let otherUsers = allUsers.filter(function (user) {
        return user.id !== currentUser.id;
    });

    if (searchText) {
        const text = searchText.toLowerCase().trim();

        otherUsers = otherUsers.filter(function (user) {
            return user.username.toLowerCase().includes(text) ||
                   (user.bio && user.bio.toLowerCase().includes(text));
        });
    }

    if (otherUsers.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No users found.";
        usersContainer.appendChild(message);
        return;
    }

    otherUsers.forEach(function (user) {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        const avatar = document.createElement("img");
        avatar.classList.add("post-avatar");
        avatar.src = user.profilePicture ? user.profilePicture : "/assets/images/default-avatar.png";
        avatar.alt = user.username;

        const info = document.createElement("div");
        info.classList.add("user-card-info");

        const followersCount = getFollowersCount(user.id);

        info.innerHTML = `
            <p><strong>${user.username}</strong></p>
            <p>${user.bio ? user.bio : "No bio yet."}</p>
            <p>${followersCount} follower${followersCount !== 1 ? "s" : ""}</p>
        `;

        const actions = document.createElement("div");
        actions.classList.add("user-card-actions");

        const viewProfileBtn = document.createElement("button");
        viewProfileBtn.classList.add("post-btn");
        viewProfileBtn.textContent = "View Profile";
        viewProfileBtn.addEventListener("click", function () {
            localStorage.setItem("selectedUserId", user.id);
            window.location.href = "/Html/user-profile.html";
        });

        const followingList = currentUser.following || [];
        const isFollowing = followingList.includes(user.id);

        const followBtn = document.createElement("button");
        followBtn.classList.add("post-btn");
        followBtn.textContent = isFollowing ? "Unfollow" : "Follow";
        followBtn.addEventListener("click", async function () {
            await toggleFollow(user.id);
        });

        actions.appendChild(viewProfileBtn);
        actions.appendChild(followBtn);

        userCard.appendChild(avatar);
        userCard.appendChild(info);
        userCard.appendChild(actions);

        usersContainer.appendChild(userCard);
    });
}

function renderPostsList(posts, container, emptyMessage) {
    const currentUser = getCurrentUser();

    container.innerHTML = "";

    if (!posts || posts.length === 0) {
        container.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }

    posts.forEach(function (post) {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");

        const postHeader = document.createElement("div");
        postHeader.classList.add("post-header");

        const postUser = post.user;

        const postAvatar = document.createElement("img");
        postAvatar.classList.add("post-avatar");
        postAvatar.src = postUser && postUser.profilePicture
            ? postUser.profilePicture
            : "/assets/images/default-avatar.png";

        const usernameEl = document.createElement("h3");
        usernameEl.textContent = postUser ? postUser.username : "Unknown";
        usernameEl.style.cursor = "pointer";

        usernameEl.addEventListener("click", function () {
            if (post.userId === currentUser.id) {
                window.location.href = "/Html/profile.html";
            } else {
                localStorage.setItem("selectedUserId", post.userId);
                window.location.href = "/Html/user-profile.html";
            }
        });

        postHeader.appendChild(postAvatar);
        postHeader.appendChild(usernameEl);

        const content = document.createElement("p");
        content.textContent = post.content;

        const time = document.createElement("div");
        time.classList.add("post-time");
        time.textContent = formatPostTime(post.createdAt);

        const actions = document.createElement("div");
        actions.classList.add("post-actions");

        const likesList = post.likes || [];
        const likeCount = likesList.length;
        const alreadyLiked = likesList.some(function (like) {
            return Number(like.userId) === Number(currentUser.id);
        });

        const likeButton = document.createElement("button");
        likeButton.classList.add("post-btn");
        likeButton.textContent = `${alreadyLiked ? "Unlike" : "Like"} (${likeCount})`;
        likeButton.addEventListener("click", async function () {
            try {
                await toggleLikeRequest(post.id, currentUser.id);
                await loadFeedData();
            } catch (error) {
                console.error("Like error:", error);
                alert(error.message || "Could not update like status.");
            }
        });

        const detailsButton = document.createElement("button");
        detailsButton.classList.add("post-btn");
        detailsButton.textContent = "View Details";
        detailsButton.addEventListener("click", function () {
            localStorage.setItem("selectedPostId", post.id);
            window.location.href = "/Html/post.html";
        });

        actions.appendChild(likeButton);
        actions.appendChild(detailsButton);

        if (currentUser.id === post.userId) {
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("post-btn");
            deleteButton.textContent = "Delete Post";
            deleteButton.addEventListener("click", async function () {
                await deletePost(post.id);
            });

            actions.appendChild(deleteButton);
        }

        const commentsSection = document.createElement("div");
        commentsSection.classList.add("comments-section");

        const commentsTitle = document.createElement("h4");
        commentsTitle.textContent = "Comments";
        commentsSection.appendChild(commentsTitle);

        if (post.comments && post.comments.length > 0) {
            post.comments.forEach(function (comment) {
                const commentItem = document.createElement("div");
                commentItem.classList.add("comment-item");
                commentItem.innerHTML = `<strong>${comment.user?.username || "User"}:</strong> ${comment.text}`;
                commentsSection.appendChild(commentItem);
            });
        } else {
            commentsSection.innerHTML += "<p>No comments yet.</p>";
        }

        const commentForm = document.createElement("form");
        commentForm.classList.add("comment-form");

        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Write a comment";
        commentInput.required = true;
        commentInput.classList.add("comment-input");

        const commentButton = document.createElement("button");
        commentButton.type = "submit";
        commentButton.textContent = "Comment";
        commentButton.classList.add("post-btn");

        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentButton);

        commentForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const text = commentInput.value.trim();

            if (!text) {
                return;
            }

            try {
                await addCommentRequest(post.id, currentUser.id, text);
                await loadFeedData();
            } catch (error) {
                console.error("Comment error:", error);
                alert(error.message || "Could not add comment.");
            }
        });

        postCard.appendChild(postHeader);
        postCard.appendChild(content);
        postCard.appendChild(time);
        postCard.appendChild(actions);
        postCard.appendChild(commentsSection);
        postCard.appendChild(commentForm);

        container.appendChild(postCard);
    });
}

function renderFeedSections() {
    renderPostsList(
        followingPosts,
        followingPostsContainer,
        "No posts from users you follow yet."
    );

    renderPostsList(
        explorePosts,
        explorePostsContainer,
        "No explore posts available."
    );
}

async function toggleFollow(targetUserId) {
    const currentUser = getCurrentUser();

    try {
        const result = await toggleFollowRequest(targetUserId, currentUser.id);

        if (result.following) {
            const followingList = currentUser.following || [];
            if (!followingList.includes(targetUserId)) {
                currentUser.following = [...followingList, targetUserId];
            }
        } else {
            currentUser.following = (currentUser.following || []).filter(function (id) {
                return id !== targetUserId;
            });
        }

        saveCurrentUser(currentUser);
        await loadFeedData();
    } catch (error) {
        console.error("Follow error:", error);
        alert(error.message || "Could not update follow status.");
    }
}

async function deletePost(postId) {
    const currentUser = getCurrentUser();
    const confirmDelete = confirm("Are you sure you want to delete this post?");

    if (!confirmDelete) {
        return;
    }

    try {
        await deletePostRequest(postId, currentUser.id);
        await loadFeedData();
    } catch (error) {
        console.error("Delete post error:", error);
        alert(error.message || "Could not delete post.");
    }
}

if (postForm) {
    postForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const currentUser = getCurrentUser();

        if (!currentUser) {
            alert("Please login first.");
            window.location.href = "/Html/login.html";
            return;
        }

        const text = postContent.value.trim();

        if (!text) {
            return;
        }

        try {
            await createPostRequest(currentUser.id, text);
            postForm.reset();
            await loadFeedData();
        } catch (error) {
            console.error("Create post error:", error);
            alert(error.message || "Could not create post.");
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "/Html/login.html";
    });
}

async function loadFeedData() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "/Html/login.html";
        return;
    }

    try {
        const [users, posts] = await Promise.all([
            fetchUsers(),
            fetchPosts(currentUser.id),
        ]);

        allUsers = users;
        allPosts = posts;

        const freshCurrentUser = users.find(function (user) {
            return Number(user.id) === Number(currentUser.id);
        });

        if (freshCurrentUser) {
            freshCurrentUser.following = currentUser.following || [];
            saveCurrentUser(freshCurrentUser);
            welcomeMessage.textContent = "Welcome, " + freshCurrentUser.username;
        } else {
            welcomeMessage.textContent = "Welcome";
        }

        splitPostsForFeed();
        renderUsers();
        renderFeedSections();
    } catch (error) {
        console.error("Feed loading error:", error);

        if (followingPostsContainer) {
            followingPostsContainer.innerHTML = "<p>Could not load following posts.</p>";
        }

        if (explorePostsContainer) {
            explorePostsContainer.innerHTML = "<p>Could not load explore posts.</p>";
        }
    }
}

loadFeedData();