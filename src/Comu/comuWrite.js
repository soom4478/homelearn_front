import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./comuWrite.css";
import returnIcon from "../image/xIcon.png";

const BaseballCommunityPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { baseballCommunityId } = location.state || { baseballCommunityId: 1 };

  const [newPost, setNewPost] = useState({
    user_id: 111,
    baseball_community_id: baseballCommunityId,
    title: '',
    content: '',
    image_url: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleCompleteClick = async () => {
    if (newPost.title.trim() !== '' && newPost.content.trim() !== '') {
      const postToCreate = {
        ...newPost,
        user_id: 111,
        baseball_community_id: baseballCommunityId,
        like_num: 0,
        comments_num: 0
      };

      try {
        await axios.post('http://localhost:4000/api/post/6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1', postToCreate);
        navigate(-1); // Go back
      } catch (error) {
        console.error('게시물 생성 중 오류 발생:', error);
        alert('게시물 생성 중 오류가 발생했습니다.');
      }
    } else {
      alert("제목과 내용을 모두 입력하세요.");
    }
  };

  const handleReturnClick = () => {
    navigate(-1); // Go back
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
              <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} /> {/* Add click event handler */}
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
