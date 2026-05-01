async function getStats() {
  const res = await fetch("http://localhost:3000/api/stats", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }

  return res.json();
}

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <main style={{ padding: "30px", fontFamily: "Arial, sans-serif", background: "#eef5f4", minHeight: "100vh" }}>
      <h1 style={{ color: "#123b63", marginBottom: "24px" }}>Platform Statistics</h1>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div style={cardStyle}>
          <h2>Average Followers Per User</h2>
          <p>{stats.averageFollowersPerUser}</p>
        </div>

        <div style={cardStyle}>
          <h2>Average Posts Per User</h2>
          <p>{stats.averagePostsPerUser}</p>
        </div>

        <div style={cardStyle}>
          <h2>Average Comments Per Post</h2>
          <p>{stats.averageCommentsPerPost}</p>
        </div>

        <div style={cardStyle}>
          <h2>Most Followed User</h2>
          <p>{stats.mostFollowedUser?.username}</p>
          <small>{stats.mostFollowedUser?.followers} followers</small>
        </div>

        <div style={cardStyle}>
          <h2>Most Active User</h2>
          <p>{stats.mostActiveUser?.username}</p>
          <small>{stats.mostActiveUser?.posts} posts</small>
        </div>

        <div style={cardStyle}>
          <h2>Most Liked Post</h2>
          <p style={{ marginBottom: "8px" }}>{stats.mostLikedPost?.content}</p>
          <small>
            by {stats.mostLikedPost?.username} — {stats.mostLikedPost?.likes} likes
          </small>
        </div>
      </div>
    </main>
  );
}

const cardStyle = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  border: "1px solid #cbd5e1",
};