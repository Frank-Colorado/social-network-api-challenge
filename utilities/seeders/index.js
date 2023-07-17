const db = require("../../config/connection");
const { User, Thought } = require("../../models");
const { faker } = require("@faker-js/faker");

db.on("error", (err) => err);

// This is a function that will seed the database with random data when we call npm run seed
db.once("open", async () => {
  console.log("connected to database");

  // Delete any existing Users
  await User.deleteMany({});
  console.log("deleted users");
  // Delete any existing Thoughts
  await Thought.deleteMany({});
  console.log("deleted thoughts");

  // An array of 10 objects is created using the Array.from method
  // The array is stored in a variable called "userData"
  const userData = Array.from({ length: 10 }).map(() => ({
    // Each object will have a username and email that is generated using faker
    username: faker.internet.userName(),
    email: faker.internet.email(),
  }));

  // The "userData" array is inserted into the User collection
  await User.collection.insertMany(userData);

  // We grab all the users that were just created from the database using the find method
  // All the users are stored in a variable called "allUsers"
  const allUsers = await User.find({});

  // For every user in the "allUsers" array we will grab their ID and push it into an array
  // This array of IDs will be stored in a variable called "userIds"
  const userIds = allUsers.map((user) => user._id);

  // For each ID in the "userIds" array we will update that user's friends array with a random amount of friends
  const addFriends = await Promise.all(
    // We map through the "userIds" array
    userIds.map((userId) => {
      // We use the faker.helpers.arrayElements method
      // This will create a new random array from the "userIds" array we give it with a random amount of elements between our specified min and max
      const randomFriends = faker.helpers.arrayElements(userIds, {
        min: 2,
        max: userIds.length,
      });
      // We then find the user by their ID and update their friends array wih the randomFriends array we just created
      return User.findByIdAndUpdate(
        userId,
        { $push: { friends: randomFriends } },
        { new: true }
      );
    })
  );
  console.log(addFriends);

  // We then create a new array of all the usernames from the "allUsers" array
  // This will be used for creating Thoughts since each username needs to be associated with a User in the database
  const userNames = allUsers.map((user) => user.username);

  // An array of 20 objects is created using the Array.from method
  // The array is stored in a variable called "thoughtData"
  const thoughtData = Array.from({ length: 20 }).map(() => ({
    // Each object will have a thoughtText and username that is generated using faker
    thoughtText: faker.lorem.sentence(),
    // The username will be a random username from the "userNames" array we created earlier
    username: userNames[Math.floor(Math.random() * userNames.length)],
  }));

  // The "thoughtData" array is inserted into the Thought collection
  await Thought.collection.insertMany(thoughtData);

  // We grab all the thoughts that were just created from the database using the find method
  // All the thoughts are stored in a variable called "allThoughts"
  const allThoughts = await Thought.find({});

  // Since our post hook in the Thought schema doesn't work with bulk creates
  // We have to push each Thought's ID into the User's thoughts array manually
  // We use the Promise.all method to wait for all the updates to finish
  const newUsers = await Promise.all(
    // We map through the "allThoughts" array
    allThoughts.map((thought) => {
      // For each thought we find the user by their username and update their thoughts array with the thought's ID
      return User.findOneAndUpdate(
        { username: thought.username },
        { $push: { thoughtsId: thought._id } }
      );
    })
  );

  // We grab all the IDs from the "allThoughts" array and store them in a variable called "thoughtIds"
  const thoughtIds = allThoughts.map((thought) => thought._id);

  // We create a random amount of reactions for each thought
  // We use the Promise.all method to wait for all the updates to finish
  const newThoughts = await Promise.all(
    // We map through the "thoughtIds" array
    thoughtIds.map((thoughtId) => {
      // For each thought we create a random array of objects using the Array.from method with a random length
      randomReactions = Array.from({
        length: Math.floor(Math.random() * thoughtIds.length),
      }).map(() => ({
        // The created array will be filled with objects that have a reactionBody and username
        reactionBody: faker.lorem.sentence(),
        // The username will be a random username from the "userNames" array we created earlier
        username: userNames[Math.floor(Math.random() * userNames.length)],
      }));
      // We then find the thought by its ID and update its reactions array with the randomReactions array we just created
      return Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: randomReactions } },
        { new: true }
      );
    })
  );
  // Both the User and Thought collections are seeded with random data and are properly associated with each other as if it were a real database
  console.log("created users", newUsers);
  console.log("created thoughts", newThoughts);
});
