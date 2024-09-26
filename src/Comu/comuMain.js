import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { displayInfo } from './displayImfo';
import { TeamNum } from './team_num';
import "./comuMain.css";
import heartIcon from "../image/heartIcon.png";
import commentIcon from "../image/commentIcon.png";
import comuBtn from "../image/comuBtn.png";
import axios from 'axios';
import { UserContext } from '../UserContext';

const apikey = process.env.REACT_APP_API_KEY;

const ComuMain = () => {
    const { team_id } = useContext(UserContext);
    const [selectedIndex, setSelectedIndex] = useState('전체');
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [displayText, setDisplayText] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 게시물 및 전광판 데이터 로드
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://3.138.127.122:5000/api/post/${apikey}`);
                setPosts(response.data);
                const fetchBillboard = async () => {
                        try {
                            // 1. 로컬 스토리지에서 이미지 불러오기
                            const storedImage = localStorage.getItem('billboardImage');
                            const storedText = localStorage.getItem('billboardText');
                
                            setBackgroundImage(storedImage);
                            setDisplayText(storedText);
                        } catch (error) {
                            setError(error);
                        } finally {
                            setLoading(false); // 항상 로딩 상태를 false로 설정
                        }
                    };
                fetchBillboard();
                
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);


    const team = TeamNum.find(team => team.team_num === parseInt(team_id, 10));
    const navItems = ['전체', team ? team.team_name : ''];

    const handleItemClick = (item) => {
        setSelectedIndex(item);
    };

    const handleWriteClick = () => {
        let baseballCommunityId = 0;
        if (selectedIndex !== '전체') {
            const team = TeamNum.find(team => team.team_name === selectedIndex);
            if (team) {
                baseballCommunityId = team.team_num;
            }
        }
        navigate(`/community/write`, { state: { baseballCommunityId } });
    };

    const handleDisplqyClick = () => {
        navigate(`/community/display`);
    };

    const handleComuClick = (id) => {
        navigate(`/community/detail`, { state: { id } });
    };

    const calculateTimeDifference = (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now - createdDate) / 1000);
        const days = Math.floor(diffInSeconds / (3600 * 24));
        const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;

        if (days > 0) {
            return `${days}일 전`;
        } else if (hours > 0) {
            return `${hours}시간 전`;
        } else if (minutes > 0) {
            return `${minutes}분 전`;
        } else if (seconds > 0) {
            return `${seconds}초 전`;
        } else {
            return '방금 전';
        }
    };

    const filteredPosts = posts.filter(post => {
        if (selectedIndex === '전체') {
            return post.baseball_community_id === 0;
        } else {
            const team = TeamNum.find(team => team.team_name === selectedIndex);
            return team && post.baseball_community_id === team.team_num;
        }
    }).reverse();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='comuMcon1'>
            <div className="nav-bar">
                {navItems.map((item, index) => (
                    <div
                        id='comuMcon2'
                        key={index}
                        className={`nav-item ${selectedIndex === item ? 'selected' : ''}`}
                        onClick={() => handleItemClick(item)}
                    >
                        <p>{item}</p>
                    </div>
                ))}
            </div>
            <div
                className='displayCon1'
                style={{ 
                    backgroundImage: `url(${backgroundImage || 'data:image/png;base64,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'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <button className='displayB'>
                    <p onClick={handleDisplqyClick}>전광판 작성하기</p>
                </button>
                <p className='displayText'>{displayText}</p>
            </div>
            <div className='comuMcon3'>
                {filteredPosts.map((item, index) => (
                    <div className="comuCon3_2" key={index}>
                        <div className="comuCon4_2" onClick={() => handleComuClick(item.id)}>
                            <p id="comuT">{item.title}</p>
                            <p id="comuI">{item.content}</p>
                            <p id="comuB">{calculateTimeDifference(item.createdAt)}</p>
                            <div className="comuCon5">
                                <div className="comuHcon">
                                    <img id="comuH" src={heartIcon} alt="heartIcon" />
                                    <p id="comuHtext">{item.like_num}</p>
                                </div>
                                <div className="comuCcon">
                                    <img id="comuC" src={commentIcon} alt="commentIcon" />
                                    <p id="comuCtext">{item.comments_num}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <img id="comuBtn" src={comuBtn} alt="comuBtn" onClick={handleWriteClick} />
        </div>
    );
};

export default ComuMain;
