const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================
 
// 구독 정보 가져오기 (userTo)
router.post('/subscriberNumber', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo })
    // userTo를 구독하고 있는 모든 사람들의 수
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length})
    }) 
    
});

// 내가 이 채널을 구독했는지 정보 가져오기 (userTo, userFrom)
// (userTo와 userFrom에 모두 해당하는 사람이 있으면 이를 구독하고 있는 것)
router.post('/subscribed', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err)
        let result = false
        if(subscribe.length !== 0) {  // subscribe.length가 0이면 구독을 하지 않은 것, 그 외는 구독을 한 것
            result = true
        }
        res.status(200).json({ success: true, subscribed: result})
    })
});

// 구독 취소하기
router.post('/unsubscribe', (req, res) => {
    Subscriber.findOneAndDelete({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success: false, err})
        res.status(200).json( { success: true, doc })
    })  
});

// 구독하기
router.post('/subscribe', (req, res) => {

    // DB에 userTo와 userFrom을 저장해야 함
    const subscribe = new Subscriber(req.body)

    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        res.status(200).json({ success: true })
    })
});


module.exports = router;
