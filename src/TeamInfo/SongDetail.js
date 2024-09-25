import React, { useEffect, useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import './SongDetail.css';

const SongDetail = () => {
  const { id } = useParams(); // URL 파라미터에서 id를 가져옴
  const navigate = useNavigate(); // useNavigate 사용
  const [song, setSong] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchSongDetail = async () => {
      try {
        const response = await axios.get(`http://3.138.127.122:5000/api/cheersong/${process.env.REACT_APP_API_KEY}`); // 고정된 URL
        const songData = response.data;

        // 응답이 객체인지 확인하고, ID를 비교
        if (Array.isArray(songData)) {
          const foundSong = songData.find(song => song.id === Number(id));
          if (foundSong) {
            setSong(foundSong);
            setLikeCount(foundSong.like || 0); // like가 없을 경우 기본값 설정
          } else {
            console.error("No song found with the given id");
          }
        } else if (songData.id === Number(id)) {
          // 단일 객체인 경우
          setSong(songData);
          setLikeCount(songData.like || 0);
        } else {
          console.error("No song found with the given id");
        }
      } catch (error) {
        console.error("Failed to fetch song details:", error);
      }
    };

    fetchSongDetail();
  }, [id]); // id를 의존성 배열에 추가

  const handleLikeClick = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBackClick = () => {
    navigate(-1); // 뒤로가기
  };

  if (!song) {
    return <div>Loading...</div>; // 로딩 상태 처리
  }

  return (
    <div className="song-detail-container">
      <ArrowBackIcon className="arrow-button" onClick={handleBackClick} />
      <div className="title-text">{song.name}</div>
      <a href={song.video_url} className="link-text" target="_blank" rel="noopener noreferrer">
        응원 영상 보러가기 &gt;
      </a>
      <div className="like-container">
        <div className="like-icon" onClick={handleLikeClick}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
        <div className="like-count">{likeCount}</div>
      </div>
      <div className="bottom-box"> 
        <div className="lyrics">
          {song.lyrics.split('\n').map((line, index) => (
             <p key={index} style={{ margin: '60px 0' }}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongDetail;
