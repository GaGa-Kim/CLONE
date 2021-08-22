const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");
const { auth } = require("../middleware/auth");

//=================================
//             Like
//=================================
 
// 좋아요 정보 가져오기
router.post('/getLikes', (req, res) => {

    let variable = {}

    if(req.body.videoId) {  // 비디오에 대한 좋아요
        variable = { videoId: req.body.videoId }
    } else {  // 댓글에 대한 좋아요
        variable = { commentId: req.body.commentId }
    }

    Like.find(variable) // DB에 쿼리를 하는 것, exec : 쿼리 실행
    .exec((err, likes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, likes })
    })
})

// 싫어요 정보 가져오기
router.post('/getDislikes', (req, res) => {

    let variable = {}

    if(req.body.videoId) {  
        variable = { videoId: req.body.videoId }
    } else {  
        variable = { commentId: req.body.commentId }
    }

    Dislike.find(variable) 
    .exec((err, dislikes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, dislikes })
    })
})

// 좋아요 하기
router.post('/uplike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {  
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {  
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

   // Like collection에 좋아요 클릭 정보 넣기
    const like = new Like(variable)
    like.save((err, likeResult) => { // DB에 저장
        if(err) return res.json({success: false, err})
        // 만약 Dislike가 이미 클릭 되어 있다면, Dislike를 1 줄여줌
        Dislike.findOneAndDelete(variable)
        .exec((err, dislikeResult) => {
           if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true})
        })
    })
})

// 좋아요 취소하기
router.post('/unlike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {  
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {  
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    // DB에 저장했던 like 지워주기
    Like.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true})
    })
})

// 싫어요 취소하기
router.post('/unDislike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {  
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {  
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    // DB에 저장했던 dislike 지워주기
    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true})
    })
})

// 싫어요 하기
router.post('/upDislike', (req, res) => {

    let variable = {}

    if(req.body.videoId) {  
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {  
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

   // Dislike collection에 싫어요 클릭 정보 넣기
    const dislike = new Dislike(variable)
    dislike.save((err, dislikeResult) => { // DB에 저장
        if(err) return res.json({success: false, err})
        // 만약 like가 이미 클릭 되어 있다면, like를 1 줄여줌
        Like.findOneAndDelete(variable)
        .exec((err, likeResult) => {
           if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true})
        })
    })
})

module.exports = router;
