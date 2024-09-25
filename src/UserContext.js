import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [kakao_Id, setKakao_Id] = useState('');
  const [id, setId] = useState('1');
  const [team_id, setTeam_id] = useState('3');
  const [name, setName] = useState('야구보구싶구');
  const [image_url, setImage_url] = useState('');

  useEffect(() => {
    const savedKakaoId = localStorage.getItem('kakao_Id');
    const savedName = localStorage.getItem('name');
    const savedTeamId = localStorage.getItem('team_id');
    const savedImageUrl = localStorage.getItem('image_url');

    if (savedKakaoId) setKakao_Id(savedKakaoId);
    if (savedName) setName(savedName);
    if (savedTeamId) setTeam_id(savedTeamId);
    if (savedImageUrl) setImage_url(savedImageUrl);
  }, []);

  useEffect(() => {
    localStorage.setItem('kakao_Id', kakao_Id);
    localStorage.setItem('name', name);
    localStorage.setItem('team_id', team_id);
    localStorage.setItem('image_url', image_url);
  }, [kakao_Id, name, team_id, image_url]);

  return (
    <UserContext.Provider value={{ kakao_Id, setKakao_Id, id, setId, team_id, setTeam_id, name, setName, image_url, setImage_url }}>
      {children}
    </UserContext.Provider>
  );
};
