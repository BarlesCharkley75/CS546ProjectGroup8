const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users;
const hotel = data.hotels;
const xss = require('xss');

router.get('/', async (req, res) => {
    if(req.session.user == undefined || req.session.user.Username !='admin'){
        res.status(500).json({error: 'You can not access this page without the permission.'});
    }else{
        const allHotels = await hotel.getAll();
        res.render('partials/management', {title : 'Hotel Management',hotels: allHotels});
    }
      
  });
router.get('/hotel/:id', async (req, res) => {
    if (!req.params.id) throw 'You must specify an ID to delete';
    try {
      await hotel.get(xss(req.params.id));
    } catch (e) {
      res.status(404).json({ error: 'hotel not found' });
      return;
    }
    let pid = req.params.id;
    try {
      await hotel.remove(req.params.id);
      res.redirect('/management')
    } catch (e) {
      res.sendStatus(500);
    }
});
router.get('/addhotel', async (req, res) => {
    if(req.session.user == undefined || req.session.user.Username !='admin'){
        res.status(500).json({error: 'You can not access this page without the permission.'});
    }else{
        res.render('partials/addhotel', {title : 'Add Hotel'});
    }
});
router.get('/updatehotel/:id', async (req, res) => {
    if(req.session.user == undefined || req.session.user.Username != 'admin'){
        res.status(500).json({error: 'You can not access this page without the permission.'});
    }else{
        const thisHotel = await hotel.get(xss(req.params.id));
        res.render('partials/updatehotel', {title : 'Update Hotel', hotelname : thisHotel.name, _id : xss(req.params.id)});
    }
});

router.post('/addhotel', async (req, res) => {
    let hotelData = req.body;
    let name = hotelData.name;
    let phoneNumber = hotelData.phoneNumber;
    let website = hotelData.website;
    let address = hotelData.address;
    let city = hotelData.city;
    let state = hotelData.state;
    let zip = hotelData.zip;
    let amenities = hotelData.amenities;
    let nearbyAttractions = hotelData.nearbyAttractions;
    let images = hotelData.images;
    try{
      if(amenities.includes(",") == true){
        amenities = amenities.split(",")
      }else{
        amenities = [amenities]
      }
      if(nearbyAttractions.includes(",") == true){
        nearbyAttractions = nearbyAttractions.split(",")
      }else{
        nearbyAttractions = [nearbyAttractions]
      }
      const newHotel = await hotel.create(name, phoneNumber, website, address, city, state, zip, amenities, nearbyAttractions, images);
      if(newHotel['hotelInserted'] == true){
        res.redirect('/management');
      }else{
        res.status(500).json({error: 'Internal Server Error'});
      }
    }catch(e){
      res.status(400).render('partials/addhotel', {title : 'Add Hotel', error: e});
    }
  
  });

router.post('/updatehotel/:id', async (req, res) => {
    let hotelData = req.body;
    let name = hotelData.name;
    let phoneNumber = hotelData.phoneNumber;
    let website = hotelData.website;
    let address = hotelData.address;
    let city = hotelData.city;
    let state = hotelData.state;
    let zip = hotelData.zip;
    let amenities = hotelData.amenities;
    let nearbyAttractions = hotelData.nearbyAttractions;
    try{
      if(amenities.includes(",") == true){
        amenities = amenities.split(",")
      }else{
        amenities = [amenities]
      }
      if(nearbyAttractions.includes(",") == true){
        nearbyAttractions = nearbyAttractions.split(",")
      }else{
        nearbyAttractions = [nearbyAttractions]
      }
      const newHotel = await hotel.update(xss(req.params.id), name, phoneNumber, website, address, city, state, zip, amenities, nearbyAttractions);
      if(newHotel['updated'] == true){
        res.redirect('/management');
      }else{
        res.status(500).json({error: 'Internal Server Error'});
      }
    }catch(e){
      res.status(400).render('partials/updatehotel', {title : 'Update Hotel', error: e});
    }
  
});



module.exports = router;