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
import { TeamNum } from '../Comu/team_num';  // TeamNum import 추가

function Login() {
    const [profileImage, setProfileImage] = useState(defaultProfileImage);
    const [localName, setLocalName] = useState('');
    const [team, setTeam] = useState('');
    const [showImageActions, setShowImageActions] = useState(false);
    const imageContainerRef = useRef(null);
    const imageActionsRef = useRef(null);
    const navigate = useNavigate();
    const { setName, setTeam_id, setImage_url } = useContext(UserContext);

    useEffect(() => {
        const savedProfileImage = localStorage.getItem('profileImage');
        const savedName = localStorage.getItem('name');
        const savedTeam = localStorage.getItem('team');

        if (savedProfileImage) setProfileImage(savedProfileImage);
        if (savedName) setLocalName(savedName);
        if (savedTeam) setTeam(savedTeam);
    }, []);

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

    // 서버로 데이터 전송하는 함수
    const handleConfirm = async () => {
        try {
            setName(localName);  // UserContext에 name 저장
            
            // 선택한 팀의 team_num 찾기
            const selectedTeam = TeamNum.find(t => t.team_name === team);

            // LocalStorage에 저장
            localStorage.setItem('name', localName);
            localStorage.setItem('team', team);

            // 백엔드로 데이터 전송
            const response = await axios.post(`http://localhost:5000/api/user/${process.env.REACT_APP_API_KEY}`, {
                name: localName,
                baseball_team_name: selectedTeam.team_name,
                image_url: profileImage// team_num 전송
            });

            console.log('백엔드 응답:', response.data);

            // 성공 시 페이지 이동
            navigate('/Home'); 
        } catch (error) {
            console.error('데이터 전송 중 오류 발생:', error);
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
            </div>
        </div>
    );
}

export default Login;
