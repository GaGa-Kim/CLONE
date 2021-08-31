import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { API_KEY, API_URL, IMAGE_BASE_URL } from '../../Config';
import MainImage from './Sections/MainImage';  // 컴포넌트
import GirdCards from '../commons/GirdCards';  // 컴포넌트
import { Row } from 'antd';

function LandingPage() {

    const [Movies, setMovies] = useState([])
    // 가장 유명한 영화를 메인으로
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [CurrentPage, setCurrentPage] = useState(0)

    const fetchMovies = (endpoint) => {
        fetch(endpoint)
        .then(response => response.json())
        .then(response => {
            console.log(response.results)
            setMovies([...Movies, ...response.results])  // 영화 정보들 가져와서 배열에 넣기 (있던 정보 + 추가된 정보)
            setMainMovieImage(response.results[0])  // 영화 정보들 중에서 메인 이미지 하나
            setCurrentPage(response.page)  // 페이지 정보를 넣어줌
        })
    } 

    // Movie API에서 정보 가져오기
    useEffect(() => {
        // 현재 인기있는 movie 불러오기 (첫 페이지: page=1)
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        /* 가져와서 json을 사용해 결과값 이용
        fetch(endpoint)
        .then(response => response.json())
        .then(response => {
            console.log(response.results)
            setMovies([...response.results])  // 20개의 유명한 영화 정보들을 가져오게 되고 이를 배열에 넣어줌
            setMainMovieImage(response.results[0])
        }) */
        fetchMovies(endpoint)
    }, [])

    // 버튼 클릭 시 영화 정보 더 가져오기
    const loadMoreItems = () => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}}`;
        fetchMovies(endpoint)
    }

    return (
        <div style={{ width: '100%', margin: '0' }}>

            {/* Main Image 
            동일한 URL + 이미지 사이즈 + 이미지 이름 
            MainMovieImage의 정보가 가져오고 난 후에 실행되어야 함 */}
            {MainMovieImage &&
                <MainImage 
                    image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
                    title={MainMovieImage.original_title}
                    text={MainMovieImage.overview}
                />
            }

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <h2>Movies by latest</h2>
                <hr />

                {/* Movie Grid Cards 
                영화가 불러져 왔다면 하나씩 가져오기 위해 map 사용 */}
                <Row gutter={[16, 16]} >
                    {Movies && Movies.map((movie, index) => (
                        <React.Fragment key={index}>
                            <GirdCards
                                landingPage
                                // 이미지가 없을 경우도 생각
                                image={movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : null}
                                movieId={movie.id}
                                movieName={movie.original_title}
                            />
                        </React.Fragment>
                    ))}
                </Row>

            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={loadMoreItems}> Load More</button>
            </div>

        </div>
    )
}

export default LandingPage
