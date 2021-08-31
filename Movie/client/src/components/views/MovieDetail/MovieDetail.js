import React, { useEffect, useState } from 'react'
import { API_KEY, API_URL, IMAGE_BASE_URL } from '../../Config' 
import MainImage from '../LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import GirdCards from '../commons/GirdCards';
import { Row } from 'antd';

function MovieDetail(props) {

    let movieId = props.match.params.movieId

    // 가져온 정보 state에 넣어 주기
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [ActorToggle, setActorToggle] = useState(false)  // 출연자 정보 버튼 클릭

    useEffect(() => {
        console.log(props.match)
        // 영화에 나오는 crews 정보 가져옴
        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`
        // 특정한 영화에 해당하는 자세한 정보를 가져옴
        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`

        fetch(endpointInfo)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            setMovie(response)
        })

        fetch(endpointCrew)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            setCasts(response.cast)
        })
    }, [])

    // 버튼 클릭 시 출연자 정보를 보여주도록 (false -> true)
    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    return (
        <div>
            {/* Header */}
            <MainImage 
                    image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
                />
            
            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>


                {/* Movie Info - movie state를 넣어서 보내주고, MoveInfo에서 props로 받아서 사용 */}
                <MovieInfo movie={Movie} />

                <br />
                {/* Actors Grid*/}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <button onClick={toggleActorView}>Toggle Actor View </button>  
                </div>

                {ActorToggle && 
                    <Row gutter={[16, 16]} >
                    {Casts && Casts.map((casts, index) => (
                        <React.Fragment key={index}>
                            <GirdCards
                            // 이미지가 없을 경우도 생각
                            image={casts.profile_path ? `${IMAGE_BASE_URL}w500${casts.profile_path}` : null}
                            characterName={casts.name}
                            />
                        </React.Fragment>
                    ))}
                </Row>
                }
            </div>    
        </div>
    )
}

export default MovieDetail
