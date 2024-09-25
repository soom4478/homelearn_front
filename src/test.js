// src/Calendar.js
import React, { useState } from 'react';
import axios from 'axios';

const Calendar = () => {
    const [date, setDate] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const getCalendarEntry = async () => {
        const apiKey = process.env.REACT_APP_API_KEY; // 여기에 실제 API 키를 입력하세요
        try {
            const response = await axios.get(`http://3.138.127.122:5000/api/calendar/${apiKey}/calendar/${date}`);
            setResult(JSON.stringify(response.data, null, 2));
            setError('');
        } catch (error) {
            setError('Error fetching entry: ' + error.response.data.error);
            setResult('');
        }
    };

    return (
        <div>
            <h1>Calendar API Example</h1>
            <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="YYYY-MM-DD"
            />
            <button onClick={getCalendarEntry}>Get Calendar Entry</button>
            {result && <pre>{result}</pre>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Calendar;
