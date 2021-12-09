const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users;
const hotel = data.hotels;
const review = data.reviews;
const xss = require('xss');

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
          const hotels = await hotel.searchHotel(searchTerm);
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
            const thisHotel = await hotel.getHotel(xss(req.params.id));
            res.render('partials/individual', {title : 'Hotel', name : thisHotel.name, phoneNumber : thisHotel.phoneNumber, website : thisHotel.website, address : thisHotel.address, city : thisHotel.city, state : thisHotel.state, zip : thisHotel.zip, amenities : thisHotel.amenities, nearbyAttractions : thisHotel.nearbyAttractions, images : thisHotel.images, overallRating : thisHotel.overallRating, reviews : thisHotel.reviews, comments : thisHotel.comments, id : xss(req.params.id)});
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
        const User = await user.getUser(xss(req.session.user.Username));
        let p = User.planToVisit;
        let flag = true;
        for(let x in p){
            if(p[x]==req.body.addHotelName){
                flag = false;
            }
        }
        if(flag ==false) throw "This place has been added to your plan."
        const plan = await user.planVisit(User._id,xss(req.body.addHotelName));
        res.redirect('/profile');
    }else{

        let reviewContent = reviewData.reviewContent;
        let rating = reviewData.rating;

        if(req.session.user){
            try{
                rating = parseInt(rating);
                const User = await user.getUser(xss(req.session.user.Username));
                const addReview = await review.createReview(xss(req.params.id), User._id, xss(req.session.user.Username), reviewContent, rating);
                if(addReview){
                    res.redirect('/hotels/'+xss(req.params.id));
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