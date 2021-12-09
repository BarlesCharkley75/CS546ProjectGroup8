const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users;
const hotel = data.hotels;
const review = data.reviews;
const xss = require('xss');

router.get('/home', async (req, res) => {
  if(req.session.user){
    const allHotels = await hotel.getAllHotels();
    res.render('partials/landing',{title : 'Home Page', hotels : allHotels});
  }else{
    res.redirect('/login');
  }
    
});
router.get('/', async (req, res) => {
  if(req.session.user){
    res.render('partials/landing',{title : 'Home Page'});
  }else{
    res.redirect('/login');
  }
    
});
router.get('/login', async (req, res) => {
  if(req.session.user){
    res.render('partials/landing');
  }else{
    res.render('partials/login', {title : 'Login'});
  }
});

router.get('/signup', async (req, res) => {
  if(req.session.user){
      res.redirect('/profile');
  }else{
      res.render('partials/register', {title : 'Sign Up'});
  }
      
});

router.post('/signup', async (req, res) => {
  let userData = req.body;
  let username = userData.username;
  let password = userData.password;
  let firstName = userData.firstName;
  let lastName = userData.lastName;
  let email = userData.email;
  let pfp = userData.pfp;
  let city = userData.city;
  let state = userData.state;
  let age = userData.age;
  let planToVisit = userData.planToVisit;
  try{
    if(planToVisit.includes(",") == true){
        planToVisit = planToVisit.split(",")
    }else{
        planToVisit = [planToVisit]
    }
    username = username.toLowerCase();
    age = parseInt(age)
    const newUser = await user.createUser(firstName, lastName, email, pfp, city, state, age, planToVisit, username, password);
    if(newUser['userInserted'] == true){
      res.render('partials/login', {title : 'Login'});
    }else{
      res.status(500).json({error: 'Internal Server Error'});
    }
  }catch(e){
    res.status(400).render('partials/register', {title : 'Register', error: e});
  }

});

router.post('/login', async (req, res) => {
  let userData = req.body;
  let username = userData.username;
  let password = userData.password;
  if(username == 'admin' && password == 'admin'){
    req.session.user = {Username: username};
    res.redirect('/management');
  }else{
    try{
        username = username.toLowerCase();
        const newUser = await user.checkUser(username,password);
        if(newUser['authenticated'] == true){
          req.session.user = {Username: username};
          res.redirect('/home');
        }else{
          res.status(500).json({error: 'Internal Server Error'});
    
        }
      }catch(e){
        res.status(400).render('partials/login', {title : 'Login', error: e});
    }

  }
  
     
});

router.get('/profile', async (req, res) => {
  if(req.session.user){
    const User = await user.getUser(req.session.user.Username);
    let reviewIds = User.reviewIds;
    let rList = [];
    for(let x in reviewIds){
      let Review = await review.getReview(reviewIds[x]);
      let Hotel = await hotel.getHotel(Review.hotelId);
      Review['hotelName'] = Hotel.name;
      rList.push(Review);
    }
    for(let x in rList){
      rList[x]._id = rList[x]._id.toString();
    }
    
    res.render('partials/profile', {title : 'Profile', name : req.session.user.Username, email : User.email, php : User.php, city : User.city, state : User.state, age : User.age, planToVisit : User.planToVisit, reviews : rList});
  }else{
    res.render('partials/login', {title : 'Login'});
  }
    
});

router.get('/profile/:id', async (req, res) => {
  if(req.session.user){
  try {
    await review.removeReview(req.params.id.toString());
    res.redirect('/profile');
  } catch (e) {
    res.sendStatus(500);
  }
}else{
  res.redirect('/login');
}
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/login')
});



module.exports = router;