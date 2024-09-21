import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './calendar.css';
import returnIcon from "../image/return.png";
import CalenderImfo from "./calenderImfo"; // Import CalenderImfo
import CalendarDetail from "./calendarDetail";

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const generateCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar = [];
  let week = [];

  for (let i = 0; i < firstDay; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    calendar.push(week);
  }

  return calendar;
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState({ month: null, day: null });
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendar = generateCalendar(year, month);
  const navigate = useNavigate();
  const calendarDetailRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/game/6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1');
        setGames(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value, 10);
    setCurrentDate(new Date(year, selectedMonth, 1));
  };

  const handleReturnClick = () => {
    navigate(-1);
  };

  const handleDayClick = (month, day) => {
    setSelectedDate({ month, day });
  };

  const handleClickOutside = (event) => {
    if (calendarDetailRef.current && !calendarDetailRef.current.contains(event.target)) {
      setSelectedDate({ month: null, day: null });
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPlayCount = (month, day) => {
    return games.filter(game => {
      const [gameMonth, gameDay] = game.game_date.split('(')[0].split('.');
      return parseInt(gameMonth, 10) === month && parseInt(gameDay, 10) === day;
    }).length;
  };

  return (
    <div className='calender-containerA'>
      <div className="calendar-container">
        <div className='calender-con'>
          <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} />
          <p id='calender-title'>야구달력</p>
        </div>
        <div className="calendar-header">
          <span className='year-con'>{year}</span>
          <select className="month-drop" value={month} onChange={handleMonthChange}>
            {months.map((monthName, index) => (
              <option key={index} value={index}>{monthName}</option>
            ))}
          </select>
        </div>
        <div className="calendar-days">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="calendar-day">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {calendar.map((week, weekIndex) => (
            week.map((day, dayIndex) => {
              const playCount = getPlayCount(month + 1, day);
              const myInfo = CalenderImfo.find(info => info.month === month + 1 && info.day === day && info.my);
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="calendar-cell"
                  onClick={() => handleDayClick(month + 1, day)}
                >
                  <p className='calendar-day'>{day}</p>
                  {playCount > 0 && (
                    <div className='playCon'>
                      <span id='playText'>경기</span>
                      <span id='playNum'>{playCount}</span>
                    </div>
                  )}
                  {myInfo && (
                    <div className='myCon'>
                      <span id='myText'>{myInfo.detail}</span>
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
      {selectedDate.month && selectedDate.day && (
        <div ref={calendarDetailRef}>
          <CalendarDetail month={selectedDate.month} day={selectedDate.day} />
        </div>
      )}
    </div>
  );
};

export default Calendar;
