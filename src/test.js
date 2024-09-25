import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]); // 사용자 목록
  const [name, setName] = useState(''); // 사용자 이름
  const [team, setTeam] = useState(''); // 응원하는 팀
  const [imageUrl, setImageUrl] = useState(''); // 프로필 이미지 URL
  const [kakaoId, setKakaoId] = useState(''); // 카카오 ID
  const [selectedUserId, setSelectedUserId] = useState(null); // 선택된 사용자 ID
  const apiKey = '6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1'; // API 키

  useEffect(() => {
    fetchUsers();
  }, []);

  // 모든 사용자 가져오기 (GET)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${apiKey}`);
      setUsers(response.data);
    } catch (error) {
      console.error('사용자 목록 조회 중 오류 발생:', error);
    }
  };

  // 사용자 생성하기 (POST)
  const createUser = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/user/${apiKey}`, {
        name,
        baseball_team_name: team,
        image_url: imageUrl,
        kakao_id: kakaoId,
      });
      setUsers([...users, response.data]);
      resetForm(); // 입력 폼 초기화
    } catch (error) {
      console.error('사용자 생성 중 오류 발생:', error);
    }
  };

  // 사용자 업데이트하기 (PUT)
  const updateUser = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/user/${apiKey}/${selectedUserId}`, {
        name,
        baseball_team_name: team,
        image_url: imageUrl,
        kakao_id: kakaoId,
      });
      const updatedUsers = users.map((user) =>
        user.id === selectedUserId ? response.data : user
      );
      setUsers(updatedUsers);
      resetForm();
    } catch (error) {
      console.error('사용자 업데이트 중 오류 발생:', error);
    }
  };

  // 사용자 삭제하기 (DELETE)
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${apiKey}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('사용자 삭제 중 오류 발생:', error);
    }
  };

  // 사용자 선택 시 업데이트를 위한 데이터 채우기
  const selectUser = (user) => {
    setSelectedUserId(user.id);
    setName(user.name);
    setTeam(user.baseball_team_name);
    setImageUrl(user.image_url);
    setKakaoId(user.kakao_id);
  };

  // 폼 초기화
  const resetForm = () => {
    setName('');
    setTeam('');
    setImageUrl('');
    setKakaoId('');
    setSelectedUserId(null);
  };

  return (
    <div>
      <h2>사용자 관리</h2>

      <div>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="응원하는 팀"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
        <input
          type="text"
          placeholder="이미지 URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="카카오 ID"
          value={kakaoId}
          onChange={(e) => setKakaoId(e.target.value)}
        />

        <button onClick={selectedUserId ? updateUser : createUser}>
          {selectedUserId ? '사용자 업데이트' : '사용자 생성'}
        </button>
        <button onClick={resetForm}>초기화</button>
      </div>

      <h3>사용자 목록</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.baseball_team_name} - {user.kakao_id}
            <button onClick={() => selectUser(user)}>수정</button>
            <button onClick={() => deleteUser(user.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;
