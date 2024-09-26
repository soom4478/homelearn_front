import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import returnIcon from "../image/xIcon.png";
import imgInput from "../image/imgInput.png";
import "./displayWrite.css";

const DisplayWrite = () => {
    const navigate = useNavigate();
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [billboardText, setText] = useState('');
    const [error, setError] = useState('');

    // 컴포넌트가 로드될 때 로컬스토리지에서 이미지와 텍스트 불러오기
    useEffect(() => {
        const storedImage = localStorage.getItem('billboardImage');
        const storedText = localStorage.getItem('billboardText');
        
        if (storedImage) {
            //setImageChanged(true); // 로컬스토리지에서 이미지가 있을 경우 변경된 것으로 설정
            //setBackgroundImage(storedImage);
        }
        if (storedText) {
            setText(storedText);
        }
    }, []);

    const handleReturnClick = () => {
        navigate(-1); // 뒤로 이동
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result; // base64로 변환된 이미지
                setBackgroundImage(base64Image);
                localStorage.setItem('billboardImage', base64Image); // 로컬스토리지에 저장
            };
            reader.readAsDataURL(file); // 이미지를 base64로 변환
        }
    };

    const handleDivClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleTextChange = (event) => {
        const newText = event.target.value;
        setText(newText);
        localStorage.setItem('billboardText', newText); // 텍스트를 로컬스토리지에 저장
        event.target.style.height = 'auto'; // 높이를 자동으로 조정
        event.target.style.height = `${event.target.scrollHeight}px`; // 내용에 맞게 높이 설정

        if (newText.length > 12) {
            setError('텍스트는 12자까지 작성 가능합니다.');
        } else {
            setError('');
        }
    };

    const handleCompleteClick = () => {
        if (billboardText.length > 12) {
            setError('텍스트는 12자까지 작성 가능합니다.');
        } else {
            setError('');
            console.log('완료: ', billboardText); // 완료 시 텍스트를 콘솔에 출력
            navigate(-1); // 완료 후 뒤로 이동
        }
    };

    return (
        <div className='disCon1'>
            <div className='comuTcon'>
                <div className="comuWcon2">
                    <div className='calender-con'>
                        <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} />
                        <span id='foodDetail-title'>전광판 작성</span>
                        <span id='complete' onClick={handleCompleteClick}>완료</span>
                    </div>
                </div>
            </div>
            <div
                className='imgInputCon'
                onClick={handleDivClick}
                style={{ 
                    backgroundImage: `url(${backgroundImage})`, // 배경 이미지 설정
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {!backgroundImage && <img id='imgInput' src={imgInput} alt='imgInput' />}
            </div>
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
            />
            <hr id='disLine' />
            <div className='disCon2'>
                <textarea
                    className='textInput'
                    placeholder="12글자까지 작성해주세요."
                    value={billboardText}
                    onChange={handleTextChange}
                    style={{ overflow: 'hidden' }} // 스크롤바 숨기기
                ></textarea>
                {error && <p className='disError'>{error}</p>} {/* 경고문 표시 */}
            </div>
        </div>
    );
};

export default DisplayWrite;
