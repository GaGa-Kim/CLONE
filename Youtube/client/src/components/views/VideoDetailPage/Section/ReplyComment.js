// 대댓글

import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    // 대댓글이 있나 숫자를 가져오기 위해서 - 댓글이 작성될 때마다 다시 실행되도록 해야함
    useEffect(() => {
        let commentNumber = 0;

        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber ++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [props.commentLists])

    // 모든 댓글들 가져오기
    const renderReplyComment = (parentCommentId) => 
        props.commentLists.map((comment, index) => (
            // single comment에서 모든 원댓글을 보여준 후,
            // 이곳에서 sinlge comment의 아이디와 대댓글의 responseTo가 같을 때 그 댓글에 대한 대댓글을 보여줌 
            // 이를 반복하여 댓글과 대댓글을 주르륵 보여줌

            // 댓글의 responseTo와 원댓글 작성자의 아이디가 같을 때
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId && 
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
                        <ReplyComment commentLists={props.commentLists} postId={props.videoId} parentCommentId={comment._id} refreshFunction={props.refreshFunction}/>
                    </div> 
                }
            </React.Fragment>
        ))
    
                const onHandleChange = () => {
                    setOpenReplyComments(!OpenReplyComments)
                }

    return (
        <div>

            {ChildCommentNumber > 0 && 
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange} >
                View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments && // 위를 클릭하여 true일 때만 대댓글이 보임
                renderReplyComment(props.parentCommentId)
            }
        
        </div>
    )
}

export default ReplyComment
