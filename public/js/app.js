const postDetailsContainer = document.getElementById("postDetailsContainer");
const postLogoutBtn = document.getElementById("postLogoutBtn");

function getCurrentUser() {
    const currentUser = localStorage.getItem("currentUser");
    return currentUser ? JSON.parse(currentUser) : null;
}

async function fetchPostById(postId) {
    const response = await fetch(`/api/posts/${postId}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to load post");
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

async function deleteCommentRequest(commentId, userId) {
    const response = await fetch(`/api/comments/${commentId}?userId=${userId}`, {
        method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to delete comment");
    }

    return data;
}

function formatPostTime(value) {
    if (!value) return "";
    return new Date(value).toLocaleString();
}

async function renderPostDetails() {
    if (!postDetailsContainer) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "/Html/login.html";
        return;
    }

    const selectedPostId = Number(localStorage.getItem("selectedPostId"));

    if (!selectedPostId) {
        postDetailsContainer.innerHTML = "<p>Post not found.</p>";
        return;
    }

    try {
        const selectedPost = await fetchPostById(selectedPostId);

        const postUser = selectedPost.user;

        const avatarSrc = postUser && postUser.profilePicture
            ? postUser.profilePicture
            : "/assets/images/default-avatar.png";

        const comments = selectedPost.comments || [];
        const likes = selectedPost.likes || [];
        const likesCount = likes.length;

        const alreadyLiked = likes.some(function (like) {
            return like.userId === currentUser.id;
        });

        let commentsHTML = "";

        if (comments.length > 0) {
            comments.forEach(function (comment) {
                const canDelete = comment.userId === currentUser.id;

                commentsHTML += `
                    <div class="comment-item">
                        <div>
                            <strong>${comment.user.username}:</strong> ${comment.text}
                        </div>
                        ${canDelete ? `<button class="comment-delete-btn" onclick="deleteCommentFromPost(${comment.id})">Delete</button>` : ""}
                    </div>
                `;
            });
        } else {
            commentsHTML = `<p class="no-comments">No comments yet.</p>`;
        }

        const profileLink = selectedPost.userId === currentUser.id
            ? "/Html/profile.html"
            : "/Html/user-profile.html";

        const profileAction = selectedPost.userId !== currentUser.id
            ? `onclick="localStorage.setItem('selectedUserId', ${selectedPost.userId})"`
            : "";

        postDetailsContainer.innerHTML = `
            <h1>Post Details</h1>

            <div class="post-card">
                <div class="post-header">
                    <img class="post-avatar" src="${avatarSrc}" alt="${postUser.username}">
                    <h3>
                        <a href="${profileLink}" ${profileAction} class="username-link">${postUser.username}</a>
                    </h3>
                </div>

                <p>${selectedPost.content}</p>
                <div class="post-time">${formatPostTime(selectedPost.createdAt)}</div>

                <p><strong>Likes:</strong> ${likesCount}</p>
                <p><strong>Comments:</strong> ${comments.length}</p>

                <div class="post-actions" style="margin-top: 12px;">
                    <button class="post-btn" onclick="toggleLikeOnDetail(${selectedPost.id})">
                        ${alreadyLiked ? "Unlike" : "Like"} (${likesCount})
                    </button>
                </div>

                <div class="comments-section">
                    <h4>Comments</h4>
                    ${commentsHTML}
                </div>

                <form class="comment-form" onsubmit="event.preventDefault(); handleDetailComment(${selectedPost.id});">
                    <input type="text" id="detailCommentInput" class="comment-input" placeholder="Write a comment" required>
                    <button type="submit" class="post-btn">Comment</button>
                </form>
            </div>

            <p class="form-footer" style="margin-top: 16px;">
                <a href="/Html/feed.html">Back to Feed</a>
            </p>
        `;
    } catch (error) {
        console.error("Post details error:", error);
        postDetailsContainer.innerHTML = "<p>Could not load post details.</p>";
    }
}

async function handleDetailComment(postId) {
    const currentUser = getCurrentUser();
    const input = document.getElementById("detailCommentInput");
    const text = input ? input.value.trim() : "";

    if (!text) {
        return;
    }

    try {
        await addCommentRequest(postId, currentUser.id, text);
        await renderPostDetails();
    } catch (error) {
        console.error("Comment error:", error);
        alert("Could not add comment.");
    }
}

async function toggleLikeOnDetail(postId) {
    const currentUser = getCurrentUser();

    try {
        await toggleLikeRequest(postId, currentUser.id);
        await renderPostDetails();
    } catch (error) {
        console.error("Like error:", error);
        alert("Could not update like.");
    }
}

async function deleteCommentFromPost(commentId) {
    const currentUser = getCurrentUser();
    const confirmDelete = confirm("Delete this comment?");

    if (!confirmDelete) {
        return;
    }

    try {
        await deleteCommentRequest(commentId, currentUser.id);
        await renderPostDetails();
    } catch (error) {
        console.error("Delete comment error:", error);
        alert("Could not delete comment.");
    }
}

if (postLogoutBtn) {
    postLogoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "/Html/login.html";
    });
}

renderPostDetails();