import Axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveMessage } from '../_actions/message_actions'
import Message from './Section/Message';
import Card from './Section/Card';
import { List, Icon, Avatar } from 'antd';

function Chatbot() {
    // 자동 스크롤
    const messageEndRef = useRef(null);
    
    // 메세지 데이터를 데이터베이스가 아닌, 리덕스에 저장 (새로고침하면 사라지도록)
    const dispatch = useDispatch();
    // Redux store 에서 확인 가능 (state - message - messages)
    const messagesFromRedux = useSelector(state => state.message.messages)

    // 웹사이트에 처음 들어왔을 때 챗봇이 보내는 event를 보여주기 위해 사용
    // 페이지가 랜더링 된 후, react가 컴포넌트에 event를 보여줌
    useEffect(() => {
        eventQuery('welcomeToMyWebsite')
    }, []) 

    // 자동 스크롤
    useEffect(() => {
        if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
        }
    });

    // textQuery - 우리의 입력이 필요
    // 서버에 만들어 둔 textQuery Route에 request 
    const textQuery = async (text) => {

        // 내가 보낸 메시지 처리
        let conversation = {
            who: 'user',  // 내가 보낸 메시지
            content: {  // dialogflow의 형식을 참조
                text: {
                    text: text  
                }
            }
        } 
        // 입력된 데이터를 리덕스에 저장
        dispatch(saveMessage(conversation))
        // console.log('text I sent', conversation)

        // 챗봇이 보낸 메시지 처리 (내가 보낸 말에 대한 대답)
        const textQueryVariable = {
            text
        }

        try {  
            // textQuery Route에 request
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariable)
            // 챗봇이 보내는 모든 메시지를 다 가져올 수 있도록 반복문 사용
            for (let content of response.data.fulfillmentMessages) {
                conversation = {
                    who: 'bot',  // bot이 보낸 메시지
                    content: content
                }     
                // 챗봇이 대답한 메시지 저장
                dispatch(saveMessage(conversation))      
                // console.log(conversation)
            }
        } catch(err) {
            conversation = {
                who: 'user',
                content: {  
                    text: {
                        text: 'Error just occured, please check the problem' 
                    }
                }
            }
            // 에러도 저장
            dispatch(saveMessage(conversation))
            // console.log(conversation)
        } 
    }

    // eventQuery - 우리의 입력이 불필요
    const eventQuery = async (event) => {

        // 챗봇이 보낸 메시지 처리
        const evnetQueryVariable = {
            event
        }

        try {  
            // eventQuery Route에 request
            const response = await Axios.post('/api/dialogflow/eventQuery', evnetQueryVariable)
            // 챗봇이 보내는 모든 메시지를 다 가져올 수 있도록 반복문 사용
            for (let content of response.data.fulfillmentMessages) {
                let conversation = {
                    who: 'bot',  // bot이 보낸 메시지
                    content: content
                }     
                // 챗봇이 대답한 메시지 저장
                dispatch(saveMessage(conversation))      
                // console.log(conversation)
            }
        } catch(err) {
            let conversation = {
                who: 'user',
                content: {  
                    text: {
                        text: 'Error just occured, please check the problem' 
                    }
                }
            }
            dispatch(saveMessage(conversation))
        } 
    }


    const keyPressHandler = (event) => {
        if(event.key === "Enter") {
            if(!event.target.value) {  // 입력된 값이 없을 경우
                return alert('you need to type something first')
            }
            // enter 클릭 시, 입력한 값과 함께 textQuery Route에 request
            textQuery(event.target.value)
            event.target.value = "";  // 요청을 보낸 후, 다시 입력 칸을 빈칸으로 
        }
    }

    const renderCards = (cards) => {
        return cards.map((card, index) => 
            <Card key={index} cardInfo={card.structValue} />)
    }

    const renderOneMessage = (message, index) => {
        // who와 text 필요
        console.log('message', message)

        // 보통 메시지
        if(message.content && message.content.text && message.content.text.text) {
            return <Message key={index} who={message.who} text={message.content.text.text} />
        } else if(message.content && message.content.payload.fields.card) {  // 카드 메시지
            const AvatarSrc = message.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />

            return <div>
                <List.Item style={{ padding: '1rem' }}>
                    <List.Item.Meta
                        avatar={<Avatar icon={AvatarSrc} />}
                        title={message.who}
                        description={renderCards(message.content.payload.fields.card.listValue.values)}
                    />
                </List.Item>
            </div>
        }
    }

    // 채팅창에 메시지 출력
    const renderMessage = (returnMessages) => {
        if(renderMessage) {
            // 메시지를 하나하나 모두 처리해줘야 하므로 map 사용
            return returnMessages.map((message, index) => {
                return renderOneMessage(message, index)
            })
        } else {
            return null
        }
    }

    return (
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>

            {renderMessage(messagesFromRedux)}
            <div ref={messageEndRef} />
            </div>
            <input
                style={{
                    margin: 0, width: '100%', height: 50,
                    borderRadius: '4px', padding: '5px', fontSize: '1rem'
                }}
                placeholder="Send a message..."
                onKeyPress={keyPressHandler}
                type="text"
            />

        </div>
    )
}

export default Chatbot
