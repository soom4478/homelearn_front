import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SocialKakao = () => {
    const Rest_api_key = '93513cf3a9d97f46448330edfe47e62e'; // REST API KEY
    const redirect_uri = 'http://3.138.127.122:5000/auth/call'; // Redirect URI
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
    const navigate = useNavigate();

    const handleLogin = () => {
        window.location.href = kakaoURL;
    };

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
            axios.post('http://3.138.127.122:5000/api/kakao', { code })
                .then(response => {
                    console.log('User Info:', response.data);

                    // 예: 필요한 사용자 정보 추출
                    const { id, properties } = response.data;
                    const { nickname, profile_image } = properties;

                    // 로컬 스토리지에 사용자 정보 저장
                    localStorage.setItem('name', nickname);
                    localStorage.setItem('profileImage', profile_image);
                    localStorage.setItem('kakaoId', id);

                    // 사용자 정보를 서버로 전송하여 DB에 저장
                    return axios.post(`http://3.138.127.122:5000/api/user/${process.env.REACT_APP_API_KEY}`, {
                        kakaoId: id,
                        name: nickname,
                        image_url: profile_image
                    });
                })
                .then(() => {
                    // 로그인 성공 시 localhost:3000/login으로 이동
                    navigate('/login'); 
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                });
        }
    }, [navigate]);

    return (
        <div>
            <button onClick={handleLogin}>카카오 로그인</button>
        </div>
    );
};

export default SocialKakao;
