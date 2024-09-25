import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./comuWrite.css";
import returnIcon from "../image/xIcon.png";

const apikey = process.env.REACT_APP_API_KEY;

const BaseballCommunityPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { baseballCommunityId } = location.state || { baseballCommunityId: 1 };

  const [newPost, setNewPost] = useState({
    baseball_community_id: baseballCommunityId,
    title: '',
    user_id: '', // 초기값을 빈 문자열로 설정
    content: '',
    image_url: '',
  });

  // 로컬 스토리지에서 userId를 가져와서 상태 업데이트
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('로컬 스토리지에서 가져온 userId:', userId); // 디버깅용 로그
    if (userId) {
      setNewPost(prevState => ({
        ...prevState,
        user_id: userId // userId를 newPost의 user_id에 반영
      }));
    } else {
      alert("사용자 ID가 유효하지 않습니다. 로그인해 주세요.");
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [navigate, baseballCommunityId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleCompleteClick = async () => {
    if (newPost.title.trim() !== '' && newPost.content.trim() !== '') {
      const postToCreate = {
        ...newPost
      };

      console.log('게시물 작성 데이터:', postToCreate); // 디버깅용 로그

      try {
        const response = await axios.post(`http://3.138.127.122:5000/api/post/${apikey}`, postToCreate);
        console.log(response.data); // 서버 응답 로그

        navigate(-1); // 이전 페이지로 돌아가기
      } catch (error) {
        console.error('게시물 생성 중 오류 발생:', error);
        alert('게시물 생성 중 오류가 발생했습니다.');
      }
    } else {
      alert("제목과 내용을 모두 입력하세요.");
    }
  };

  const handleReturnClick = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <div>
      <div className='comuWcon1'>
        <div className='comuTcon'>
          <div className="comuWcon2">
            <div className='calender-con'>
              <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} />
              <span id='foodDetail-title'>게시물 작성</span>
              <span id='complete' onClick={handleCompleteClick}>완성</span>
            </div>
          </div>
        </div>
        <div className='comuWcon3'>
          <input className='titleInput' type="text" placeholder="제목을 입력하세요" name="title" value={newPost.title} onChange={handleInputChange}></input>
          <textarea className='textInput' type="text" placeholder="야구를 사랑하는 사람들과 소통해요!" name="content" value={newPost.content} onChange={handleInputChange} rows={1} onInput={autoResize}></textarea>
        </div>
      </div>
    </div>
  );
};

export default BaseballCommunityPost;
