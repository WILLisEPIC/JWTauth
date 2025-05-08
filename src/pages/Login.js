import { useState, useEffect } from 'react';
import '../App.css'
import { FaEye} from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Login() {

    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [username_error, setUsernameError] = useState('');
    const [password_error, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError('')
        setPasswordError('')
        if(username === '' && password === ''){
            setUsernameError('*Please enter username');
            setPasswordError('*Please enter password');
        } if(username === ''){
            setUsernameError('*Please enter username');
        } else if (password === '') {
            setPasswordError('*Please enter password');
        } else {
            const res = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                navigate('/home');
            } else {
                setPasswordError(data.message);
            }
        }
    };

    useEffect(() => {
        const checkToken = () =>{
            const token = localStorage.getItem('token');

            if (token) {
                navigate('/home');
            }
        }
        checkToken();
    }, [navigate]);

    return(
        <div className='main-background'>
            <div className='login'>
                <h1>Login to your account</h1>
                <form onSubmit={handleSubmit}>
                    <div className='textbox'>
                        <label>Username</label>
                        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <p className='error'>{username_error}</p>
                    </div>
                    <div className='textbox-pass'>
                        <label>Password</label>
                        <div className='password-input'>
                            <input type={visible?'text':'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <button type='button' onClick={()=> setVisible(!visible)}>{visible?<FaEyeSlash size={20}/>:<FaEye size={20}/>}</button>
                        </div>
                        <p className='error'>{password_error}</p>
                    </div>
                    <button type='submit'>Login</button>
                </form>
                <div className='link'>
                    <p>New User?</p>
                    <a href='/register'>Create new account.</a>
                </div>
            </div>
        </div>
    );
}

export default Login;