import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios'; 
import './Cheersong.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Cheersong = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [likedSongs, setLikedSongs] = useState({});
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teamId = searchParams.get('teamId'); 

  useEffect(() => { 
    window.scrollTo(0, 0);
    console.log("팀 ID:", teamId); // teamId 확인
    fetchSongs();
  }, [teamId]); // teamId가 변경될 때마다 노래를 다시 가져옴

  const fetchSongs = async () => {
    if (!teamId) return; // teamId가 없으면 요청하지 않음

    try {
      const response = await axios.get(`http://3.138.127.122:5000/api/cheersong/${process.env.REACT_APP_API_KEY}`); // API 요청
      setSongs(response.data);
    } catch (error) {
      console.error('Failed to fetch songs:', error);
    }
  };

  const filteredSongs = songs.filter((song) => {
    const matchTab =
      activeTab === 0 ||
      (activeTab === 1 && song.category === '구단') ||
      (activeTab === 2 && song.category === '선수');
    const matchSearch = song.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTeamId = song.TeamId === Number(teamId); 
    return matchTab && matchSearch && matchTeamId; 
  });

  const handleLike = (id) => {
    setLikedSongs((prev) => {
      const newLikes = { ...prev };
      if (newLikes[id]) {
        newLikes[id]--;
      } else {
        newLikes[id] = 1;
      }
      return newLikes;
    });
  };

  const handleClick = (id) => {
    navigate(`/songdetail/${id}`); // 노래 상세 페이지로 이동
  };

  return (
    <div className="container10">
      <div className="header72">
        <button className="back-button" onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </button>
        <div className="title72">응원가</div>
      </div>
      <div className="line"></div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="검색어를 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tab-container">
        <div
          className={`tab ${activeTab === 0 ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(0)}
        >
          전체
        </div>
        <div
          className={`tab ${activeTab === 1 ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          구단
        </div>
        <div
          className={`tab ${activeTab === 2 ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          선수
        </div>
      </div>

      <div className="button-container">
        {filteredSongs.map((song) => (
          <div key={song.id} className="button-wrapper">
            <button
              className="button"
              onClick={() => handleClick(song.id)}  
            >
              <span className="button-text">{song.name}</span>
              <div className="checkbox-container">
                <Checkbox
                  {...label}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  className="button-heart"
                  sx={{
                    color: '#FA9092',
                    '&.Mui-checked': {
                      color: '#FA9092',
                    },
                  }}
                  checked={likedSongs[song.id] > 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(song.id);
                  }}
                />
                {likedSongs[song.id] > 0 && (
                  <span className="like-count" style={{ color: '#FA9092', display: 'block', textAlign: 'center', marginTop: '-5px', fontSize: '13px' }}>
                    {likedSongs[song.id]}
                  </span>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cheersong;