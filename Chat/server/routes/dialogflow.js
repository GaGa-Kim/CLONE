const express = require('express');
const router = express.Router();
const structjson = require('./structjson.js');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

const config = require('../config/keys');

// dialogflow npm 페이지 코드 이용
// 세션을 위한 projectId와 sessionId 
const projectId = config.googleProjectID
const sessionId = config.dialogFlowSessionID
const languageCode = config.dialogFlowSessionLanguageCode

// dialogflow에 보내기 위해서 세션 생성
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// 두 개의 라우터 - 텍스트 쿼리, 이벤트 쿼리

// 라우터 1 - Text Query Route (클라이언트가 보내는 텍스트)
// 클라이언트에서 받은 데이터를 dialogflow로 보내주기
router.post('/textQuery', async (req, res) => {
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // 클라이언트가 적은 text
                text: req.body.text,
                // en-US
                languageCode: languageCode,
            },
        },
    };

    /* postman 테스트
    {
        "text" : "how are you?"
    } */

    // 위에서 보낸 데이터를 처리한 후, 서버는 가공된 데이터를 다시 클라이언트에게 보내줌
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    res.send(result)
})

// 라우터 2 - Event Query Route (처음 챗봇을 켰을 때 대화창에서 챗봇이 형식적인 메시지인 이벤트를 보내는 것)
router.post('/eventQuery', async (req, res) => {
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                name: req.body.event,
                // en-US
                languageCode: languageCode,
            },
        },
    };

    /* postman 테스트
    {
        "event" : "welcomeToMyWebsite"
    } */

    // 위에서 보낸 데이터를 처리한 후, 서버는 가공된 데이터를 다시 클라이언트에게 보내줌 (res.send(reseult))
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);

    res.send(result)
})

module.exports = router;
