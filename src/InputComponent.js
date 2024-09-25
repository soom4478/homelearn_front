import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';

function InputComponent() {
  const { kakao_Id, setKakao_Id, id, team_id, name, image_url } = useContext(UserContext);
  const [tempKakaoId, setTempKakaoId] = useState(kakao_Id);

  useEffect(() => {
    const savedKakaoId = localStorage.getItem('kakao_Id');
    if (savedKakaoId) setKakao_Id(savedKakaoId);
  }, [setKakao_Id]);

  const handleSave = (e) => {
    e.preventDefault();
    setKakao_Id(tempKakaoId);
    localStorage.setItem('kakao_Id', tempKakaoId);
  };

  return (
    <form onSubmit={handleSave}>
      <div>
        <input
          type="text"
          value={tempKakaoId}
          onChange={(e) => setTempKakaoId(e.target.value)}
          placeholder="Enter Kakao ID"
        />
        <button type="submit">Save</button>
      </div>
      <div>
        <h2>Output</h2>
        <p><strong>Kakao ID:</strong> {kakao_Id}</p>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Team ID:</strong> {team_id}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Image URL:</strong> {image_url}</p>
      </div>
    </form>
  );
}

export default InputComponent;
