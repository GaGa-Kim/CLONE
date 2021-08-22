import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import Axios from 'axios';
import SideVideo from './Section/SideVideo';
import Subscribe from './Section/Subscribe';
import Comment from './Section/Comment';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }

    const [Comments, setComments] = useState([])  // 모든 댓글 정보

    const [VideoDetail, setVideoDetail] = useState([])

    // 비디오 가져오기
    useEffect(() => {   
        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.VideoDetail)
                setVideoDetail(response.data.VideoDetail)
            } else {
                alert('비디오 정보를 가져오길 실패했습니다.')
            }
        })

        // 비디오에 해당하는 모든 comment 정보들을 DB로부터 가져오기
        Axios.post('/api/comment/getComments', variable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.comments)
                setComments(response.data.comments)
            } else {
                alert('코멘트 정보를 가져오는 것을 실패했습니다.')
            }
        })

    }, [])

    // 댓글이 작성되어었을 때 저장된 댓글이 Comments에 업데이트 됨 - 그리고 나머지에 영향을 끼치도록 합쳐줌
    // 그리하여 댓글을 작성하면 바로 합쳐진 댓글들이 있는 DB로부터 가져와서 바로 댓글을 보여줌
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    // 이미지 정보가 있을 때, 이를 가져오기 전에 랜더링하는 것을 막기 위해
    if(VideoDetail.writer) {

        // 자기 자신은 자신을 구독하지 못하도록
        const subscriberButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>

        return (
            <Row>
                    <Col lg={18} xs={24}>
                        <div style={{ width: '100%', padding: '3rem 4em' }}>
                            {/* 비디오 부분 */}
                            <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>
    
                            {/* 구독 부분 - 구독정보를 보내줌 */}
                            <List.Item
                                // 작성자의 아이디와 로그인한 사람의 아이디를 보내줌 - 이를 props를 통해 사용할 수 있음 (props.userTo, props.userFrom)
                                actions={[ subscriberButton ]} 
                            >
                                {/* 작성자 이름 등의 정보 (유저이미지, 제목, 설명) */}
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer && VideoDetail.writer.image} />}
                                    title={VideoDetail.writer.name}
                                    description={VideoDetail.description}
                                />
                            </List.Item>
    
                            {/* 댓글 부분 - Comments.js에게 전해줌 */}
                            <Comment refreshFunction= {refreshFunction} commentLists={Comments} postId={videoId}/>
                        </div>
                    </Col>
                    <Col lg={6} xs={24}>
                        <SideVideo />
                    </Col>
                </Row>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }   
}

export default VideoDetailPage
