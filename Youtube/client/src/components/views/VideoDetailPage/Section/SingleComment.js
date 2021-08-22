// 작성된 댓글 + 대댓글 reply 작성

import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user)

    // 대댓글 서랍 열고 닫기
    const [OpenReply, setOpenReply] = useState(false)
    // 댓글 작성
    const [CommentValue, setCommentValue] = useState("")

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply) // 닫아 있을 때 열기
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variable = {
            content: CommentValue,  // 댓글
            writer: user.userData._id,  // 작성자 (리덕스 훅에서 가져오기)
            postId: props.postId, // 비디오 아이디
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.result)
                // 작성된 댓글을 detail로 보내줘서 댓글 목록 업데이트
                setCommentValue("")
                props.refreshFunction(response.data.result)
                setOpenReply(false)
            } else {
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
             <Comment  // DB로부터 댓글들 전체 가져옴
               // Comment.js에서 가져와서 사용
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p> {props.comment.content} </p>}
            />

            {OpenReply &&  // 대댓창이 열려있을 때만 코멘트 폼이 보이도록
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onHandleChange}
                    value={CommentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </form>
            }
            
        </div>
    )
}

export default SingleComment
