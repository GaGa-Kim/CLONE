import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import './favorite.css';
import { Popover } from 'antd';
import { IMAGE_BASE_URL } from '../../Config';

function FavoritePage() {

    const [Favorites, setFavorites] = useState([])

    // favorite된 목록 가져오기 - localStorage를 사용해서 내 정보 보내주기
    useEffect(() => {
        fetchFavoredMovie()
    }, [])

    const fetchFavoredMovie = () => {
        Axios.post('/api/favorite/getFavoredMovie', { userFrom: localStorage.getItem('userId')})
        .then(response => {
            if(response.data.success) {
                // console.log(response.data)
                setFavorites(response.data.favorites)
            } else {
                alert('영화 정보를 가져오는데 실패 했습니다.')
            }
        })
    }

    // 영화 아이디와 본인 아이디를 알아와서 Remove 버튼 클릭 시, favorite list에서 삭제
    const onClickDelete = (movieId, userFrom) => {
        const variables = {
            movieId,
            userFrom
        }

        Axios.post('/api/favorite/removeFromFavorite', variables)
        .then(response => {
            if(response.data.success) {
                fetchFavoredMovie()
            } else {
                alert("리스트에서 지우는데 실패했습니다.")
            }
        })

    }

    // 여러 개의 영화가 있을 수 있으므로 map을 이용, 영화 타이틀 위로 마우스 올릴 시, 영화 포스터 보여주기
    const renderCards = Favorites.map((favorite, index) => {
        const content = (
            <div>  
                {favorite.moviePost ? <img src={`${IMAGE_BASE_URL}w500${favorite.moviePost}`}/> : "no image"}
            </div>
        )

        return <tr key={index}>
            <Popover content={content} title={`${favorite.movieTitle}`}>
                <td>{favorite.movieTitle}</td>
            </Popover>
            <td>{favorite.movieRunTime} mins</td>
            <td><button onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}>Remove</button></td>
        </tr>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h2> Favorite Movies </h2>
            <hr />

            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Movie RunTime</th>
                        <td>Remove from favorites</td>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
        </div>
    )
}

export default FavoritePage
