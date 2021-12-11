const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users;
const hotel = data.hotels;
const comment = data.comments;
const xss = require('xss');

router.get('/:id', async (req, res) => {
    if(req.session.user){
        const thisHotel = await hotel.getHotel(xss(req.params.id));
        res.render('partials/comments', {title : 'Comments', hotelId : xss(req.params.id), comments : thisHotel.comments});
    }else{
        res.redirect('/login');
    }
});

router.post('/:id', async (req, res) => {
    if(req.session.user){
        let commentData = req.body;
        if(req.body.likeOrDislike){  
            try{
                if(req.body.likeOrDislike == 'like'){
                    const likeComment = await comment.likeComment(xss(req.body.commentId), xss(req.session.user.Username));
                }else if(req.body.likeOrDislike == 'dislike'){
                    const dislikeComment = await comment.dislikeComment(xss(req.body.commentId), xss(req.session.user.Username));
                }
                const thisHotel = await hotel.getHotel(xss(req.params.id));
                res.render('partials/comments', {title : 'Comments', hotelId : xss(req.params.id), comments : thisHotel.comments});
            }catch(e){
                res.status(400).render('partials/comments', {title : 'Comments', error: e});
            }
        }else{
            let commentText = commentData.commentText;
            try{
                const User = await user.getUser(xss(req.session.user.Username));
                const addComment = await comment.createComment(xss(req.params.id), User._id.toString(), commentText);
                if(addComment){
                    res.redirect('/comments/'+xss(req.params.id));
                }else{
                    res.status(500).json({error: 'Internal Server Error'});
                }
            }catch(e){
                res.status(400).render('partials/comments', {title : 'Comments', error: e});
            }
        }
    }else{
        res.redirect('/login');
    }
    
});



module.exports = router;