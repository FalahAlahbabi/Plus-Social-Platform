import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: {
          include: {
            comments: true,
            likes: true,
          },
        },
        followers: true,
        following: true,
      },
    });

    const posts = await prisma.post.findMany({
      include: {
        likes: true,
        comments: true,
        user: true,
      },
    });

    const totalUsers = users.length;
    const totalPosts = posts.length;

    const totalFollowers = users.reduce((sum, user) => sum + user.followers.length, 0);
    const averageFollowersPerUser = totalUsers > 0 ? (totalFollowers / totalUsers).toFixed(2) : "0";

    const averagePostsPerUser = totalUsers > 0 ? (totalPosts / totalUsers).toFixed(2) : "0";

    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
    const averageCommentsPerPost = totalPosts > 0 ? (totalComments / totalPosts).toFixed(2) : "0";

    let mostFollowedUser = null;
    let maxFollowers = -1;

    users.forEach((user) => {
      if (user.followers.length > maxFollowers) {
        maxFollowers = user.followers.length;
        mostFollowedUser = {
          username: user.username,
          followers: user.followers.length,
        };
      }
    });

    let mostActiveUser = null;
    let maxPosts = -1;

    users.forEach((user) => {
      if (user.posts.length > maxPosts) {
        maxPosts = user.posts.length;
        mostActiveUser = {
          username: user.username,
          posts: user.posts.length,
        };
      }
    });

    let mostLikedPost = null;
    let maxLikes = -1;

    posts.forEach((post) => {
      if (post.likes.length > maxLikes) {
        maxLikes = post.likes.length;
        mostLikedPost = {
          id: post.id,
          content: post.content,
          likes: post.likes.length,
          username: post.user.username,
        };
      }
    });

    return NextResponse.json({
      averageFollowersPerUser,
      averagePostsPerUser,
      averageCommentsPerPost,
      mostFollowedUser,
      mostActiveUser,
      mostLikedPost,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load statistics" },
      { status: 500 }
    );
  }
}