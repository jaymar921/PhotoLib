import React, { useState } from 'react'
import '../Components.css';
import { GoogleLogin } from '@react-oauth/google';
import config from '../config.json';

function RegistrationFormComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    


    function handleCredentialResponse(response) {
        // if there is a response
        if(response.credential){
            // get the jwt
            let jwt = response.credential;
            // parse it to JSON
            let user = JSON.parse(atob(jwt.split('.')[1]))
            
            setFirstname(user.given_name);
            setLastname(user.family_name);
            // email
            setEmail(user.email);
            let usern = firstname?.replace(' ', '').concat(lastname?.replace(' ', '')).trim().toLowerCase();
            setUsername(usern);
            setPassword(`${usern}${email}`)
            // picture
            let picture = user.picture;
            handleRegistration()
        }
    }

    async function handleRegistration(){
        await fetch(config.SERVER_URL_AUTH_MICROSERVICE+"/user",{
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                userID: "00000000-0000-0000-0000-000000000000",
                firstname,
                lastname,
                bio: "",
                pronouns: "",
                country: "",
                username,
                password,
                email,
                socials: [],
                views: 0,
                isPublic: true,
                dateCreated: Date.now,
                dateLastModified: Date.now,
                remark: "Create Account"
              })
        })
        .then(r => r.json().then(d => ({
            status:r.status,
            body: d
        })))
        .then(response => {
            setStatus(response.body.message);
            if(response.status === 409){
                return;
            }
            
            setTimeout(()=> {
                window.location.href = '/login';
            }, 2000);
        })
    }

    function handleError(e){

    }

    return (
        
        <form className='loginForm'>
            <div className='Title'>
                <h2>Welcome to PictoLib</h2>
                <p>Showcase your hobby</p>
            </div>
            <div className='fields'>
                <label>Firstname</label>
                <input 
                    type='text'
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                />
            </div>
            <div className='fields'>
                <label>Lastname</label>
                <input 
                    type='text'
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
            </div>
            <div className='fields'>
                <label>Email</label>
                <input 
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
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
                handleRegistration();
            }}>Register</button>
            
            {/*
                <br />
                <div className='center'>
                    <GoogleLogin onSuccess={handleCredentialResponse} onError={handleError} />
                </div>
            */}
            <br />
            
            <a href='/login'>login to your <b>account</b></a>
        </form>
    )
}

export default RegistrationFormComponent