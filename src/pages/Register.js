import { useState } from 'react';
import '../App.css'
import { FaEye} from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function Register() {

    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [con_password, setConPassword] = useState('');
    const [username_error, setUsernameError] = useState('');
    const [password_error, setPasswordError] = useState('');
    const [con_password_error, setConPasswordError] = useState('');

    function isStrongPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError('');
        setPasswordError('');
        setConPasswordError('');
        if(username === '' && password === '' && con_password === ''){
            setUsernameError('*Please enter username');
            setPasswordError('*Please enter password');
            setConPasswordError('*Please enter confirm password');
        } else if (username === ''){
            setUsernameError('*Please enter username');
        } else if (password === ''){
            setPasswordError('*Please enter password');
        } else if (con_password === ''){
            setConPasswordError('*Please enter confirm password');
        } else if (!isStrongPassword(password)) {
            setPasswordError('*Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        } else if (password !== con_password){
            setPasswordError('*Passwords are not the same');
            setConPasswordError('*Passwords are not the same');
        } else {
            const res = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await res.json();
            if (res.ok) {
                setConPasswordError(data.message)
            } else {
                setConPasswordError(data.message)
            }
        }
    }

    return(
        <div className='main-background'>
            <div className='register'>
                <h1>Create an account</h1>
                <div className='login-link'>
                    <p>Already have an account?</p>
                    <a href='/'>Login</a>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='textbox'>
                        <label>Username</label>
                        <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                        <p className='error'>{username_error}</p>
                    </div>
                    <div className='textbox-pass'>
                        <label>Password</label>
                        <div className='password-input'>
                            <input type={visible?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)}/>
                            <button type='button' onClick={()=> setVisible(!visible)}>{visible?<FaEyeSlash size={20}/>:<FaEye size={20}/>}</button>
                        </div>
                        <p className='error'>{password_error}</p>
                    </div><div className='textbox-pass'>
                        <label>Confirm-password</label>
                        <div className='password-input'>
                            <input type={visible2?'text':'password'} value={con_password} onChange={(e)=>setConPassword(e.target.value)}/>
                            <button type='button' onClick={()=> setVisible2(!visible2)}>{visible2?<FaEyeSlash size={20}/>:<FaEye size={20}/>}</button>
                        </div>
                        <p className='error'>{con_password_error}</p>
                    </div>
                    <button type='submit'>Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;