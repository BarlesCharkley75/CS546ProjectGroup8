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

  let user4 = await registeredUsers.createUser(
    "Jerry",
    "Seinfeld",
    "jseinfeld@gmail.com",
    "pfp",
    "New York City",
    "NY",
    63,
    ["New York City", "California"],
    "jseinfe4",
    "pass12345"
  );
  console.log(user4);

  let user5 = await registeredUsers.createUser(
    "George",
    "Costanza",
    "gcostanz@gmail.com",
    "pfp",
    "New York City",
    "NY",
    45,
    ["New York City", "Disney World"],
    "gcostanz8",
    "pass12345"
  );
  console.log(user5);

  let user6 = await registeredUsers.createUser(
    "Elaine",
    "Benes",
    "ebenes@gmail.com",
    "pfp",
    "New York City",
    "NY",
    45,
    ["New York City", "Hershey"],
    "ebenes36",
    "pass12345"
  );
  console.log(user6);

  let user7 = await registeredUsers.createUser(
    "Cosmo",
    "Kramer",
    "ckramer@gmail.com",
    "pfp",
    "New York City",
    "NY",
    45,
    ["New York City", "Bass Pro Shop"],
    "ckramer77",
    "pass12345"
  );
  console.log(user7);

  let user8 = await registeredUsers.createUser(
    "Wayne",
    "Knight",
    "wknight@gmail.com",
    "pfp",
    "New York City",
    "NY",
    45,
    ["New York City", "France"],
    "wknight137",
    "pass12345"
  );
  console.log(user8);

  const hotel1 = await hotels.createHotel(
    "Marriot",
    "222-222-2222",
    "http://www.marriothotel.com",
    "729 Street",
    "Hoboken",
    "NJ",
    "07030",
    ["Food", "Water"],
    ["Water Park"],
    "../public/images/hotel_one.jpg"
  );
  console.log(hotel1);

  const hotel2 = await hotels.createHotel(
    "Four Seasons",
    "444-234-2552",
    "http://www.fourseasonshotel.com",
    "Sesame Street",
    "Hoboken",
    "NJ",
    "07030",
    ["Buffet", "Water"],
    ["Pool", "McDonalds"],
    "../public/images/hotel_two.jpg"
  );
  console.log(hotel2);

  const hotel3 = await hotels.createHotel(
    "Elite Lodge",
    "893-232-5475",
    "http://www.elitelodge.com",
    "100 John Street",
    "Hoboken",
    "NJ",
    "07030",
    ["Master Chef", "Massage"],
    ["Water Park", "Hibachi"],
    "../public/images/hotel_three.jpg"
  );
  console.log(hotel3);

  const hotel4 = await hotels.createHotel(
    "Sunset Springs",
    "420-443-3432",
    "http://www.sunsetsprings.com",
    "800 Sunset Blvd",
    "Hoboken",
    "NJ",
    "07030",
    ["First Class", "Beach"],
    ["Yacht Club"],
    "../public/images/hotel_four.jpg"
  );
  console.log(hotel4);

  const hotel5 = await hotels.createHotel(
    "Big Hotel",
    "123-323-5458",
    "http://www.bighotel.com",
    "1000 Tony Lane",
    "Hoboken",
    "NJ",
    "07030",
    ["Pizza Parlor"],
    ["Poker Club"],
    "../public/images/hotel_five.jpg"
  );
  console.log(hotel5);


  await db.serverConfig.close();
};

main().catch(console.log("This is working!"));
