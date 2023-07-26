import React, { useState } from 'react'
import '../Components.css';

function LoginFormComponent({apiCallOnSubmit, status}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        
        <form className='loginForm'>
            <div className='Title'>
                <h2>Welcome to PictoLib</h2>
                <p>Showcase your hobby</p>
            </div>
            <div className='fields'>
                <label>Username</label>
                <input 
                    type='text' 
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />
            </div>
            <div className='fields'>
                <label>Password</label>
                <input 
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
            <span>{status}</span>

            
            <button className='btn-submit btn-center' type='button' onClick={(e) => {
                apiCallOnSubmit({username, password});
            }}>Login</button>
            
            

            
            
            <a href='#'>create an <b>account</b></a>
        </form>
    )
}

export default LoginFormComponent