// 맨 아래 댓글 작성하기

import React, { useState } from 'react'
import { Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const { TextArea } = Input;

function Comment(props) {

    // const videoId = props.match.params.videoId 
    // 또는 detail에서 postId={videoID로 가져옴}
    const videoId = props.postId
    const user = useSelector(state => state.user)
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    } 

    const onSubmit = (event) => {
        event.preventDefault();

        const variable = {
            content: commentValue,  // 댓글
            writer: user.userData._id,  // 작성자 (리덕스 훅에서 가져오기)
            postId: videoId // 비디오 아이디
        }

        Axios.post('/api/comment/saveComment', variable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.result)
                // 작성된 댓글을 detail로 보내줘서 댓글 목록 업데이트
                setcommentValue("")
                props.refreshFunction(response.data.result)
            } else {
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists - 대댓글이 있으면 댓글과 작성자 정보를 가져오도록 */}
            {/* VideoDetailPage.js로부터 가져옴 */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && // 대댓글이 없는 댓글만
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId}/>
                        <ReplyComment commentLists={props.commentLists} parentCommentId={comment._id} postId={videoId} refreshFunction={props.refreshFunction} />
                    </React.Fragment>

                )
            ))}

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default Comment
