const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users;
const hotel = data.hotels;

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


module.exports = router;