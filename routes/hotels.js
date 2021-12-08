const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users;
const hotel = data.hotels;
const review = data.reviews;

router.get('/', function(req, res) {
    if(req.session.user){
        res.render('partials/hotel', {title : 'Hotels'});
    }else{
        res.redirect('/login');
    }
});

router.post('/', async (req, res) => {
    let searchData = req.body;
    let searchTerm = searchData.searchTerm;
    try{
          const hotels = await hotel.search(searchTerm);
          console.log(hotels);
          if(hotels){
            res.render('partials/hotel', {title : 'Hotels', hotels : hotels});
          }else{
            res.status(500).json({error: 'there is no search result'});
      
          }
        }catch(e){
          res.status(400).render('partials/hotel', {title : 'Search', error: e});
      }
  });

  router.get('/:id', async (req, res) => {
    if(req.session.user){
        try{
            const thisHotel = await hotel.get(req.params.id);
            res.render('partials/individual', {title : 'Hotel', name : thisHotel.name, phoneNumber : thisHotel.phoneNumber, website : thisHotel.website, address : thisHotel.address, city : thisHotel.city, state : thisHotel.state, zip : thisHotel.zip, amenities : thisHotel.amenities, nearbyAttractions : thisHotel.nearbyAttractions, images : thisHotel.images, overallRating : thisHotel.overallRating, reviews : thisHotel.reviews, comments : thisHotel.comments, id : req.params.id});
          }catch(e){
            res.status(400).render('partials/hotel', {title : 'Search', error: e});
        }
    }else{
        res.redirect('/login');
    }
});

router.post('/:id', async (req, res) => {
    let reviewData = req.body;
    if(req.body.addHotelName){  
        console.log(req.body.addHotelName);
        const userId = await user.getUser(req.session.user.Username);
        const plan = await user.planVisit(userId,req.body.addHotelName);
        res.redirect('/hotels/'+req.params.id);
    }else{

        let reviewTitle = reviewData.reviewTitle;
        let reviewContent = reviewData.reviewContent;
        let rating = reviewData.rating;

        if(req.session.user){
            try{
                rating = parseInt(rating);
                const addReview = await review.create(req.params.id, reviewTitle, req.session.user.Username, rating, reviewContent);
                if(addReview){
                    res.redirect('/hotels/'+req.params.id);
                }else{
                    res.status(500).json({error: 'Internal Server Error'});
                }
             }catch(e){
                res.status(400).render('partials/hotel', {title : 'Search', error: e});
            }
        }else{
        res.redirect('/login');
        }
    }
    
});

module.exports = router;