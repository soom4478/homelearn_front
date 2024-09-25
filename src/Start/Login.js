import React, { useState, useEffect, useRef, useContext } from 'react';
import './Login.css';
import defaultProfileImage from '../image/Profile.png';  
import picture from '../image/picture.png';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { UserContext } from '../UserContext';  
import axios from 'axios';  
import { TeamNum } from '../Comu/team_num';  

const apikey = process.env.REACT_APP_API_KEY;


const Login = () => {
    const [profileImage, setProfileImage] = useState(defaultProfileImage);
    const [localName, setLocalName] = useState('');
    const [team, setTeam] = useState('');
    const [showImageActions, setShowImageActions] = useState(false);
    const imageContainerRef = useRef(null);
    const imageActionsRef = useRef(null);
    const navigate = useNavigate();
    const { setName, setImage_url } = useContext(UserContext);

    const Rest_api_key = process.env.REACT_APP_KAKAO_REST_API_KEY; // REST API KEY
    const redirect_uri = 'http://3.138.127.122:5000/auth/call'; // Redirect URI
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    useEffect(() => {
        const savedProfileImage = localStorage.getItem('profileImage');
        const savedName = localStorage.getItem('name');
        const savedTeam = localStorage.getItem('team');

        if (savedProfileImage) setProfileImage(savedProfileImage);
        if (savedName) setLocalName(savedName);
        if (savedTeam) setTeam(savedTeam);
    }, []);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
            handleKakaoLogin(code);
        } else if (window.Kakao) {
            window.Kakao.init(Rest_api_key); // 카카오 API 키 초기화
        }
    }, []);

    const handleKakaoLogin = async (code) => {
        try {
            const response = await axios.post(`http://3.138.127.122:5000/api/kakao/${apikey}`, { code });
            const { id, properties } = response.data;
            const { nickname, profile_image } = properties;

            // 로컬 스토리지에 사용자 정보 저장
            localStorage.setItem('name', nickname);
            localStorage.setItem('profileImage', profile_image);
            localStorage.setItem('kakaoId', id);

            setLocalName(nickname);
            setProfileImage(profile_image);
            setImage_url(profile_image);
            setTeam(''); // 팀 초기화

            // 정보 입력 후 Home으로 이동
            navigate('/Home'); // 여기서 바로 홈으로 이동

        } catch (error) {
            console.error('Error fetching user info:', error);
            alert('로그인 실패! 다시 시도해 주세요.');
        }
    };

    const handleConfirm = async () => {
        if (!localName || !team) {
            alert('이름과 팀을 모두 입력해 주세요.');
            return;
        }

        try {
            const kakaoId = localStorage.getItem('kakaoId');
            const profileImage = localStorage.getItem('profileImage');

            setName(localName);  // UserContext에 name 저장
            
            const selectedTeam = TeamNum.find(t => t.team_name === team);
            localStorage.setItem('team', team);

            const response = await axios.post(`http://3.138.127.122:5000/api/user/${process.env.REACT_APP_API_KEY}`, {
                kakaoId: kakaoId,
                name: localName,
                baseball_team_name: selectedTeam ? selectedTeam.team_name : null,
                image_url: profileImage 
            });
            
            const userId = response.data.id; // API 응답에서 사용자 ID 가져오기
            localStorage.setItem('userId', userId); // 로컬 스토리지에 사용자 ID 저장

            console.log('백엔드 응답:', response.data);

            // 성공 시 페이지 이동
            navigate('/Home'); 
        } catch (error) {
            console.error('데이터 전송 중 오류 발생:', error);
            alert('데이터 전송 중 오류 발생. 다시 시도해 주세요.');
        }
    };

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
        setLocalName(event.target.value);
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
            <div className="login-body">
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

                <div className="input-group2">
                    <div className="name2">이름</div>
                    <label htmlFor="name-input"></label>
                    <input
                        type="text"
                        id="name-input"
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
                    <FormControl fullWidth sx={{ minWidth: 310, fontFamily: 'Pretendard-Medium' }}>
                        <InputLabel id="team-select-label" sx={{ fontFamily: 'Pretendard-Medium' }}></InputLabel>
                        <Select
                            labelId="team-select-label"
                            id="team-select"
                            value={team}
                            label=""
                            onChange={(event) => setTeam(event.target.value)}
                            sx={{ 
                                backgroundColor: 'white', 
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
                            {TeamNum.map((item) => (
                                <MenuItem key={item.team_num} value={item.team_name} sx={{ fontFamily: 'Pretendard-Medium' }}>
                                    {item.team_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <button className="confirm-button" onClick={handleConfirm}>
                    확인
                </button>
                <button className="kakao-login-button" onClick={() => window.location.href = kakaoURL}>
                    카카오 로그인
                </button>
            </div>
        </div>
    );
}

export default Login;
