import React, { useState } from 'react'
import '../Components.css';

function LoginFormComponent({apiCallOnSubmit, status}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitForm = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        await apiCallOnSubmit({username, password});
        setPassword('')
        setIsLoading(false);
    }
    return (
        
        <form className='loginForm' onSubmit={onSubmitForm}>
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

            
            <button className='btn-submit btn-center' type='submit' disabled={isLoading}>{isLoading?"Loading...":"Login"}</button>
            
            

            
            
            <a href='/register'>create an <b>account</b></a>
        </form>
    )
}

export default LoginFormComponent