import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Button } from 'antd';

function Favorite(props) {

    const movieId = props.moveId
    const userFrom = props.userFrom
    const movieTitle = props.movieInfo.title
    const moviePost = props.movieInfo.backdrop_path
    const movieRunTime = props.movieInfo.runtime

    const [FavoriteNumber, setFavoriteNumber] = useState(0)  // favorite한 사람들의 숫자
    const [Favorited, setFavorited] = useState(false)  // 내가 favorite 버튼을 눌렀는지

    let variables = {  // 누가 좋아요를 눌렀는지, 어떤 무비를 좋아요했는지 등에 대한 정보를 같이 보내줌
        userFrom, 
        movieId,
        movieTitle,
        moviePost,
        movieRunTime
    }
    
    // 페이지가 로드되자마자 favorite를 누른 사람의 정보 가져오기
    useEffect(() => {

        // favorite한 사람들의 숫자
        Axios.post('/api/favorite/favoriteNumber', variables)    
        .then(response => {
            if(response.data.success) {
                // console.log(response.data)
                setFavoriteNumber(response.data.favoriteNumber)
            } else {
                alert('숫자 정보를 가져오는데 실패 했습니다.')
            }
        }) 
        
        // 내가 favorite 버튼을 눌렀는지 (favorite 리스트에 넣었는지)
        Axios.post('/api/favorite/favorited', variables)    
        .then(response => {
            if(response.data.success) {
                // console.log('favorited', response.data)
                setFavorited(response.data.favorited)
            } else {
                alert('정보를 가져오는데 실패 했습니다.')
            }
        })

    }, [])

    const onClickFavorite = () => {
        if(Favorited) { // 이미 좋아요한 경우 클릭 시 삭제
            Axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if(response.data.success) {
                    setFavoriteNumber(FavoriteNumber - 1)
                    setFavorited(!Favorited)
                } else {
                    alert('Favorite 리스트에서 지우는 걸 실패했습니다.')
                }
            })
        } else {  // 좋아요하기
            Axios.post('/api/favorite/addToFavorite', variables)
            .then(response => {
                if(response.data.success) {
                    setFavoriteNumber(FavoriteNumber + 1)
                    setFavorited(!Favorited)
                } else {
                    alert('Favorite 리스트에서 추가하는 걸 실패했습니다.')
                }
            })

        }
    }

    return (
        <div>
            <Button onClick={onClickFavorite}>{Favorited ? "Not Favorite" : "Add to Favorite"} {FavoriteNumber} </Button>
        </div>
    )
}

export default Favorite
