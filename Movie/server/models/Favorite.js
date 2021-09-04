const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = mongoose.Schema({
    userFrom: {
        type: Schema.Types.ObjectId,  // 유저 정보 모두 가져옴 (이름, 이미지, 토큰 정보 등)
        ref: 'User'
    },
    movieId: {
        type: String
    },
    movieTitle: {
        type: String
    },
    moviePost: {
        type: String
    },
    movieRunTime: {
        type: String
    }
}, { timestamps: true })  // 생성된 시간을 자동으로 해줌

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = { Favorite }