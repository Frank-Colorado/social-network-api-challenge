const db = require("../../config/connection");
const { User, Thought } = require("../../models");
const { faker } = require("@faker-js/faker");

db.on("error", (err) => err);

db.once("open", async () => {
  console.log("connected to database");

  // Delete existing Users
  await User.deleteMany({});
  console.log("deleted users");
  // Delete existing Thoughts
  await Thought.deleteMany({});
  console.log("deleted thoughts");

  // Create Users
  const userData = Array.from({ length: 10 }).map(() => ({
    username: faker.internet.userName(),
    email: faker.internet.email(),
  }));

  const createdUsers = await User.collection.insertMany(userData);
  console.log("here", createdUsers);
  const allUsers = await User.find({});
  // For every created user grab their ID and push it into an array
  const userIds = allUsers.map((user) => user._id);
  // For each User their ID will be used to update their friends array.
  // A random amount of IDs will be pushed into the friends array
  const newUsers = await Promise.all(
    userIds.map((userId) => {
      randomFriends = faker.helpers.arrayElements(userIds, {
        min: 2,
        max: userIds.length,
      });
      return User.findByIdAndUpdate(
        userId,
        { $push: { friends: randomFriends } },
        { new: true }
      );
    })
  );
  console.log("created users", newUsers);

  const userNames = newUsers.map((user) => user.username);

  // Create Thoughts
  const thoughtData = Array.from({ length: 20 }).map(() => ({
    thoughtText: faker.lorem.sentence(),
    username: userNames[Math.floor(Math.random() * userNames.length)],
  }));

  const createdThoughts = await Thought.collection.insertMany(thoughtData);
  // For every created thought grab their ID and push it into an array
  const allThoughts = await Thought.find({});
  const thoughtIds = allThoughts.map((thought) => thought._id);
  // For each User their ID will be used to update their thoughts array.
  // A random amount of reactions will be created and pushed into the reactions array
  const newThoughts = await Promise.all(
    thoughtIds.map((thoughtId) => {
      randomReactions = Array.from({
        length: Math.floor(Math.random() * thoughtIds.length),
      }).map(() => ({
        reactionBody: faker.lorem.sentence(),
        username: userNames[Math.floor(Math.random() * userNames.length)],
      }));
      return Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: randomReactions } },
        { new: true }
      );
    })
  );
  console.log("created thoughts", newThoughts);
});
