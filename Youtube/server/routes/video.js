const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

//=================================
//             Video
//=================================

// config 옵션
let storage = multer.diskStorage({
    destination: (req, file, cb) => {  // 어디에 파일을 받을 지
        cb(null, "uploads/");  // 파일을 올리면 upload 폴더에 저장
    },
    filename: (req, file, cb) => {  // 파일 이름
        cb(null, `${Date.now()}_${file.originalname}`)  // 날짜_파일이름
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4' || ext !== '.png') {  // 동영상과 png만 가능
            return cb(res.status(400).end('only png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

// 위를 여기에 넣음 (single : 파일은 하나만)
const upload = multer({storage: storage}).single("file")

// 비디오 가져오기
// index.js을 먼저 갔다가 여기로 오므로 /api/video 생략
router.post('/uploadfiles', (req, res) => {

    // 클라이언트에서 받은 비디오를 서버에 저장
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        // 파일을 업로드하면 폴더에 들어가게 되는데 그 경로인 url을 보내주는 것
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
});
    
// 썸네일 생성하고 비디오 러닝타임 (정보) 가져오기
router.post('/thumbnail', (req, res) => {

    // 비디오 정보 가져오기 - 자동적으로 메타 데이타를 가져옴
    let thumbsFilePath ="";
    let fileDuration ="";

    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });

    // 썸네일 생성
    ffmpeg(req.body.filePath)  // 클라이언트에서 온 비디오 저장 경로
    .on('filenames', function (filenames) {  // 비디오 썸네일 파일 이름 생성
        console.log('Will generate ' + filenames.join(', '))
        filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function () {  // 썸네일을 생성하고 난 후 무엇을 할지
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration})  // 파일 이름, 러닝 타임
    })
    .on('error', function(err) {
        console.error(err);
        return res.json({ success: false, err});
    })
    .screenshots({
        count: 3,  // 3개의 썸네일 가능
        folder: 'uploads/thumbnails',  // 썸네일 저장 경로 (uploads 폴더 안에 thunmnails 폴더 안)
        size:'320x240',  // 썸네일 사이즈
        filename:'thumbnail-%b.png'
    });
}); 

// 비디오 업로드 하기
router.post('/uploadVideo', (req, res) => {

    // mongoDB에 비디오 정보들을 저장
    // 클라이언트가 보낸 모든 정보(variables)를 Video에 저장
    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        res.status(200).json({success: true})
    })
});

// mongoDB로부터 비디오 정보 가져오기
router.get('/getVideos', (req, res) => {

    // 비디오를 DB에서 가져와서 클라이언트에게 보냄
    Video.find()
    .populate('writer')  // 아이디 외 모든 정보를 가져오기 위해 사용
    .exec((err, videos) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, videos})
    })
});

// mongoDB로부터 비디오 가져오기
router.post('/getVideoDetail', (req, res) => {

    Video.findOne({ "_id" : req.body.videoId })  // 아이디를 이용해서 비디오를 찾음
    .populate('writer')
    .exec((err, VideoDetail) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, VideoDetail})
    })
});

module.exports = router;
