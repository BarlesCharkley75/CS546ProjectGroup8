const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const { createUser } = require("../data/traders");
const registeredUsers = data.users;

const main = async () => {
  const db = await dbConnection;
  await db.dropDatabase();

  let user1 = await registeredUsers.createUser(
    "David",
    "Smith",
    "davsmi@gmail.com",
    "pfp",
    "Hoboken",
    "NJ",
    25,
    ["Miami"],
    davsmith001,
    pass12345
  );
  let user2 = await registeredUsers.createUser(
    "Mark",
    "Jones",
    "marjon@gmail.com",
    "pfp",
    "Austin",
    "Texas",
    34,
    ["Seattle"],
    marjon002,
    pass12345
  );
  let user3 = await registeredUsers.createUser(
    "Brian",
    "Johnson",
    "brijoh@gmail.com",
    "pfp",
    "San Diego",
    "CA",
    27,
    ["Las Vegas", "Orlando"],
    brijoh003,
    pass12345
  );

  await db.serverConfig.close();
};

main().catch(console.log("This is working!"));
