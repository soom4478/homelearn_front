import React, { useContext } from 'react';
import { UserContext } from './UserContext';

function Hometest() {
  const { name, team_id, image_url } = useContext(UserContext);

  return (
    <div>
      <h1>환영합니다, {name}님!</h1>
      <p>응원하는 팀: {team_id}</p>
      <img src={image_url} alt="Profile" />
    </div>
  );
}

export default Hometest;
