import React, { useEffect } from 'react';
import axios from 'axios';

const SocialKakao = () => {
    const Rest_api_key = '93513cf3a9d97f46448330edfe47e62e'; // REST API KEY
    const redirect_uri = 'http://localhost:3000/auth/call'; // Redirect URI
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    const handleLogin = () => {
        window.location.href = kakaoURL;
    };

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
            axios.post('http://localhost:4000/api/kakao', { code })
                .then(response => {
                    console.log('User Info:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching user info:', error);
                });
        }
    }, []);

    return (
        <div>
            <button onClick={handleLogin}>카카오 로그인</button>
        </div>
    );
};

export default SocialKakao;
