import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./comuDetail.css";
import returnIcon from "../image/return.png";
import heartIcon1 from "../image/heart_empty.png";
import heartIcon2 from "../image/heart_full.png";
import comuIcon from "../image/comuIcon.png";
import dotIcon from "../image/dotIcon.png";
import dotIcon2 from "../image/dotIcon2.png";
import { commentImfo, addComment } from './commentImfo';
import axios from 'axios';

const ComuDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {}; // location.state가 null인 경우를 처리

    const [item, setItem] = useState(null);
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([...commentImfo]);
    const [isHearted, setIsHearted] = useState(false);
    const [heartCount, setHeartCount] = useState(0);

    useEffect(() => {
        if (id) {
            const fetchItem = async () => {
                try {
                    const response = await axios.get(`http://localhost:4000/api/post/your-api-key/${id}`);
                    setItem(response.data);
                    setHeartCount(response.data.like_num);
                } catch (error) {
                    console.error('데이터 불러오기 중 오류 발생:', error);
                }
            };

            fetchItem();
        }
    }, [id]);

    useEffect(() => {
        if (item) {
            const heartedStatus = localStorage.getItem(`isHearted_${item.id}`);
            if (heartedStatus) {
                setIsHearted(JSON.parse(heartedStatus));
            }
        }
    }, [item]);

    const handleReturnClick = () => {
        navigate(-1); // 뒤로 이동
    };

    const handleCommentClick = () => {
        setIsCommenting(true); // 상태 변경
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && commentText.trim() !== '') {
            const formatDate = (date) => {
                const year = String(date.getFullYear()).slice(2);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}.${month}.${day}`;
            };
    
            const newComment = {
                id: item.id,
                name: '사용자 이름', // 실제 사용자 이름으로 대체
                time: formatDate(new Date()), // 원하는 형식으로 날짜 포맷
                comment: commentText
            };
            setComments([...comments, newComment]);
            addComment(newComment);
            setCommentText('');
            setIsCommenting(false);
        }
    };

    const handleHeartClick = async () => {
        const newHeartedStatus = !isHearted;
        setIsHearted(newHeartedStatus);
        localStorage.setItem(`isHearted_${item.id}`, JSON.stringify(newHeartedStatus));
        const newHeartCount = newHeartedStatus ? heartCount + 1 : heartCount - 1;
        setHeartCount(newHeartCount);
    
        try {
            console.log('좋아요 수 업데이트를 위한 PUT 요청을 보내는 중...');
            await axios.put(`http://localhost:4000/api/post/6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1/${item.id}`, {
                like_num: newHeartCount
            });
            console.log('PUT 요청 성공.');
        } catch (error) {
            console.error('좋아요 업데이트 중 오류 발생:', error);
        }
    };

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div className='comuDcon1'>
            <div className='comuTcon'>
                <div className="foodDcon2">
                    <div className='calender-con'>
                        <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} /> {/* 클릭 이벤트 핸들러 추가 */}
                        <p id='foodDetail-title'>{item.title}</p>
                    </div>
                </div>
            </div>
            <div className='comuDcon2'>
                <div className='comuDcon3'>
                    <div className='comuProfile'></div>
                    <div className='comuUser'>
                        <p id='uname'>{item.user_id}</p>
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
            <div className='commentBcon'>
                <span id='commentBtn' onClick={handleCommentClick}>댓글 쓰기</span>
            </div>
            {isCommenting ? (
                <div className='commentWrite'>
                    <textarea
                        id='commentBox'
                        placeholder="댓글을 입력하세요"
                        value={commentText}
                        onChange={handleCommentChange}
                        onKeyPress={handleKeyPress}
                    ></textarea>
                </div>
            ) : (
                <div className='comuDcon5'>
                    {comments.filter(comment => comment.id === item.id).map((comment, index) => (
                        <div className='comuDcon8' key={index}>
                            <div className='comuDcon6'>
                                <div className='cmtCon'>
                                    <div className='comuDcon7'></div>
                                    <div className='comuProfile2'></div>
                                    <div className='comuUser'>
                                        <p id='uname'>{comment.name}</p>
                                        <p id='utime'>{comment.time}</p>
                                    </div>
                                    <img id='dotIcon2' src={dotIcon2} alt="dotIcon2" />
                                </div>
                                <p id='cmtText'>{comment.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComuDetail;
