const mongoCollections = require("../config/mongoCollections");
const hots = require('./hotels')
const Users = require('./users')
const reviews = mongoCollections.reviews;
const hotels = mongoCollections.hotels;
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectId
const { ObjectID } = require('bson');

module.exports = {
    async createReview(hotelId, userId, userName, reviewText, rating)
    {   userId = userId.toString();
        if(!hotelId || !userId || !reviewText || !rating || !userName) throw "All fields need to have valid values"
        if(!ObjectId.isValid(hotelId)) throw "Error: hotelId must be valid"
        if(!ObjectId.isValid(userId)) throw "Error: hotelId must be valid"
        if(typeof reviewText != "string") throw "Error: reviewer must be a string"
        if(typeof userName != "string") throw "Error: reviewer must be a string"
        if(typeof rating != 'number') throw "Error: rating must be an integer"
        if(rating < 1 || rating > 5) throw "Error: rating must be between 0 and 5"
        if(hotelId.trim().length == 0 || userId.trim().length == 0 ||reviewText.trim().length == 0 || userName.trim().length == 0) throw "Error: All fields must not be empty strings"
        let hotel
        try {
            hotel = await hots.getHotel(hotelId)
        } catch (e) {
            throw `Error: hotel with id ${hotelId} does not exist`
        }
        const hotelCollection = await hotels();
        const userCollection = await users();
        const reviewsCollection = await reviews();
        newReview = {
            _id: ObjectID(),
            hotelId: hotelId,
            userId: userId,
            userName: userName,
            reviewText: reviewText,
            rating: rating
        }
        const reviewCollect = await reviewsCollection.insertOne(newReview)
        if (reviewCollect.insertedCount === 0) throw 'Could not add review';
        const id = reviewCollect.insertedId.toString()
        addReviews = hotel.reviews;
        let user = await Users.getUser(userName);
        moreReviews = user.reviewIds;
        moreReviews.push(id);
        const updateUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            pfp: user.pfp,
            city: user.city,
            state: user.state,
            age: user.age,
            planToVisit: user.planToVisit,
            username: user.username,
            password: user.password,
            reviewIds: moreReviews,
            commentIds: user.commentIds
        }
        
        addReviews.push(newReview);
        let sum = 0
        let mean = 0
        for(i of addReviews){
            sum += i.rating
        }
        mean = sum/addReviews.length
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
            overallRating: mean,
            images: hotel.images,
            reviews: addReviews,
            comments: hotel.comments
        }


        await userCollection.updateOne({ _id: ObjectID(userId)},{$set: updateUser});
        hotId = ObjectId(hotelId)
        const insertReview = await hotelCollection.updateOne({_id: hotId}, {$set: voyage});
        if (insertReview.modifiedCount == 0) throw 'Error: Could not insert new review'
        const reviewedhotel = this.getReview(newReview._id.toString())
        return reviewedhotel;
    },

    async getAllHotelReviews(hotelId) {
        if (!hotelId) throw 'Error: hotelId must have valid input';
        if (typeof hotelId != "string" || hotelId.trim().length == 0) throw "Error: hotelId must be a non empty string";
        if(!ObjectId.isValid(hotelId)) throw "Error: hotelId must be a valid ObjectId";
        const hotelCollection = await hotels();
        let parsedId = ObjectId(hotelId)
        const hotel = await hotelCollection.findOne({_id: parsedId});
        if (hotel === null) throw 'Error: No hotel with that id';
        hotel.reviews = `${hotel.reviews}`
        return hotel.reviews;
      },

    async getReview(reviewId){
        if (!reviewId) throw "Error: reviewId must be valid";
        if (typeof reviewId != "string" || reviewId.trim().length == 0) throw "Error: reviewId must be a string and must not be empty";
        if(!reviewId || !ObjectId.isValid(reviewId)) throw "Error: must provide a valid reviewId to search for"
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({_id: ObjectId(reviewId)});
        return review;
    },

    async removeReview(reviewId){
        if(!reviewId) throw "Error: no reviewId provided"
        if (typeof reviewId != "string") throw "Error: reviewId must be a string"
        if(!reviewId || !ObjectId.isValid(reviewId)) throw "Error: must provide a valid reviewId to search for"
        const hotelCollection = await hotels();
        const userCollection = await users();
        const reviewCollection = await reviews();
        const hotArray = await hotelCollection.find({}).toArray()
        let reviewing = null;
        let reviewList = [];
        for (x of hotArray){
            for(y of x.reviews){
                if(y._id.toString() == reviewId.toString()){
                    reviewing = x;
                }
            }
        }
        if(reviewing == null) throw "Error: review with reviewId not found"
        for(i of reviewing.reviews){
            if (i._id != reviewId){
                reviewList.push(i)
            }
        }
        let nuSum = 0
        let nuMean = 0
        for(i of reviewList){
            nuSum += i.rating
        }
        if(reviewList.length == 0){
            nuMean = 0
        }else{
            nuMean = nuSum/reviewList.length
        }
        const rehotel = {
            name: reviewing.name,
            phoneNumber: reviewing.phoneNumber,
            website: reviewing.website,
            address: reviewing.address,
            city: reviewing.city,
            state: reviewing.state,
            zip: reviewing.zip,
            amenities: reviewing.amenities,
            nearbyAttractions: reviewing.nearbyAttractions,
            overallRating: nuMean,
            images: reviewing.images,
            reviews: reviewList,
            comments: reviewing.comments
        }
        const removedReview = await hotelCollection.updateOne({ _id: reviewing._id }, { $set: rehotel })
        if (removedReview.modifiedCount == 0) throw 'Error: review was not deleted successfully'
        const Review = await this.getReview(reviewId.toString());
        const User = await Users.getUser(Review.userName);
        const Rid = User.reviewIds;
        for(let i = 0; i < Rid.length; i++) {
            if(Rid[i] == reviewId.toString()) {
                Rid.splice(i, 1);
            }
        }
        const updateUser ={
            firstName: User.firstName,
            lastName: User.lastName,
            email: User.email,
            pfp: User.pfp,
            city: User.city,
            state: User.state,
            age: User.age,
            planToVisit: User.planToVisit,
            username: User.username,
            password: User.password,
            reviewIds: Rid,
            commentIds: User.commentIds
        }
        await userCollection.updateOne({ _id: ObjectID(User._id)},{$set: updateUser});
        let parsedId = ObjectId(reviewId)
        const deletionInfo = await reviewCollection.deleteOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) throw `Could not delete review with id of ${id}`;
        return {"deleted": true}
    }
}