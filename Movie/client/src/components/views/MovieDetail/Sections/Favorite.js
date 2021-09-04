import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Favorite(props) {

    const movieId = props.moveId
    const userFrom = props.userFrom
    const movieTitle = props.movieInfo.title
    const moviePost = props.movieInfo.backdrop_path
    const movieRunTime = props.movieInfo.runtime

    const [FavoriteNumber, setFavoriteNumber] = useState(0)  // favorite한 사람들의 숫자
    const [Favorited, setFavorited] = useState(false)  // 내가 favorite 버튼을 눌렀는지
    
    // 페이지가 로드되자마자 favorite를 누른 사람의 정보 가져오기
    useEffect(() => {

        let variables = {  // 누가 좋아요를 눌렀는지, 어떤 무비를 좋아요했는지에 대한 정보를 같이 보내줌
            userFrom, 
            movieId
        }

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

    return (
        <div>
            <button>{Favorited ? "Not Favorite" : "Add to Favorite"} {FavoriteNumber} </button>
        </div>
    )
}

export default Favorite
