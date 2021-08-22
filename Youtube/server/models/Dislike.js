const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DislikeSchema = mongoose.Schema({
    userTo: {  // 구독한 사람 (나를 구독하는 사람)
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom : { // 구독 받은 사람 (나)
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


const Dislike = mongoose.model('Dislike', DislikeSchema);

module.exports = { Dislike }