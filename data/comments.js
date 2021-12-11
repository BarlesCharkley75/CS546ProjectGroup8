const mongoCollections = require("../config/mongoCollections");
const hotels = mongoCollections.hotels;
const hots = require('./hotels')
const Users = require('./users')
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const comments = mongoCollections.comments;
const ObjectId = require('mongodb').ObjectId
const { ObjectID } = require('bson');

module.exports = {
    async createComment(hotelId, userId, commentText)
    {
        if(!hotelId || !userId || !commentText) throw "All fields need to have valid values"
        if(!ObjectId.isValid(hotelId)) throw "Error: hotelId must be valid"
        if(!ObjectId.isValid(userId)) throw "Error: hotelId must be valid"
        if(typeof commentText != "string") throw "Error: commentText must be a string"
        if(hotelId.trim().length == 0 || userId.trim().length == 0 || commentText.trim().length == 0) throw "Error: All fields must not be empty strings"
        let hotel
        try {
            hotel = await hots.getHotel(hotelId)
        } catch (e) {
            throw `Error: hotel with id ${hotelId} does not exist`
        }

        let user = await Users.get(userId);
       
        const hotelCollection = await hotels();
        const userCollection = await users();
        const commentCollection = await comments();
        let newComment = {
            _id: ObjectID(),
            hotelId: hotelId,
            userId: userId,
            commentText: commentText,
            likes: 0,
            dislikes: 0,
            userLikes: [],
            userDislikes: []
        }
        const commentCollect = await commentCollection.insertOne(newComment)
        if (commentCollect.insertedCount === 0) throw 'Could not add Comment';
        const id = commentCollect.insertedId.toString()
        addComments = hotel.comments
        moreComments = user.commentIds
        addComments.push(newComment)
        const voyage = {
            name: hotel.name,
            phoneNumber: hotel.phoneNumber,
            website: hotel.website,
            address: hotel.address,
            city: hotel.city,
            state: hotel.state,
            zip: hotel.zip,
            amenities: hotel.amenities,
            nearbyAttractions: hotel.nearbyAttractions,
            overallRating: hotel.overallRating,
            images: hotel.images,
            reviews: hotel.reviews,
            comments: addComments
        }
        await userCollection.updateOne(
            { _id: ObjectID(userId) },
            { $addToSet: { commentIds: id }  
        });
        hotId = ObjectId(hotelId)
        const insertComment = await hotelCollection.updateOne({_id: hotId}, {$set: voyage});
        if (insertComment.modifiedCount == 0) throw 'Error: Could not insert new Comment'
        const Commentedhotel = this.getComment(newComment._id.toString())
        return Commentedhotel;
    },

    async getComment(id){
        const commentCollection = await comments()
        let parsedId = ObjectId(id);
        const comment = await commentCollection.findOne({_id: parsedId})
        if (comment === null) throw "Error: Could not find comment"
        return comment
      },

    async likeComment(id, username){
        let parsedId = ObjectId(id);
        let thisComment = await this.getComment(id);
        let arr = thisComment.userLikes;
        let hotel
        try {
            hotel = await hots.getHotel(thisComment.hotelId)
        } catch (e) {
            throw `Error: hotel with id ${thisComment.hotelId} does not exist`
        }
        for(let x in arr){
            if(arr[x] == username) throw "Error: You have already click this button"
        }
        arr.push(username);
        let likedComment = {
            hotelId: thisComment.hotelId,
            userId: thisComment.userId,
            commentText: thisComment.commentText,
            likes: thisComment.likes + 1,
            dislikes: thisComment.dislikes,
            userLikes: arr,
            userDislikes: thisComment.userDislikes
        }
        const commentCollection = await comments();
        const hotelCollection = await hotels();
        const addLike = await commentCollection.updateOne({ _id: parsedId },{ $set: likedComment });

        let originalComment = hotel.comments
        let nowComment = [];
        for(let x in originalComment){
            if (originalComment[x]._id.toString() != thisComment._id.toString()){
                nowComment.push(originalComment[x]);
            }
        }
        let newComment = await this.getComment(id);
        nowComment.push(newComment);
        const voyage = {
            name: hotel.name,
            phoneNumber: hotel.phoneNumber,
            website: hotel.website,
            address: hotel.address,
            city: hotel.city,
            state: hotel.state,
            zip: hotel.zip,
            amenities: hotel.amenities,
            nearbyAttractions: hotel.nearbyAttractions,
            overallRating: hotel.overallRating,
            images: hotel.images,
            reviews: hotel.reviews,
            comments: nowComment
        }
        const insertComment = await hotelCollection.updateOne({_id: ObjectId(hotel._id)}, {$set: voyage});
        if (insertComment.modifiedCount == 0) throw 'Error: Could not insert new Comment'
        return {update: true}
 
    },

    async dislikeComment(id, username){
        let parsedId = ObjectId(id);
        let thisComment = await this.getComment(id);
        let arr = thisComment.userDislikes;
        let hotel
        try {
            hotel = await hots.getHotel(thisComment.hotelId)
        } catch (e) {
            throw `Error: hotel with id ${thisComment.hotelId} does not exist`
        }
        for(let x in arr){
            if(arr[x] == username) throw "Error: You have already click this button"
        }
        arr.push(username);
        let dislikedComment = {
            hotelId: thisComment.hotelId,
            userId: thisComment.userId,
            commentText: thisComment.commentText,
            likes: thisComment.likes,
            dislikes: thisComment.dislikes + 1,
            userLikes: thisComment.userLikes,
            userDislikes: arr
        }
        const commentCollection = await comments();
        const hotelCollection = await hotels();
        const addDisLike = await commentCollection.updateOne({ _id: parsedId },{ $set: dislikedComment });

        let originalComment = hotel.comments
        console.log(originalComment);
        console.log(thisComment);
        let nowComment = [];
        for(let x in originalComment){
            if (originalComment[x]._id.toString() != thisComment._id.toString()){
                nowComment.push(originalComment[x]);
            }
        }
        console.log(nowComment);
        let newComment = await this.getComment(id);
        nowComment.push(newComment);

        const voyage = {
            name: hotel.name,
            phoneNumber: hotel.phoneNumber,
            website: hotel.website,
            address: hotel.address,
            city: hotel.city,
            state: hotel.state,
            zip: hotel.zip,
            amenities: hotel.amenities,
            nearbyAttractions: hotel.nearbyAttractions,
            overallRating: hotel.overallRating,
            images: hotel.images,
            reviews: hotel.reviews,
            comments: nowComment
        }
        const insertComment = await hotelCollection.updateOne({_id: ObjectId(hotel._id)}, {$set: voyage});
        if (insertComment.modifiedCount == 0) throw 'Error: Could not insert new Comment'
        
        return {update: true}
        
    }
};