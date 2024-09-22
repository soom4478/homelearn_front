import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Test = () => {
    const [billboard, setBillboard] = useState({ image: null, text: '' });
    const [error, setError] = useState(null);
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    const apiKey = '6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1'; // 여기에 API 키를 입력하세요

    useEffect(() => {
        const fetchBillboard = async () => {
            try {
                const response = await axios.get(`http://3.138.127.122:5000/api/billboard/${apiKey}`);
                setBillboard(response.data);
            } catch (error) {
                setError('Failed to fetch billboard data');
            }
        };

        fetchBillboard();
    }, [apiKey]);

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('text', text);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post(`http://3.138.127.122:5000/api/billboard/update/${apiKey}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setBillboard(response.data.billboard);
        } catch (error) {
            console.error('Error updating billboard:', error.response ? error.response.data : error.message);
            setError('Failed to update billboard');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Billboard</h1>
            {billboard.image && <img src={billboard.image} alt="Billboard" />}
            <p>{billboard.text}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Text:
                        <input type="text" value={text} onChange={handleTextChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Image:
                        <input type="file" onChange={handleImageChange} />
                    </label>
                </div>
                <button type="submit">Update Billboard</button>
            </form>
        </div>
    );
};

export default Test;
