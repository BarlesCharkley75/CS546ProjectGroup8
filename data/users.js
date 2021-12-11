const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

const bcrypt = require('bcrypt');
const { ObjectId } = require("bson");
const saltRounds = 16;

module.exports = {
    async createUser(firstName, lastName, email, pfp, city, state, age, planToVisit, username, password){
        if (!firstName || !lastName || !email || !city || !state | !age || !planToVisit || !username || !password) throw "Error: input required"
        if (typeof firstName != "string") throw "Error: firstName must be a valid string"
        if (typeof lastName != "string") throw "Error: lastName must be a valid string"
        if (typeof email != "string") throw "Error: email must be a valid string"
        if (typeof pfp != "string") throw "Error: pfp must be a valid string"
        if (typeof city != "string") throw "Error: city must be a valid string"
        if (typeof state != "string") throw "Error: state must be a valid string"
        if (typeof age != "number") throw "Error: age must be a valid number"
        if (typeof username != "string") throw "Error: username must be a valid string"
        if (typeof password != "string") throw "Error: password must be a valid string"
        if (firstName.trim().length == 0 || lastName.trim().length == 0 || email.trim().length == 0 || city.trim().length == 0 || state.trim().length == 0 || username.trim().length == 0 || password.trim().length == 0) throw "Error: inputs must not be only spaces"
        if (email.length < 8 || (email.slice(-4) != '.com' && email.slice(-4) != ".edu")) throw "Error: email must end in .com"
        if (!planToVisit || !Array.isArray(planToVisit)) throw "Error: planToVisit must be an array and only contain strings"
        for (let i = 0; i < planToVisit.length; i++)
            if (typeof planToVisit[i] !== "string" || planToVisit[i].trim().length == 0) throw "Error: planToVisit must be an array and only contain strings"
        if (username == 'admin') throw "Error: This username cannot be registered"
        if (username.length < 4 || password.length < 6) throw "Error: username or password is not strong enough"
        const userCollection = await users();
        let usergo = await userCollection.findOne({ username: username });
        if(usergo != null)throw 'username has existed'
        const hash = await bcrypt.hash(password, saltRounds);
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            pfp: pfp,
            city: city,
            state: state,
            age: age,
            planToVisit: planToVisit,
            username: username,
            password: hash,
            reviewIds: [],
            commentIds: []
        };
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Error: Could not add user';
        return {"userInserted": true}
    },
    
    async checkUser(username, password){
        if (!username || !password) throw "Error: input required"
        if (typeof username != "string") throw "Error: username must be a valid string"
        if (typeof password != "string") throw "Error: password must be a valid string"
        if (username.trim().length == 0 || password.trim().length == 0) throw "Error: inputs must not be only spaces"
        if (username.length < 4 || password.length < 6) throw "Error: username or password is not strong enough"
        const userCollection = await users();
        const user = await userCollection.findOne({username: username});
        let check = false;
        try{
            check = await bcrypt.compare(password, user.password)
        } catch(e){
            throw "Error: Cannot find user in database"
        }
        if (check == true){
            return {authenticated: true}
        } else {
            return {authenticated: false}
        }
    },

    async getUser(username){
        if (!username) throw "Error: input required"
        if (typeof username != "string") throw "Error: username must be a valid string"
        if (username.trim().length == 0) throw "Error: inputs must not be only spaces"
        if (username.length < 4) throw "Error: username or password is not strong enough"
        const userCollection = await users();
        const user = await userCollection.findOne({username: username});
        return user;
    },
    async get(id){
        if (!id) throw "Error: input required"
        if (typeof id != "string") throw "Error: username must be a valid string"
        if (id.trim().length == 0) throw "Error: inputs must not be only spaces"
        const userCollection = await users();
        const user = await userCollection.findOne({_id: ObjectId(id)});
        return user;
    },

    async planVisit(id, location) {
        if (!id) throw "You must provide an ID value";
        if (!location|| typeof location !== "string") throw "You must provide the name of the drink";
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });
        if (user === null) throw `No user with ID ${id}`;
        let p = user.planToVisit;
        p.push(location);
        let userTrip = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            pfp: user.pfp,
            city: user.city,
            state: user.state,
            age: user.age,
            planToVisit: p,
            username: user.username,
            password: user.password,
            reviewIds: user.reviewIds,
            commentIds: user.commentIds
        };
        const voyage = await userCollection.updateOne({ _id: id }, {$set: userTrip});
        if (voyage.modifiedCount === 0) throw `Could not add trip location to ${id}`;
    
        return {add: true};
    }
}