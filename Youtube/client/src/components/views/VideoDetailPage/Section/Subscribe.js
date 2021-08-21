import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        let variable = { userTo: props.userTo }

        // 몇 명의 사람이 구독을 하고 있는지에 대한 정보
        Axios.post('/api/subscribe/subscriberNumber', variable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setSubscribeNumber(response.data.subscribeNumber)
            } else {
                alert('구독자 수 정보를 받아오지 못했습니다.')
            }
        })

        let subscribedvariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId')}

        // 내가 이 채널을 구독하고 있는지
        Axios.post('/api/subscribe/subscribed', subscribedvariable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setSubscribed(response.data.subscribed)
            } else {
                alert('정보를 받아오지 못했습니다.')   
            }
        })

    }, [])
    
    // 구독
    const onSubscribe = () => {

        // 내 아이디와 작성자의 아이디가 필요
        let subscribevariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        // 이미 구독 중이라면 - 버튼을 눌렀을 때 구독 취소
        if(Subscribed) {
            Axios.post('/api/subscribe/unsubscribe', subscribevariable)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)
                    setSubscribeNumber(SubscribeNumber - 1)
                    setSubscribed(!Subscribed)
                } else {
                    alert('구독 취소하는데 실패 했습니다.')
                }
            })
        } else {  // 구독 중이 아니라면 - 버튼을 눌렀을 때 구독
            Axios.post('/api/subscribe/subscribe', subscribevariable)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                } else {
                    alert('구독하는데 실패 했습니다.')
                }
            })
        }
    }

    return (
        <div>
            <button
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'}} 
                onClick={onSubscribe}
            >
            {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
