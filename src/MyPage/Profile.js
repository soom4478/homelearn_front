import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import ClearIcon from '@mui/icons-material/Clear';
import defaultProfileImage from '../image/Profile.png';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { UserContext } from '../UserContext'; // UserContext import 추가
import axios from 'axios'; // Axios import 추가

function Profile() {
  const { name: contextName, setName, team_id, setTeam_id } = useContext(UserContext); // userId 제거
  const [profileImage] = useState(defaultProfileImage); // 기본 이미지 사용
  const [name, setNameState] = useState(contextName);
  const [team, setTeam] = useState(team_id);
  const [userId, setUserId] = useState(null); // userId 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 userId 가져오기
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    // 상태 업데이트
    setNameState(contextName);
    setTeam(team_id);
  }, [contextName, team_id]);

  const handleConfirm = async () => {
    try {
      // 업데이트할 사용자 정보
      const updatedUser = {
        name,  // 새로운 이름
        team_id: team,  // 새로운 팀 ID
        image_url: null,  // 기본 프로필 이미지
      };

      // 사용자 정보 업데이트 요청
      await axios.put(`http://3.138.127.122:5000/api/user/${process.env.REACT_APP_API_KEY}/${userId}`, updatedUser);
      console.log('사용자 정보 업데이트 성공');

      // Context와 localStorage 업데이트
      setName(name);
      setTeam_id(team);
      localStorage.setItem('name', name);
      localStorage.setItem('team', team);

      // 업데이트 완료 후 '/my' 페이지로 이동
      navigate('/my');
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류 발생:', error);
    }
  };

  const handleNameChange = (event) => {
    setNameState(event.target.value);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <ClearIcon className="clear-icon" onClick={() => navigate('/my')} />
        <span className="edit-profile-text">프로필 편집</span>
        <button className="confirm-button" onClick={handleConfirm}>완료</button>
      </div>

      <div className="profile-body">
        <div className="profile-image-container">
          <img
            src={profileImage} // 기본 이미지로 설정
            alt="Profile"
            className="profile-image"
          />
        </div>

        <div className="input-group">
          <div className="name2">이름</div>
          <label htmlFor="name-input"></label>
          <input
            type="text"
            id="name-input"
            className="name-input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div className="input-group">
          <div className="team2">MY 팀</div>
          <FormControl fullWidth sx={{ minWidth: 120, fontFamily: 'Pretendard-Medium' }}>
            <InputLabel id="team-select-label" sx={{ fontFamily: 'Pretendard-Medium' }}></InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              value={team}
              label=""
              onChange={(event) => setTeam(event.target.value)}
              sx={{ 
                backgroundColor: '#E8ECEF', 
                color: '#333', 
                border: '0px solid #E8ECEF',
                fontFamily: 'Pretendard-Medium',
                '& .MuiSelect-icon': {
                  color: 'white',
                },
                '&:focus': {
                  border: '1px solid #E8ECEF',
                }
              }}
            >
              <MenuItem value="KIA 타이거즈" sx={{ fontFamily: 'Pretendard-Medium' }}>KIA 타이거즈</MenuItem>
              <MenuItem value="두산 베어스" sx={{ fontFamily: 'Pretendard-Medium' }}>두산 베어스</MenuItem>
              <MenuItem value="롯데 자이언츠" sx={{ fontFamily: 'Pretendard-Medium' }}>롯데 자이언츠</MenuItem>
              <MenuItem value="삼성 라이온즈" sx={{ fontFamily: 'Pretendard-Medium' }}>삼성 라이온즈</MenuItem>
              <MenuItem value="SSG 랜더스" sx={{ fontFamily: 'Pretendard-Medium' }}>SSG 랜더스</MenuItem>
              <MenuItem value="LG 트윈스" sx={{ fontFamily: 'Pretendard-Medium' }}>LG 트윈스</MenuItem>
              <MenuItem value="키움 히어로즈" sx={{ fontFamily: 'Pretendard-Medium' }}>키움 히어로즈</MenuItem>
              <MenuItem value="KT wiz" sx={{ fontFamily: 'Pretendard-Medium' }}>KT wiz</MenuItem>
              <MenuItem value="한화 이글스" sx={{ fontFamily: 'Pretendard-Medium' }}>한화 이글스</MenuItem>
              <MenuItem value="NC 다이노스" sx={{ fontFamily: 'Pretendard-Medium' }}>NC 다이노스</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}

export default Profile;
