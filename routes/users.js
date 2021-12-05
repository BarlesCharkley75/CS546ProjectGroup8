const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const user = data.users;


router.get('/', async (req, res) => {
  if(req.session.user){
    res.redirect('/profile');
  }else{
    res.redirect('/login');
  }
    
});
router.get('/login', async (req, res) => {
  if(req.session.user){
    res.redirect('/profile');
  }else{
    res.sendFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('/')), '/static/landing.html'));
  }
});

router.get('/signup', async (req, res) => {
  if(req.session.user){
      res.redirect('/profile');
  }else{
      res.render('users/register', {});
  }
      
});

router.post('/signup', async (req, res) => {
  let userData = req.body;
  try{
    username = username.toLowerCase();
    const newUser = await user.createUser(username,password);
    if(newUser['userInserted'] == true){
      res.render('users/login', {});
    }else{
      res.status(500).json({error: 'Internal Server Error'});

    }
  }catch(e){
    res.status(400).render('users/register', {error: e});
  }

});

router.post('/login', async (req, res) => {
  let userData = req.body;
  try{
    username = username.toLowerCase();
    const newUser = await user.checkUser(username,userData.password);
    if(newUser['authenticated'] == true){
      req.session.user = {Username: username};
      res.redirect('/private');
    }else{
      res.status(500).json({error: 'Internal Server Error'});

    }
  }catch(e){
    res.status(400).render('users/login', {error: e});
  }
     
});

router.get('/private', async (req, res) => {
  if(req.session.user){
    res.render('users/private', {username: req.session.user.Username});
  }else{
    res.render('users/login', {});
  }
    
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.render('users/logout', {});
});


module.exports = router;