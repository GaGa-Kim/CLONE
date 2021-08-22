const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");
const { auth } = require("../middleware/auth");

//=================================
//             Comment
//=================================
 
router.post('/saveComment', (req, res) => {

    const comment = new Comment(req.body)

    // 댓글 내용 DB에 저장
    comment.save((err, comment) => {
        if(err) return res.json({success: false, err})

        // 저장된 댓글 내용에서 위에서 아이디를 찾아와서 작성자의 이름, 이미지 등을 가져옴 (댓글 작성자에 쓰기 위해서)
        Comment.find({'_id': comment._id})
        .populate('writer')
        .exec((err, result) => {
            if(err) return res.json({success: false, err})
            return res.status(200).json({success: true, result})
        })
    })
})

// 특정 비디오에 대한 comment 정보 DB로부터 가져오기 
router.post('/getComments', (req, res) => {
    Comment.find({'postId': req.body.videoId})
    .populate('writer')
    .exec((err, comments) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success: true, comments})
    })
})
module.exports = router;
