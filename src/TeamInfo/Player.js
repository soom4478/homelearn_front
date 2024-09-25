import React, { useEffect, useState } from 'react';
import './Player.css'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'; 
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'; 
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Player = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teamId = searchParams.get('teamId'); // teamId 가져오기
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favoredPlayers, setFavoredPlayers] = useState(new Set());

  useEffect(() => {
    const fetchPlayers = async () => {
      console.log("팀 ID:", teamId); // teamId 확인
      try {
        const response = await axios.get(`http://3.138.127.122:5000/api/teammember/${process.env.REACT_APP_API_KEY}`); // teamId를 사용하여 API 호출
        setPlayers(response.data); // 모든 선수 데이터를 가져옴
      } catch (error) {
        console.error("선수 정보를 가져오는 데 오류가 발생했습니다:", error);
      }
    };

    if (teamId) { // teamId가 있을 때만 데이터 fetching
      fetchPlayers();
    }
  }, [teamId]); // teamId가 변경될 때마다 선수 데이터를 다시 가져옴

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  const toggleFavorite = (playerId) => {
    setFavoredPlayers(prevFavoredPlayers => {
      const newFavoredPlayers = new Set(prevFavoredPlayers);
      if (newFavoredPlayers.has(playerId)) {
        newFavoredPlayers.delete(playerId);
      } else {
        newFavoredPlayers.add(playerId);
      }
      return newFavoredPlayers;
    });
  };

  // 선수 목록 필터링
  const filteredPlayers = players
    .filter(player => 
      player.teamId === Number(teamId) && // teamId가 같은 선수만 필터링
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const isAFavored = favoredPlayers.has(a.id);
      const isBFavored = favoredPlayers.has(b.id);

      if (isAFavored && !isBFavored) return -1;
      if (!isAFavored && isBFavored) return 1;
      return 0;
    });

  return (
    <div className="container21">
      <div className="header71">
        <button className="back-button" onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </button>
        <div className="title20">선수단</div>
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

      <div className="player-count">
        {filteredPlayers.length}명
      </div>

      <ul className="player-list">
        {filteredPlayers.map((player) => (
          <li
            key={player.id}
            className="player-item"
            onClick={() => handlePlayerClick(player)}
          >
            <img src={player.image} alt={player.name} width="50" />
            <div className="player-info">
              <div className="player-name">
                {player.name}
                {player.position && (
                  <div className="player-role">{player.position}</div>
                )}
                <div
                  className="favorite-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(player.id);
                  }}
                >
                  {favoredPlayers.has(player.id) ? (
                    <StarRateRoundedIcon />
                  ) : (
                    <StarBorderRoundedIcon />
                  )}
                </div>
              </div>
              <div className="player-id">{player.back_number}</div>
              <div className="player-position">{player.position}</div>
            </div>
          </li>
        ))}
      </ul>

      {selectedPlayer && (
        <div id="playerModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-header">
              <img src={selectedPlayer.image} alt={selectedPlayer.name} className="modal-image" />
              <div className="modal-info">
                <h2 className="modal-name">{selectedPlayer.name}</h2>
                <a href="#" className="cheer-link">응원가 바로가기 &gt;</a>
                <div className="modal-number">
                  <span style={{fontFamily: 'Pretendard-SemiBold'}}>등번호</span>
                  <span style={{ marginLeft: '30px', fontFamily:'Pretendard-Medium', color:'#767676' }}>
                    No.{selectedPlayer.back_number}
                  </span>
                </div>
                <div className="modal-position">
                  <span style={{fontFamily: 'Pretendard-SemiBold'}}>포지션</span>
                  <span style={{ marginLeft: '30px', fontFamily:'Pretendard-Medium', color:'#767676' }}>
                    {selectedPlayer.position}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-details">
              <div className="modal-detail-item">
                <span style={{fontFamily: 'Pretendard-SemiBold'}}>생년월일</span>
                <span style={{ marginLeft: '36px', fontFamily:'Pretendard-Medium', color:'#767676' }}>
                  {selectedPlayer.birth}
                </span>
              </div>
              <div className='line10'></div>
              <div className="modal-detail-item">
                <span style={{fontFamily: 'Pretendard-SemiBold'}}>입단</span>
                <span style={{ marginLeft: '63px', fontFamily:'Pretendard-Medium', color:'#767676' }}>
                  {selectedPlayer.join_date}
                </span>
              </div>
              <div className='line10'></div>
              <div className="modal-detail-item">
                <span style={{fontFamily: 'Pretendard-SemiBold'}}>신장</span>
                <span style={{ marginLeft: '63px', fontFamily:'Pretendard-Medium', color:'#767676' }}>
                  {selectedPlayer.height} cm
                </span>
              </div>
              <div className='line10'></div>
              <div className="modal-detail-item">
                <span style={{fontFamily: 'Pretendard-SemiBold'}}>체중</span>
                <span style={{ marginLeft: '63px', fontFamily:'Pretendard-Medium', color:'#767676' }}>
                  {selectedPlayer.weight} kg
                </span>
              </div>
              <div className='line10'></div>
              <div className="modal-detail-item">
                <span style={{fontFamily: 'Pretendard-SemiBold'}}>인스타그램</span>
                <span style={{ marginLeft: '18px', fontFamily:'Pretendard-Medium', color:'#767676' }}>
                  <a href={`https://www.instagram.com/${selectedPlayer.instagram}`} target="_blank" rel="noopener noreferrer">
                    @{selectedPlayer.instagram}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
