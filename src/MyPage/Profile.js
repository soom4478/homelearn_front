import React, { useState, useEffect, useRef, useContext } from 'react';
import './Profile.css';
import ClearIcon from '@mui/icons-material/Clear';
import defaultProfileImage from '../image/Profile.png';  
import picture from '../image/picture.png';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { UserContext } from '../UserContext'; // UserContext import 추가
import axios from 'axios'; // Axios import 추가

function Profile() {
  const { name: contextName, setName, team_id, setTeam_id, image_url, setImage_url } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(image_url || defaultProfileImage);
  const [name, setNameState] = useState(contextName);
  const [team, setTeam] = useState(team_id);
  const [showImageActions, setShowImageActions] = useState(false);
  const imageContainerRef = useRef(null);
  const imageActionsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setProfileImage(image_url);
    setNameState(contextName);
    setTeam(team_id);
  }, [image_url, contextName, team_id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setImage_url(reader.result);
        localStorage.setItem('profileImage', reader.result);
        setShowImageActions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefaultImage = () => {
    setProfileImage(defaultProfileImage);
    setImage_url(defaultProfileImage);
    localStorage.setItem('profileImage', defaultProfileImage);
    setShowImageActions(false);
  };

  const handleNameChange = (event) => {
    setNameState(event.target.value);
  };

  // 사용자의 이름과 일치하는 사용자 ID를 백엔드에서 찾아오는 함수
  const fetchUserIdByName = async (inputName) => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY; // API 키 설정
      const { data: users } = await axios.get(`http://localhost:5000/api/users/${process.env.REACT_APP_API_KEY}`);

      // 입력된 이름과 일치하는 사용자를 찾음
      const matchedUser = users.find(user => user.name === inputName);

      if (matchedUser) {
        return matchedUser.id; // 사용자의 ID 반환
      } else {
        console.error('해당 이름의 사용자를 찾을 수 없습니다.');
        return null;
      }
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      return null;
    }
  };

  const handleConfirm = async () => {
    try {
      // 입력된 이름과 일치하는 사용자의 ID를 가져옴
      const userId = await fetchUserIdByName(contextName);

      if (userId) {
        // 업데이트할 사용자 정보
        const updatedUser = {
          name,  // 새로운 이름
          team_id: team,  // 새로운 팀 ID
          image_url: profileImage,  // 새로운 프로필 이미지
        };

        // 사용자 정보 업데이트 요청
        await axios.put(`http://3.138.127.122:5000/api/users/${process.env.REACT_APP_API_KEY}/${userId}`, updatedUser);
        console.log('사용자 정보 업데이트 성공');

        // Context와 localStorage 업데이트
        setName(name);
        setTeam_id(team);
        localStorage.setItem('name', name);
        localStorage.setItem('team', team);

        // 업데이트 완료 후 '/my' 페이지로 이동
        navigate('/my');
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류 발생:', error);
    }
  };

  const toggleImageActions = () => {
    setShowImageActions(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      imageContainerRef.current &&
      !imageContainerRef.current.contains(event.target) &&
      imageActionsRef.current &&
      !imageActionsRef.current.contains(event.target)
    ) {
      setShowImageActions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <ClearIcon className="clear-icon" onClick={() => navigate('/my')} />
        <span className="edit-profile-text">프로필 편집</span>
        <button className="confirm-button" onClick={handleConfirm}>완료</button>
      </div>

      <div className="profile-body">
        <div className="profile-image-container" ref={imageContainerRef}>
          <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
            onClick={toggleImageActions}
          />
          <img src={picture} alt="picture" className="picture" />
          {showImageActions && (
            <div className="image-actions" ref={imageActionsRef}>
              <button className="image-action-button" onClick={resetToDefaultImage}>
                기본이미지로 변경
              </button>
              <label className="image-action-button">
                갤러리에서 이미지 넣기
                <input
                  type="file"
                  id="image-input"
                  className="image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}
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
