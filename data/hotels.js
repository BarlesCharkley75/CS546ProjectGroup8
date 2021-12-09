const mongoCollections = require("../config/mongoCollections");
const hotels = mongoCollections.hotels;
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectId
const { ObjectID } = require('bson');


function numCheck(x) {
  return /^-?\d+$/.test(x);
}

module.exports = {
    async createHotel(name, phoneNumber, website, address, city, state, zip, amenities, nearbyAttractions, images){
        if (!name || !phoneNumber || !website || !address || !city || !state || !zip || !amenities || !nearbyAttractions || !images) throw "Error: All fields need to have valid values"   
        if (typeof name != "string") throw "Error: name must be a string"
        if (typeof phoneNumber != "string") throw "Error: phoneNumber must be a string"
        if (typeof website != "string") throw "Error: website type must be a string"
        if (typeof address != "string") throw "Error: address type must be a string"
        if (typeof city != "string") throw "Error: city type must be a string"
        if (typeof state != "string") throw "Error: state type must be a string"
        if (typeof zip != "string") throw "Error: zip type must be a string"
        if (typeof images != "string") throw "Error: images must be a string"
        if (name.trim().length == 0 || phoneNumber.trim().length == 0 || website.trim().length == 0 || address.trim().length == 0 || city.trim().length == 0 || state.trim().length == 0 || zip.trim().length == 0|| images.trim().length == 0) throw "Error: All fields must not be empty strings"
        let re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        if (phoneNumber.match(re) == null) {
          throw "Error: The phone number is not of valid format: XXX-XXX-XXXX";
        }
        if (website.length < 20 || website[0] != 'h' || website[1] != 't' || website[2] != 't' || website[3] != 'p' || website[4] != ':' || website[5] != '/' || website[6] != '/' || website[7] != 'w' || website[8] != 'w' || website[9] != 'w' || website[10] != '.' || website.slice(-4) != '.com') throw "Error: website must be in 'http://www.xxxxx.com' format"
        if (state.length != 2 || numCheck(state[0]) == true || numCheck(state[1]) == true) throw "Error: state must be a 2 letter string"
        if (zip.length != 5 || numCheck(zip[0]) == false || numCheck(zip[1]) == false || numCheck(zip[2]) == false || numCheck(zip[3]) == false || numCheck(zip[4]) == false) throw "Error: zip code must be a 5 number string"
        if (!amenities || !Array.isArray(amenities)) throw "Error: amenities must be an array and only contain strings"
        for (let i = 0; i < amenities.length; i++)
            if (typeof amenities[i] !== "string" || amenities[i].trim().length == 0) throw "Error: amenities must be an array and only contain strings"
        if (!nearbyAttractions || !Array.isArray(nearbyAttractions)) throw "Error: nearbyAttractions must be an array and only contain strings"
        for (let j = 0; j < nearbyAttractions.length; j++)
            if (typeof nearbyAttractions[j] !== "string" || nearbyAttractions[j].trim().length == 0) throw "Error: nearbyAttractions must be an array and only contain strings"
        const hotelCollection = await hotels();
        let newhotel = {
            name: name,
            phoneNumber: phoneNumber,
            website: website,
            address: address,
            city: city,
            state: state,
            zip: zip,
            amenities: amenities,
            nearbyAttractions: nearbyAttractions,
            overallRating: 0,
            images: images,
            reviews: [],
            comments: []
        };
        
        const insertInfo = await hotelCollection.insertOne(newhotel);
        if (insertInfo.insertedCount === 0) throw 'Error: Could not add hotel';
        return {"hotelInserted": true}
    },

    async getAllHotels() {
      const hotelCollection = await hotels();
  
      const hotelList = await hotelCollection.find({}).toArray();
  
      for (x of hotelList){
        x._id = x._id.toString()
      }

      return hotelList;
    },

    async getHotel(id) {
      if (!id) throw 'Error: id must have valid input';
      if (typeof id != "string" || id.trim().length == 0) throw "Error: id must be a non empty string";
      if(!ObjectId.isValid(id)) throw "Error: id must be a valid ObjectId";
      const hotelCollection = await hotels();
      let parsedId = ObjectId(id)
      const hot = await hotelCollection.findOne({_id: parsedId});
      if (hot === null) throw 'Error: No hotel with that id';
      hot._id= hot._id.toString()
  
      return hot;
    },

    async removeHotel(id) {
      if (!id) throw 'Error: id must have valid input';
      if (typeof id != "string" || id.trim().length == 0) throw "Error: id must be a non empty string";
      if(!ObjectId.isValid(id)) throw "Error: id must be a valid ObjectId";
      const hotelCollection = await hotels();
      let parsedId = ObjectId(id)
      const deletionInfo = await hotelCollection.deleteOne({ _id: parsedId });
      if (deletionInfo.deletedCount === 0) throw `Could not delete hotel with id of ${id}`;
      return {"hotelId": id, "deleted": true}
    },
    
    async searchHotel(searchTerm) {
      if (typeof searchTerm != "string" || searchTerm.trim().length == 0) throw "Error: searchTerm must be a non empty string";
      let reg = new RegExp(searchTerm);
      let _filter = {
        $or: [
            {'name': {$regex: reg, $options: 'i'}},
            {'address': {$regex: reg, $options: 'i'}},
        ]
    }
      const hotelCollection = await hotels();
   
      const Hotels = await hotelCollection.find(_filter).toArray();
      if (Hotels === null) throw 'Error: No search result';
      for(let x in Hotels){
        Hotels[x]._id = Hotels[x]._id.toString();
      }
      return Hotels
    },
    
    async updateHotel(id, name, phoneNumber, website, address, city, state, zip, amenities, nearbyAttractions){
        if (!name || !phoneNumber || !website || !address || !city || !state || !zip || !amenities || !nearbyAttractions) throw "Error: All fields need to have valid values"   
        if (typeof name != "string") throw "Error: name must be a string"
        if (typeof phoneNumber != "string") throw "Error: phoneNumber must be a string"
        if (typeof website != "string") throw "Error: website type must be a string"
        if (typeof address != "string") throw "Error: address type must be a string"
        if (typeof city != "string") throw "Error: city type must be a string"
        if (typeof state != "string") throw "Error: state type must be a string"
        if (typeof zip != "string") throw "Error: zip type must be a string"
        if (name.trim().length == 0 || phoneNumber.trim().length == 0 || website.trim().length == 0 || address.trim().length == 0 || city.trim().length == 0 || state.trim().length == 0 || zip.trim().length == 0) throw "Error: All fields must not be empty strings"
        if (phoneNumber.length != 12 || numCheck(phoneNumber[0]) == false || numCheck(phoneNumber[1]) == false || numCheck(phoneNumber[2]) == false || phoneNumber[3] != '-' || numCheck(phoneNumber[4]) == false || numCheck(phoneNumber[5]) == false || numCheck(phoneNumber[6]) == false || phoneNumber[7] != '-' || numCheck(phoneNumber[8]) == false || numCheck(phoneNumber[9]) == false || numCheck(phoneNumber[10]) == false || numCheck(phoneNumber[11]) == false) throw "Error: phoneNumber not in 'xxx-xxx-xxxx' format"
        if (website.length < 20 || website[0] != 'h' || website[1] != 't' || website[2] != 't' || website[3] != 'p' || website[4] != ':' || website[5] != '/' || website[6] != '/' || website[7] != 'w' || website[8] != 'w' || website[9] != 'w' || website[10] != '.' || website.slice(-4) != '.com') throw "Error: website must be in 'http://www.xxxxx.com' format"
        if (state.length != 2 || numCheck(state[0]) == true || numCheck(state[1]) == true) throw "Error: state must be a 2 letter string"
        if (zip.length != 5 || numCheck(zip[0]) == false || numCheck(zip[1]) == false || numCheck(zip[2]) == false || numCheck(zip[3]) == false || numCheck(zip[4]) == false) throw "Error: zip code must be a 5 number string"
        if (!amenities || !Array.isArray(amenities)) throw "Error: amenities must be an array and only contain strings"
        for (let i = 0; i < amenities.length; i++)
            if (typeof amenities[i] !== "string" || amenities[i].trim().length == 0) throw "Error: amenities must be an array and only contain strings"
        if (!nearbyAttractions || !Array.isArray(nearbyAttractions)) throw "Error: nearbyAttractions must be an array and only contain strings"
        for (let j = 0; j < nearbyAttractions.length; j++)
            if (typeof nearbyAttractions[j] !== "string" || nearbyAttractions[j].trim().length == 0) throw "Error: nearbyAttractions must be an array and only contain strings"
        const hotelCollection = await hotels();
        const newhotel={
            name: name,
            phoneNumber: phoneNumber,
            website: website,
            address: address,
            city: city,
            state: state,
            zip: zip,
            amenities: amenities,
            nearbyAttractions: nearbyAttractions
        };
        let parsedId = ObjectId(id);
        const updatedInfo = await hotelCollection.updateOne({ _id: parsedId }, {$set: newhotel});
        if (updatedInfo.modifiedCount === 0) throw "Error: could not properly update hotel";
        return {"hotelId": id, "updated": true}
    }
}
