import '../App.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [valid, setValid] = useState(null);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    const logout = () =>{
        localStorage.removeItem("token");
        setValid(false);
    }

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setValid(false);
                return;
            }

            try {
                const res = await fetch('http://localhost:4000/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                });

                const data = await res.json();
                setUsername(data.decoded.username);
                setValid(data.valid);
            } catch (err) {
                console.error(err);
                setValid(false);
            }
        };

        checkToken();
    }, []);

    //Redirect to login if token is invalid
    useEffect(() => {
        if (valid === false) {
            localStorage.removeItem("token");
            navigate('/');
        }
    }, [valid, navigate]);

    return (
        <div className='main-background'>
            <div className='validate'>
                {valid === true && (
                    <>
                        <h1>Welcome {username}, Your token is valid</h1>
                        <button type='button' onClick={logout}>Log Out</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;