const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const express = require('express')
const router = express.Router()
const registeredUsers = data.users;
const hotels = data.hotels;
const reviews = data.reviews;
const comments = data.comments;

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  const user1 = await registeredUsers.createUser(
    "David",
    "Smith",
    "davsmi@gmail.com",
    "pfp",
    "Hoboken",
    "NJ",
    25,
    ["Miami"],
    "davsmith001",
    "pass12345"
  );
  console.log(user1);
  let user2 = await registeredUsers.createUser(
    "Mark",
    "Jones",
    "marjon@gmail.com",
    "pfp",
    "Austin",
    "Texas",
    34,
    ["Seattle"],
    "marjon002",
    "pass12345"
  );
  console.log(user2);
  let user3 = await registeredUsers.createUser(
    "Brian",
    "Johnson",
    "brijoh@gmail.com",
    "pfp",
    "San Diego",
    "CA",
    27,
    ["Las Vegas", "Orlando"],
    "brijoh003",
    "pass12345"
  );
  console.log(user3);

  const hotel1 = await hotels.createHotel(
    "Brian",
    "222-222-2222",
    "http://www.brianhotel.com",
    "729 Street",
    "San Diego",
    "CA",
    "11010",
    ["Food", "Water"],
    ["Water Park"],
    "hotel_five.jpg"
  );
  console.log(hotel1);

  let review1 = await reviews.createReview(
    hotel1._id.toString(),
    user1._id.toString(),
    "wow look at this review",
    5
  );
  console.log(review1);

  let comment1 = await comments.createComment(
    hotel1._id.toString(),
    user1._id.toString(),
    "wow look at this comment"
  );
  console.log(comment1);
  await db.serverConfig.close();
};

main().catch(console.log("This is working!"));
