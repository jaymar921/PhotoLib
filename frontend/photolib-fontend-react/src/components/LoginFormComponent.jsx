import React, { useState } from 'react'
import '../Components.css';

function LoginFormComponent({apiCallOnSubmit, status, setStatus}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inputError, setInputError] = useState([false, false]);

    const onSubmitForm = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        // -- field validation
        const fieldOk = validateFields();
        if(fieldOk){
            await apiCallOnSubmit({username, password});
            setPassword('')
        }else{

        }
        setIsLoading(false);
    }

    const validateFields = () => {
        let fieldOk = true;
        const errorFields = inputError;
        if(username === ''){
            fieldOk = false;
            errorFields[0] = true;
        }else{errorFields[0] = false;}
        if(password === ''){
            fieldOk = false;
            errorFields[1] = true;
        }else{errorFields[1] = false;}

        if(!fieldOk){
            setStatus('Required fields should not be empty')
        }
        setInputError(inputError)
        return fieldOk;
    }

    const cleanUp = () => {
        setInputError([false, false])
        setStatus('')
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
                    className={`${inputError[0]?'input-error':''}`}
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value);cleanUp()}}
                    placeholder='username'
                />
            </div>
            <div className='fields'>
                <label>Password</label>
                <input 
                    type='password'
                    className={`${inputError[1]?'input-error':''}`}
                    value={password}
                    onChange={(e) => {setPassword(e.target.value);cleanUp()}}
                    placeholder='password'
                />
            </div>
            <br />
            <span>{status}</span>

            
            <button className='btn-submit btn-center' type='submit' disabled={isLoading}>{isLoading?"Loading...":"Login"}</button>
            
            

            
            
            <a href='/register'>create an <b>account</b></a>
        </form>
    )
}

export default LoginFormComponent