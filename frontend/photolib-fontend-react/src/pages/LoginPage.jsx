import React, { useState } from 'react';
import '../App.css';
import LoginFormComponent from '../components/LoginFormComponent';
import LoginUserAsync from '../Utils/DataHelper';

function LoginPage() {
    const [loginStatus, setLoginStatus] = useState(null);
    
    

    function apiCallOnSubmit({username, password}){
        fetchData({user: username, pass: password})
    }

    
    const fetchData = async ({user, pass}) => {
        const [status] = await LoginUserAsync(user, pass);
        setLoginStatus(status.includes('Invalid')?"Incorrect Username or Password":status)
    }
    

    return (
        <div className='LoginUI'>
            <LoginFormComponent status={loginStatus} setStatus={setLoginStatus} apiCallOnSubmit={apiCallOnSubmit} />
        </div>
    )
}

export default LoginPage