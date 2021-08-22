const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    postId: {  // 댓글이 작성되는 비디오 아이디
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }
}, { timestamps: true })


const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment }