import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

// 구독 비디오 페이지
function SubscriptionPage() {

    // 비디오 정보 저장
    const [Videos, setVideos] = useState([])

    // mongoDB에서 가져오기
    useEffect(() => {

        const subscriptionVariable = {
            userFrom: localStorage.getItem('userId')
        }
       
        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.videos)
                setVideos(response.data.videos)
            } else {
                alert('비디오 가져오기를 실패 했습니다.')
            }
        })
    }, [])

    const renderCards = Videos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <Col lg={6} md={8} xs={24}>
            <div style={{ position: 'relative' }}>
                {/* 동영상 하나에 해당하는 페이지를 가기 위해서 */} 
                <a href={`/video/${video._id}`} >  
                {/* 썸네일 이미지 */} 
                <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                {/* 비디오 재생시간 */} 
                <div className= "duration"
                    style={{ bottom: 0, right:0, position: 'absolute', margin: '4px', 
                    color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8, 
                    padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
                    fontWeight:'500', lineHeight:'12px' }}>
                    <span>{minutes} : {seconds}</span>
                </div>
                </a>
            </div><br />
            <Meta
                avatar={
                    // 유저 이미지
                    <Avatar src={video.writer.image} />
                } 
                // 타이틀 이름
                title={video.title}
            />
            {/* 비디오 제작자 이름 */} 
            <span>{video.writer.name} </span><br />
            {/* 비디오 재생 수, 업데이트한 날짜 */} 
            <span style={{ marginLeft: '3rem' }}> {video.views} views</span>- <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>

        
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />
            {/* 1개의 row에 4개의 columns */}
            <Row gutter={16}>  

                {renderCards}
                {/* 윈도우 사이즈에 따라 */}
                <Col lg={6} md={8} xs={24}> 
                        <div style={{ position: 'relative' }}>
                            <div className=" duration">

                            </div>
                        </div>
                    <hr />
                    <Meta


                        description=""
                    />

                </Col>
            </Row>
        </div>
    )
}

export default SubscriptionPage
