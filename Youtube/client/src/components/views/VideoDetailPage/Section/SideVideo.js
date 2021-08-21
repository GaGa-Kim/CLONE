import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    // DB에서 정보 가져오기
    useEffect(() => {      
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success) {
                console.log(response.data.videos)
                setsideVideos(response.data.videos)
            } else {
                alert('비디오 가져오기를 실패 했습니다.')
            }
        })
    }, [])

    // 여러 개를 가져오기 위해서 map 메소드 사용
    const renderSideVideo = sideVideos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <div key={index} style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}>
            {/* 왼쪽 부분 */}
            <div style={{ width:'40%', marginRight:'1rem' }}>
                <a href style={{ color:'gray' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                </a>
            </div>
            
            {/* 오른쪽 부분 */}
            <div style={{ width:'50%' }}>
                <a href style={{ color:'gray' }}>
                    <span style={{ fontSize: '1rem', color: 'black' }}>{video.Title} </span><br />
                    <span>{video.writer.name}</span><br />
                    <span>{video.views} views</span><br />
                    <span>{minutes} : {seconds}</span><br />
                </a>
            </div>
        </div>
        
    })

    return (
        <React.Fragment>
            <div style={{ marginTop:'3rem' }}></div>
                {renderSideVideo}
        </React.Fragment>

    )
}

export default SideVideo
