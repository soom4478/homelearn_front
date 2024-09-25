import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./comuDetail.css";
import returnIcon from "../image/return.png";
import heartIcon1 from "../image/heart_empty.png";
import heartIcon2 from "../image/heart_full.png";
import comuIcon from "../image/comuIcon.png";
import dotIcon from "../image/dotIcon.png";
import dotIcon2 from "../image/dotIcon2.png";
import axios from 'axios';

const apikey = process.env.REACT_APP_API_KEY;

const ComuDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {}; // location.state가 null인 경우를 처리

    const [item, setItem] = useState(null);
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
    const [isHearted, setIsHearted] = useState(false);
    const [heartCount, setHeartCount] = useState(0);

    // 포스트 데이터 가져오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://3.138.127.122:5000/api/post/${apikey}/${id}`);
                setItem(response.data); // 포스트 정보 상태 설정
                setHeartCount(response.data.like_num); // 좋아요 수 초기화
                setIsHearted(response.data.isHearted); // 좋아요 상태 초기화
                console.log(response.data);

                // 포스트의 user_id로 사용자 정보 가져오기
                if (response.data && response.data.user_id) {
                    const userResponse = await axios.get(`http://3.138.127.122:5000/api/user/${apikey}/${response.data.user_id}`);
                    setUser(userResponse.data); // 사용자 정보를 상태에 설정
                } else {
                    console.error("포스트에 user_id가 없습니다."); // user_id가 없는 경우 로그
                }
            } catch (error) {
                console.error("포스트 또는 사용자 정보 가져오는 중 오류 발생:", error);
            }
        };

        fetchPost();
    }, [id]);

    const handleReturnClick = () => {
        navigate(-1); // 뒤로 이동
    };

    const handleHeartClick = async () => {
        const newHeartedStatus = !isHearted;
        setIsHearted(newHeartedStatus);
        const newHeartCount = newHeartedStatus ? heartCount + 1 : heartCount - 1;
        setHeartCount(newHeartCount);

        try {
            await axios.put(`http://3.138.127.122:5000/api/post/${apikey}/${item.id}`, {
                like_num: newHeartCount
            });
        } catch (error) {
            console.error('좋아요 업데이트 중 오류 발생:', error);
        }
    };

    if (!item || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='comuDcon1'>
            <div className='comuTcon'>
                <div className="foodDcon2">
                    <div className='calender-con'>
                        <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} />
                        <p id='foodDetail-title'>{item.title}</p>
                    </div>
                </div>
            </div>
            <div className='comuDcon2'>
                <div className='comuDcon3'>
                    <div className='comuProfile'>
                        {user.profilePic && <img src={user.profilePic} alt="User Profile" className='profilePic' />} {/* 프로필 사진 */}
                    </div>
                    <div className='comuUser'>
                        <p id='uname'>{user.name}</p> {/* 사용자 이름 */}
                        <p id='utime'>2024.05.26</p>
                    </div>
                    <img id='dotIcon1' src={dotIcon} alt="dotIcon1" />
                </div>
                <p id='utext'>{item.content}</p>
                <div className='comuDcon4'>
                    <div className="comuHcon" onClick={handleHeartClick}>
                        <img id="comuH" src={isHearted ? heartIcon2 : heartIcon1} alt="heartIcon" />
                        <p id="comuHtext_2">{heartCount}</p>
                    </div>
                    <div className="comuCcon">
                        <img id="comuC" src={comuIcon} alt="commentIcon" />
                        <p id="comuCtext_2">{item.comments_num}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComuDetail;
