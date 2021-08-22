import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable = { }

    // 비디오 좋아요 - 부모 컴포넌트로부터 가져옴
    if(props.video) {
        variable = { videoId: props.videoId, userId: props.userId }
    } else {  // 댓글 좋아요
        variable = { commentId: props.commentId, userId : props.userId }
    }

    useEffect(() => {
        // 좋아요 갯수
        Axios.post('/api/like/getLikes', variable)
        .then(response => {
            if(response.data.success) {

               // 얼마나 많은 좋아요를 받았는지
               setLikes(response.data.likes.length)

               // 내가 이미 그 좋아요를 눌렀는지 
               // 좋아요한 사람들의 아이디 중 내 아이디와 같을 경우가 있을 때는 이미 좋아요가 눌려진 것
               response.data.likes.map(like => {
                   if(like.userId === props.userId) {
                    setLikeAction('liked')
                   }
               })
            } else {
                alert('Likes의 정보를 가져오지 못했습니다.')
            }
        })  

        // 싫어요 갯수
        Axios.post('/api/like/getDislikes', variable)
        .then(response => {
            if(response.data.success) {
               setDislikes(response.data.dislikes.length)
               response.data.dislikes.map(dislike => {
                   if(dislike.userId === props.userId) {
                    setDislikeAction('disliked')
                   }
               })
            } else {
                alert('Dislikes의 정보를 가져오지 못했습니다.')
            }
        }) 
    }, [])

    // 좋아요 버튼 클릭하여 좋아요 or 좋아요 취소 
    const onLike = () => {
        if(LikeAction === null) {  // 좋아요 클릭이 안 되어 있을 때 (좋아요)
            Axios.post('/api/like/upLike', variable)  // 위에 정의한 variable 사용
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes + 1)
                    setLikeAction('liked')
                    if(DislikeAction !== null) { // 만약 싫어요를 해둔 상태였다면
                        setDislikeAction(null)
                        setDislikes(Dislikes - 1)
                    } 
                } else {
                    alert('Like를 올리지 못하였습니다.')
                }
            }) 
        } else {  // 좋아요 클릭이 되어 있었을 때 (좋아요 취소)
            Axios.post('/api/like/unLike', variable)  
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes - 1)
                    setLikeAction(null)
                } else {
                    alert('Like를 내리지 못하였습니다.')
                }
            })
        }
    }

    
    // 싫어요 버튼 클릭하여 싫어요 or 싫어요 취소 
    const onDislike = () => {
        if(DislikeAction !== null) {  // 싫어요일 때 (싫어요 취소)
            Axios.post('/api/like/unDislike', variable) 
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes - 1)
                    setDislikeAction(null) 
                } else {
                    alert('Dislike를 지우지 못하였습니다.')
                }
            }) 
        } else {  // 싫어요가 클릭 되어 있지 않을 때 (싫어요)
            Axios.post('/api/like/upDislike', variable)  
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes + 1)
                    setDislikeAction('disliked')
                    if(LikeAction !== null) { 
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    } 
                } else {
                    alert('Dislike를 올리지 못하였습니다.')
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
