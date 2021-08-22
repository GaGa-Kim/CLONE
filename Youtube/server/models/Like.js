const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentId: {  // 댓글에 대한 좋아요
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    videoId: {  // 비디오에 대한 좋아요
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }
 
}, { timestamps: true })


const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }