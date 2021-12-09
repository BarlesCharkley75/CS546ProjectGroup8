const mongoCollections = require("../config/mongoCollections");
const hotels = mongoCollections.hotels;
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

module.exports = {
    async createComment(hotelId, userId, commentText)
    {
        if(!hotelId || !userId || !commentText || !rating) throw "All fields need to have valid values"
        if(!ObjectId.isValid(hotelId)) throw "Error: hotelId must be valid"
        if(!ObjectId.isValid(userId)) throw "Error: hotelId must be valid"
        if(typeof commentText != "string") throw "Error: commentText must be a string"
        if(hotelId.trim().length == 0 || userId.trim().length == 0 || commentText.trim().length == 0) throw "Error: All fields must not be empty strings"
        let hotel
        try {
            hotel = await hots.get(hotelId)
        } catch (e) {
            throw `Error: hotel with id ${hotelId} does not exist`
        }
        const hotelCollection = await hotels();
        const userCollection = await users();
        newComment = {
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
            rating: mean,
            images: hotel.images,
            reviews: hotel.reviews,
            comments: addComments
        }
        await userCollection.updateOne(
            { _id: ObjectID(userId) },
            { $addToSet: { CommentIds: id }  
        });
        hotId = ObjectId(hotelId)
        const insertComment = await hotelCollection.updateOne({_id: hotId}, {$set: voyage});
        if (insertComment.modifiedCount == 0) throw 'Error: Could not insert new Comment'
        const Commentedhotel = this.get(newComment._id.toString())
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
        let likedComment = {
            hotelId: hotelId,
            userId: userId,
            commentText: commentText,
            likes: likes + 1,
            dislikes: dislikes,
            userLikes: userLikes.append(username),
            userDislikes: userDislikes
        }
        const commentCollection = await comments();
        const addLike = await commentCollection.updateOne({ _id: parsedId },{ $set: likedComment });
        if (addLike.insertedCount === 0){
            throw "Error: Could not like comment"
        } else {
            return {likeComment: true}
        }
    },

    async dislikeComment(id, username){
        let parsedId = ObjectId(id);
        let dislikedComment = {
            hotelId: hotelId,
            userId: userId,
            commentText: commentText,
            likes: likes,
            dislikes: dislikes + 1,
            userLikes: userLikes,
            userDislikes: userDislikes.append(username)
        }
        const commentCollection = await comments();
        const addDisLike = await commentCollection.updateOne({ _id: parsedId },{ $set: dislikedComment });
        if (addDisLike.insertedCount === 0){
            throw "Error: Could not like comment"
        } else {
            return {dislikeComment: true}
        }
    }
};