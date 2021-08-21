const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {  // 업로드한 사람 아이디
        type:Schema.Types.ObjectId,  // 이를 통해 models/User에서 모든 정보를 가져올 수 있음
        ref: 'User'
    },
    title: {
        type:String,
        maxlength:50,
    },
    description: {
        type: String,
    },
    privacy: {
        type: Number,
    },
    filePath : {
        type: String,
    },
    catogory: String,
    views : {
        type: Number,
        default: 0 
    },
    duration :{
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true })


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }