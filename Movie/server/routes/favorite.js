const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/Favorite')

//=================================
//             Favorite
//=================================

router.post('/favoriteNumber', (req, res) => {
    // bodyparser 이용
    // req.body.movieId

    // mongoDB에서 favorite 숫자를 가져오기 (DB에서 내가 보낸 정보와 같은 movieId인 정보를 찾기)
    Favorite.find({"movieId": req.body.movieId})
    .exec((err, info) => {
        if(err) return res.status(400).send(err) 
         // 그 다음에 프론트에 다시 숫자 정보 보여주기
        res.status(200).json({success: true, favoriteNumber: info.length})
    })
})

router.post('/favorited', (req, res) => {
    // 내가 이 영화를 Favorite 리스트에 넣었는지에 대한 정보를 DB에서 가져오기
    Favorite.find({"movieId": req.body.movieId, "userFrom": req.body.userFrom })
    .exec((err, info) => {
        if(err) return res.status(400).send(err) 
        let result = false;
        if(info.length != 0) {  // 0이 아니면 favorite한 것이므로 true로 바꿔줌
            result = true
        }
        res.status(200).json({success: true, favorited: result})
    })
})

module.exports = router;
