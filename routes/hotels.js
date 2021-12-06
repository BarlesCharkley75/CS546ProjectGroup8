const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    if(req.session.user){
        res.render('partials/hotel');
    }else{
        res.redirect('/login', {});
    }
});

router.get('/manage', function(req, res) {
    if(req.session.user){
        res.render('partials/management');
    }else{
        res.redirect('/login', {});
    }
});

module.exports = router;