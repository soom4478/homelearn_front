import React, { useState, useEffect, useRef, useContext } from 'react';
import './Login.css';
import defaultProfileImage from '../image/Profile.png';  
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { UserContext } from '../UserContext';  
import axios from 'axios';  
import { TeamNum } from '../Comu/team_num';  
import Profile from '../image/Profile.png'; // 기본 이미지로 사용할 프로필 이미지

const apikey = process.env.REACT_APP_API_KEY;

const Login = () => {
    const [localName, setLocalName] = useState('');
    const [team, setTeam] = useState('');
    const navigate = useNavigate();
    const { setName } = useContext(UserContext);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');

        if (code) {
            handleKakaoLogin(code);
        } else {
            loadSavedUserInfo();
        }
    }, []);

    const loadSavedUserInfo = () => {
        const savedName = localStorage.getItem('name');
        const savedTeam = localStorage.getItem('team');

        if (savedName) setLocalName(savedName);
        if (savedTeam) setTeam(savedTeam);
    };

    const handleKakaoLogin = async (code) => {
        try {
            const response = await axios.post(`http://3.138.127.122:5000/api/user/${apikey}`, { code });
            const { kakaoId, name } = response.data;

            localStorage.setItem('kakaoId', kakaoId);
            localStorage.setItem('name', name);

            setName(name);
        } catch (error) {
            console.error('카카오 로그인 처리 중 오류 발생:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const handleConfirm = async () => {
        if (!localName || !team) {
            alert('이름과 팀을 모두 입력해 주세요.');
            return;
        }

        try {
            const kakaoId = localStorage.getItem('kakaoId');

            setName(localName);
            localStorage.setItem('team', team);
            localStorage.setItem('kakaoId', kakaoId);

            const response = await axios.post(`http://3.138.127.122:5000/api/user/${apikey}`, {
                kakaoId,
                name: localName,
                baseball_team_name: team,
                image_url: Profile // 기본 이미지 사용
            });
            
            const userId = response.data.id; 
            localStorage.setItem('userId', userId);

            navigate('/Home'); 
        } catch (error) {
            console.error('데이터 전송 중 오류 발생:', error);
            alert('데이터 전송 중 오류 발생. 다시 시도해 주세요.');
        }
    };

    const handleNameChange = (event) => {
        setLocalName(event.target.value);
    };

    return (
        <div className="profile-container">
            <div className="login-body">
                <div className="profile-image-container">
                    <img
                        src={Profile} // 기본 이미지로 설정
                        alt="Profile"
                        className="profile-image"
                    />
                </div>

                <div className="input-group2">
                    <div className="name2">이름</div>
                    <input
                        type="text"
                        className="name-input"
                        placeholder="이름을 입력하세요"
                        value={localName}
                        onChange={handleNameChange}
                    />
                </div>

                <div className="input-group">
                    <div className="team2">
                        MY 팀
                        <span className="team-description">응원하는 구단을 선택해주세요</span>
                    </div>
                    <FormControl fullWidth>
                        <InputLabel id="team-select-label"></InputLabel>
                        <Select
                            labelId="team-select-label"
                            id="team-select"
                            value={team}
                            onChange={(event) => setTeam(event.target.value)}
                        >
                            {TeamNum.map((item) => (
                                <MenuItem key={item.team_num} value={item.team_name}>
                                    {item.team_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="button-container">
                    <button className="confirm-button" onClick={handleConfirm}>
                        확인
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Login;
