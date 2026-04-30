const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // users
  const usersData = [
    {
      username: "khalid",
      email: "khalid@example.com",
      password: "123456",
      bio: "CS student, usually online at night.",
      profilePicture: "/assets/images/avatar1.png",
    },
    {
      username: "abdullah",
      email: "abdullah@example.com",
      password: "123456",
      bio: "Trying to survive the semester.",
      profilePicture: "/assets/images/avatar2.png",
    },
    {
      username: "falah",
      email: "falah@example.com",
      password: "123456",
      bio: "Coffee first, then coding.",
      profilePicture: "/assets/images/avatar3.png",
    },
    {
      username: "mujahid",
      email: "mujahid@example.com",
      password: "123456",
      bio: "Checking projects and progress.",
      profilePicture: "/assets/images/avatar4.png",
    },
    {
      username: "sara",
      email: "sara@example.com",
      password: "123456",
      bio: "I like clean design and simple apps.",
      profilePicture: "/assets/images/avatar5.png",
    },
    {
      username: "nasser",
      email: "nasser@example.com",
      password: "123456",
      bio: "Always posting random updates.",
      profilePicture: "/assets/images/avatar1.png",
    },
    {
      username: "dana",
      email: "dana@example.com",
      password: "123456",
      bio: "A little bit of everything.",
      profilePicture: "/assets/images/avatar2.png",
    },
    {
      username: "reem",
      email: "reem@example.com",
      password: "123456",
      bio: "Still fixing small details.",
      profilePicture: "/assets/images/avatar3.png",
    },
    {
      username: "yousef",
      email: "yousef@example.com",
      password: "123456",
      bio: "Mostly here for the memes.",
      profilePicture: "/assets/images/avatar4.png",
    },
    {
      username: "maryam",
      email: "maryam@example.com",
      password: "123456",
      bio: "UI matters more than people think.",
      profilePicture: "/assets/images/avatar5.png",
    },
    {
      username: "hamad",
      email: "hamad@example.com",
      password: "123456",
      bio: "Testing things one step at a time.",
      profilePicture: "/assets/images/avatar1.png",
    },
    {
      username: "noora",
      email: "noora@example.com",
      password: "123456",
      bio: "Trying to keep everything organized.",
      profilePicture: "/assets/images/avatar2.png",
    },
    {
      username: "ali",
      email: "ali@example.com",
      password: "123456",
      bio: "Backend first, design later.",
      profilePicture: "/assets/images/avatar3.png",
    },
    {
      username: "fatima",
      email: "fatima@example.com",
      password: "123456",
      bio: "I just want the project to run smoothly.",
      profilePicture: "/assets/images/avatar4.png",
    },
    {
      username: "omar",
      email: "omar@example.com",
      password: "123456",
      bio: "Still debugging but almost there.",
      profilePicture: "/assets/images/avatar5.png",
    },
    {
      username: "layan",
      email: "layan@example.com",
      password: "123456",
      bio: "Simple ideas usually work best.",
      profilePicture: "/assets/images/avatar1.png",
    },
    {
      username: "saad",
      email: "saad@example.com",
      password: "123456",
      bio: "Trying not to break anything.",
      profilePicture: "/assets/images/avatar2.png",
    },
    {
      username: "amal",
      email: "amal@example.com",
      password: "123456",
      bio: "Small progress is still progress.",
      profilePicture: "/assets/images/avatar3.png",
    },
    {
      username: "hessa",
      email: "hessa@example.com",
      password: "123456",
      bio: "I like apps that feel clean and easy.",
      profilePicture: "/assets/images/avatar4.png",
    },
    {
      username: "zayed",
      email: "zayed@example.com",
      password: "123456",
      bio: "Almost done, just a few last checks.",
      profilePicture: "/assets/images/avatar5.png",
    },
  ];

  const createdUsers = {};
  for (const user of usersData) {
    const created = await prisma.user.create({ data: user });
    createdUsers[user.username] = created;
  }

  // posts
  const postsData = [
    { username: "khalid", content: "Finally finished the database setup. It took longer than I expected." },
    { username: "abdullah", content: "Working on Phase 2 now. The API part is actually not bad once it starts working." },
    { username: "falah", content: "The repository file is done. Need to test everything properly now." },
    { username: "mujahid", content: "Make sure your report explains how to run the project from scratch." },
    { username: "sara", content: "Small UI updates make a big difference honestly." },
    { username: "nasser", content: "Tried the follow feature today and it finally works the way I wanted." },
    { username: "dana", content: "Still fixing tiny bugs, but overall the project looks good now." },
    { username: "khalid", content: "Posted two test messages just to make sure the profile page updates correctly." },
    { username: "abdullah", content: "Need more seed data so the statistics page looks more realistic." },
    { username: "sara", content: "The feed looks much better when there are enough users and posts." },
    { username: "nasser", content: "I deleted one post by mistake and had to add it again." },
    { username: "dana", content: "Testing comments, likes, follows, and everything one by one." },
    { username: "reem", content: "Spent too much time fixing one small path issue." },
    { username: "yousef", content: "At least the project is starting to feel like a real app now." },
    { username: "maryam", content: "The colors look much better after the last CSS update." },
    { username: "hamad", content: "I tested the routes again and they finally look stable." },
    { username: "noora", content: "Trying to keep the files clean before we submit." },
    { username: "ali", content: "Repository functions made the API files way more organized." },
    { username: "fatima", content: "The profile page still needs one more check but it is almost done." },
    { username: "omar", content: "We should record the demo video early just in case." },
    { username: "layan", content: "Simple layouts are easier to explain in the presentation." },
    { username: "saad", content: "I am checking each feature one by one so nothing gets missed." },
    { username: "amal", content: "The follow and unfollow flow looks much clearer now." },
    { username: "hessa", content: "Need to make sure the feed updates correctly after every action." },
    { username: "zayed", content: "The statistics page should update immediately after new actions." },
    { username: "khalid", content: "I like how the app looks with real data instead of empty cards." },
    { username: "abdullah", content: "The login route works fine now, finally." },
    { username: "falah", content: "Just added another round of tests for comments and likes." },
    { username: "reem", content: "The UI is simple but honestly that makes it easier to use." },
    { username: "yousef", content: "We need enough accounts so the feed does not feel empty." },
    { username: "maryam", content: "I think the cleanest part of the project is the profile page." },
    { username: "ali", content: "The database part is way better than localStorage for this phase." },
    { username: "omar", content: "Need to remember the setup steps for the report." },
    { username: "hessa", content: "Posting this just to make the stats look more realistic." },
    { username: "zayed", content: "Almost ready for the final demo, just a few details left." },
  ];

  const createdPosts = [];
  for (const post of postsData) {
    const created = await prisma.post.create({
      data: {
        content: post.content,
        userId: createdUsers[post.username].id,
      },
    });
    createdPosts.push(created);
  }

  // comments
  const commentsData = [
    { username: "abdullah", postIndex: 0, text: "Nice, that is a good start." },
    { username: "falah", postIndex: 0, text: "Yeah once the setup is done it gets easier." },
    { username: "mujahid", postIndex: 1, text: "Good, keep going." },
    { username: "khalid", postIndex: 2, text: "The repository part usually saves time later." },
    { username: "sara", postIndex: 3, text: "True, setup steps are important in the report." },
    { username: "dana", postIndex: 4, text: "The colors look clean actually." },
    { username: "khalid", postIndex: 5, text: "Nice, that feature was annoying at first." },
    { username: "abdullah", postIndex: 6, text: "Almost there." },
    { username: "nasser", postIndex: 7, text: "Good idea, that helps with testing." },
    { username: "falah", postIndex: 8, text: "Exactly, stats need enough data." },
    { username: "abdullah", postIndex: 9, text: "It feels more real with more content in the feed." },
    { username: "sara", postIndex: 10, text: "At least you noticed before the demo." },
    { username: "mujahid", postIndex: 11, text: "That is the safest way honestly." },
    { username: "reem", postIndex: 12, text: "Path problems waste so much time." },
    { username: "yousef", postIndex: 13, text: "Yeah now it actually feels alive." },
    { username: "maryam", postIndex: 14, text: "The new colors really helped." },
    { username: "hamad", postIndex: 15, text: "Good, keep testing before changing more files." },
    { username: "noora", postIndex: 16, text: "Clean files make demos less stressful." },
    { username: "ali", postIndex: 17, text: "Much easier to read than before." },
    { username: "fatima", postIndex: 18, text: "It is looking better now." },
    { username: "omar", postIndex: 19, text: "Yes, better to record early." },
    { username: "layan", postIndex: 20, text: "Simple is easier to present too." },
    { username: "saad", postIndex: 21, text: "Good way to avoid surprises later." },
    { username: "amal", postIndex: 22, text: "That feature finally feels smooth." },
    { username: "hessa", postIndex: 23, text: "The feed should definitely refresh correctly." },
    { username: "zayed", postIndex: 24, text: "Dynamic stats will look better in the demo." },
    { username: "sara", postIndex: 25, text: "Real data always makes the UI look nicer." },
    { username: "falah", postIndex: 26, text: "Good, one less thing to worry about." },
    { username: "dana", postIndex: 27, text: "Nice, keep those tests." },
    { username: "mujahid", postIndex: 28, text: "The simple style works well here." },
  ];

  for (const comment of commentsData) {
    await prisma.comment.create({
      data: {
        text: comment.text,
        userId: createdUsers[comment.username].id,
        postId: createdPosts[comment.postIndex].id,
      },
    });
  }

  // likes
  const likesData = [
    ["abdullah", 0], ["falah", 0], ["sara", 0], ["reem", 0],
    ["khalid", 1], ["mujahid", 1], ["ali", 1],
    ["khalid", 2], ["abdullah", 2], ["hamad", 2],
    ["dana", 3], ["noora", 3],
    ["nasser", 4], ["khalid", 4],
    ["sara", 5], ["dana", 5], ["yousef", 5],
    ["falah", 6], ["maryam", 6],
    ["abdullah", 7], ["mujahid", 7], ["saad", 7],
    ["nasser", 8], ["sara", 8],
    ["khalid", 9], ["abdullah", 9], ["dana", 9],
    ["falah", 10], ["reem", 10],
    ["sara", 11], ["ali", 11],
    ["hamad", 12], ["noora", 12],
    ["maryam", 13], ["falah", 13],
    ["zayed", 14], ["amal", 14],
    ["khalid", 15], ["yousef", 15],
  ];

  for (const [username, postIndex] of likesData) {
    await prisma.like.create({
      data: {
        userId: createdUsers[username].id,
        postId: createdPosts[postIndex].id,
      },
    });
  }

  // follows
  const followsData = [
    ["khalid", "abdullah"],
    ["khalid", "falah"],
    ["khalid", "sara"],
    ["khalid", "reem"],
    ["abdullah", "khalid"],
    ["abdullah", "dana"],
    ["abdullah", "nasser"],
    ["falah", "khalid"],
    ["falah", "nasser"],
    ["falah", "maryam"],
    ["mujahid", "khalid"],
    ["mujahid", "abdullah"],
    ["mujahid", "ali"],
    ["sara", "khalid"],
    ["sara", "dana"],
    ["sara", "hessa"],
    ["nasser", "sara"],
    ["nasser", "yousef"],
    ["dana", "khalid"],
    ["dana", "abdullah"],
    ["reem", "maryam"],
    ["yousef", "nasser"],
    ["maryam", "sara"],
    ["hamad", "khalid"],
    ["noora", "reem"],
    ["ali", "falah"],
    ["fatima", "maryam"],
    ["omar", "khalid"],
    ["layan", "sara"],
    ["saad", "abdullah"],
    ["amal", "dana"],
    ["hessa", "maryam"],
    ["zayed", "khalid"],
  ];

  for (const [followerUsername, followingUsername] of followsData) {
    await prisma.follow.create({
      data: {
        followerId: createdUsers[followerUsername].id,
        followingId: createdUsers[followingUsername].id,
      },
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });