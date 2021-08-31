import React from 'react'
import { Col } from 'antd';

// Lading Page의 GridCard
function GirdCards(props) {
    // 메인 페이지
    if(props.landingPage) {
        return (
            <div>
                <Col lg={6} md={8} xs={24}>
                    <div style={{ position: 'relative' }}>
                        <a href={`/movie/${props.movieId}`} >
                            <img style={{width: '100%', height: '320px'}} src={props.image} alt={props.movieName} />
                        </a>
                    </div>
                </Col>
            </div>
        )
    } else { // 영화 출연자
        return (
            <div>
                <Col lg={6} md={8} xs={24}>
                    <div style={{ position: 'relative' }}>
                        <img style={{width: '100%', height: '320px'}} src={props.image} alt={props.characterName} />
                    </div>
                </Col>
            </div>
        )
    }
}

export default GirdCards
