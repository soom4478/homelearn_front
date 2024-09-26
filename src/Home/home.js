import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./home.css";
import { dicseptionImfo } from "./dicseptionImfo";
import { explanImfo } from "./explanImfo";
import { comuImfo } from "./comuImfo";
import { Homeground } from "./homeground";
import star from "../image/star_icon.png";
import pizza from "../image/pizza_icon.png";
import calenderI from "../image/calendar.png";
import bell from "../image/bell.png";
import nextRink_icon from "../image/nextRink_icon.png";
import heartIcon from "../image/heartIcon.png";
import commentIcon from "../image/commentIcon.png";

const Home = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null); 
  const [selectedDay, setSelectedDay] = useState(null); 
  const [currentDate, setCurrentDate] = useState(""); 
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    setCurrentDate(`${year}.${month}`);

    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const day = date.getDate().toString().padStart(2, "0");
      const label = daysOfWeek[date.getDay()];
      days.push({ day, label });
    }

    const todayIndex = days.findIndex(day => day.day === today.getDate().toString().padStart(2, "0"));
    setSelectedDayIndex(todayIndex);
    setSelectedDay(today.getDate().toString().padStart(2, "0"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://3.138.127.122:5000/api/game/${process.env.REACT_APP_API_KEY}`);
        setGames(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick1 = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 100);
  };

  const handleReservationClick = () => {
    window.location.href = 'https://www.ticketlink.co.kr/sports/baseball/';
  };

  const handleDayClick = (index, day) => {
    setSelectedDayIndex(index); 
    setSelectedDay(day); 
  };

  const handleCalenderClick = () => {
    navigate("/calender");
  };

  const handleFoodClick = () => {
    navigate("/food");
  };

  const handleNext1Click = () => {
    navigate("/term");
  };

  const handleNext2Click = () => {
    navigate("/rule");
  };

  const handleNext3Click = () => {
    navigate("/community");
  };

  const handleBellClick = () => {
    navigate("/notifications"); // "종" 버튼 클릭 시 /notifications 페이지로 이동
  };

  const handleButtonClick2 = () => {
    window.location.href = 'https://www.ticketlink.co.kr/sports/baseball/schedule#';
  }

  const handleButtonClick = () => {
    handleButtonClick1();
    handleButtonClick2();
  }

  const sortedComuImfo = comuImfo.sort((a, b) => b.comu_heart - a.comu_heart);

  const getDaysOfWeek = () => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();
    const days = [];

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const day = date.getDate().toString().padStart(2, "0");
      const label = daysOfWeek[date.getDay()];
      days.push({ day, label });
    }

    return days;
  };

  const days = getDaysOfWeek();

  const filteredGames = selectedDay
    ? games.filter((game) => game.game_date.includes(selectedDay))
    : games;

  const getGround = (teamHome) => {
    const homeground = Homeground.find((ground) => ground.team === teamHome);
    return homeground ? homeground.ground : "Unknown";
  };

  return (
    <div className="Hcontainer">
      <div className="container3">
        <img id="calenderI" src={calenderI} alt="calenderI" onClick={handleCalenderClick} />
        <img id="bell" src={bell} alt="bell" onClick={handleBellClick} /> {/* 페이지 이동 핸들러 추가 */}
        <p id="today">{currentDate}</p>
        <div className="container4">
          {days.map((item, index) => (
            <div
              className={`dayCon1 ${selectedDayIndex === index ? "day-selected" : ""}`}
              key={index}
              onClick={() => handleDayClick(index, item.day)}
            >
              <div className={`dayCon2 ${selectedDayIndex === index ? "dayCon2-selected" : ""}`}>
                <p id="day">{item.day}</p>
                <p id="day2">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p id="titleText">경기일정</p>
        <nav className="Hnav1">
          <div className="schedule">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              filteredGames.map((game, index) => (
                <div className="scheduleCon" key={index}>
                  <div className="scheduleCon1"></div>
                  <div className="scheduleCon2">
                    <div className="scheduleImfo">
                      <div id="schedule_title">
                        <p id="title_team1">{game.team_away}</p>
                        <p id="title_vs">VS</p>
                        <p id="title_team2">{game.team_home}</p>
                      </div>
                      <p id="time">{game.game_date}</p>
                      <p id="ground">{getGround(game.team_home)}</p>
                      <button
                        id="reservation"
                        className={isClicked ? "clicked" : ""}
                        onClick={handleButtonClick}
                      >
                        <p id="buttonText">바로예매</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </nav>

        <div className="container5" onClick={handleReservationClick}>
          <div id="rinkText">통합예매 바로가기</div>
          <img id="icon1" src={star} alt="star" />
        </div>
        <div className="container6" onClick={handleFoodClick}>
          <div id="rinkText">지금 있는 구장에서<br />먹거리 주문하기</div>
          <img id="icon1" src={pizza} alt="pizza" />
        </div>
      </div>
      <div>
        
      <div className="flex-container">
          <p id="titleText1">야구 백과사전</p>
          <img id="nextrink1" src={nextRink_icon} alt="next" className="align-bottom" onClick={handleNext1Click}/>
        </div>
        <p id="explan">어려운 야구 용어 한눈에 정리!</p>
        <nav className="nav2">
          <div className="con1">
            {dicseptionImfo.map((item, index) => (
              <div className="con2" key={index}>
                <div className="conTop1">
                  <p id="dicseption1">{item.dic_title}</p>
                </div>
                <div className="conBottom1">
                  <div className="conImfo1">
                    <p id="ImfoText1">{item.dic_text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div>
        <div className="flex-container">
          <p id="titleText2">경기 규칙 설명</p>
          <img id="nextrink2" src={nextRink_icon} alt="next" className="align-bottom" onClick={handleNext2Click} />
        </div>
        <nav className="nav2">
          <div className="con3">
            {explanImfo.map((item, index) => (
              <div className="con4" key={index}>
                <div className="conTop2">
                  <p id="dicseption2">{item.explan_title}</p>
                </div>
                <div className="conBottom2">
                  <div className="conImfo2">
                    <div className="numCircle">
                      <p className="number">1</p>
                    </div>
                    <div className="explainCon">
                      <p id="ImfoT1">{item.explanT1}</p>
                      <p id="ImfoT2">{item.explanT2}</p>
                    </div>
                  </div>
                  <div className="conImfo3">
                    <div className="numCircle">
                      <p className="number">2</p>
                    </div>
                    <div className="explainCon">
                      <p id="ImfoT1">{item.explanT3}</p>
                      <p id="ImfoT2">{item.explanT4}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div className="comuCon1">
        <div className="comuCon2">
          <div className="flex-container">
              <p id="titleText3">커뮤니티 인기글</p>
              <img id="nextrink3" src={nextRink_icon} alt="next" className="align-bottom" onClick={handleNext3Click} />
          </div>
          <div className="comuCon3">
              {sortedComuImfo.slice(0, 3).map((item, index) => (
                  <div className="comuCon4" key={index}>
                      <p id="comuT">{item.comu_title}</p>
                      <p id="comuI">{item.comu_text}</p>
                      <p id="comuB">{item.comu_time}</p>
                      <div className="comuCon5">
                        <div className="comuHcon">
                          <img id="comuH" src={heartIcon} alt="heartIcon" />
                          <p id="comuHtext">{item.comu_heart}</p>
                        </div>
                        <div className="comuCcon">
                          <img id="comuC" src={commentIcon} alt="commentIcon" />
                          <p id="comuCtext">{item.comu_commen}</p>
                        </div>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
