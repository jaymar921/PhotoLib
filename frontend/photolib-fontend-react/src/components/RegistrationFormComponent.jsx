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
    const [inputError, setInputError] = useState([false, false, false, false, false]);
    const [passwordFocus, setFocusPassword] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState([false, false, false, false])
    const [emailFocus, setEmailFocus] = useState(false);
    const [emailMessage, setEmailMessage] = useState('❓ Empty field')


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
        const ok = validateFields();

        if(ok){
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
    }

    function handleError(e){

    }

    const validateFields = () => {
        let fieldsOk = true;
        const errorFields = inputError;
        // check firstname
        if(firstname === ''){
            errorFields[0] = true;
        }
        // check lastname
        if(lastname === '' || lastname.length < 2){
            errorFields[1] = true;
        }
        // check email
        if(email === '' || !validateEmail()){
            errorFields[2] = true;
        }
        // check username
        if(username === ''){
            errorFields[3] = true;
        }
        // check password
        if(password === '' || !validatePassword()){
            errorFields[4] = true;
        }

        if(errorFields.some(v=> v === true))
            fieldsOk = false;



        setInputError(errorFields);

        if(!fieldsOk){
            setStatus("Fields must not be empty")
        }
        return fieldsOk;
    }

    const cleanUp = () => {
        setInputError([false, false, false, false, false])
        setStatus('')
    }

    const capturePasswordFocus = (e) =>{
        const focusId = e.target.id;

        if(focusId === 'password-field')
        {
            setFocusPassword(true);
        }else{setFocusPassword(false)}
        if(focusId === 'email-field')
        {
            setEmailFocus(true);
        }else{setEmailFocus(false)}
    }

    const validatePassword = (e) => {
        let value = password;
        if(e){
            if(e.target)
                value = e.target.value
        }

        let containUppercase = false;
        let containLowercase = false;
        let containNumeric   = false;
        for(const char of value){
            if(!isNaN(char * 1)){
                containNumeric = true;
            }else{
                if(char === char.toUpperCase())
                    containUppercase = true;
                if(char === char.toLowerCase())
                    containLowercase = true;
            }
        }
        setPasswordValidation([containUppercase, containLowercase, containNumeric, value.length >= 8])
        return containUppercase && containLowercase && containNumeric && value.length >= 8;
    }

    const validateEmail = (e) => {
        let value = email;
        if(e){
            if(e.target)
                value = e.target.value
        }
        const regex_part_1 = /^[A-Za-z0-9\.]+/;
        const regex_part_2 = /^[A-Za-z0-9\.]+@/;
        const regex_part_3 = /^[A-Za-z0-9\.]+@[A-Za-z]+/;
        const regex_part_4 = /^[A-Za-z0-9\.]+@[A-Za-z]+\./;
        const regex_part_5 = /^[A-Za-z0-9\.]+@[A-Za-z]+\.[A-Za-z]{2,}/;
        

        let pass_1 = false;
        let pass_2 = false;
        let pass_3 = false;
        let pass_4 = false;
        let pass_5 = false;
        let message = '❓ Empty field';
        // check 1
        if(regex_part_1.test(value)){
            pass_1 = true;
            message = '😭 Invalid';
        }
        // check 2
        if(regex_part_2.test(value)){
            pass_2 = true;
            message = '🥹 Invalid';
        }
        // check 3
        if(regex_part_3.test(value)){
            pass_3 = true;
            message = '😐 Invalid';
        }
        // check 4
        if(regex_part_4.test(value)){
            pass_4 = true;
            message = '🤔 Invalid';
        }
        // check 5
        if(regex_part_5.test(value)){
            pass_5 = true;
            message = '😊 yeeaaay!';
        }
        setEmailMessage(message)
        console.log(pass_1 && pass_2 && pass_3 && pass_4 && pass_5)
        return pass_1 && pass_2 && pass_3 && pass_4 && pass_5;
    }

    return (
        <>
            <div onClick={capturePasswordFocus}>
                <form className='loginForm'>
                    <div className='Title'>
                        <h2>Welcome to PictoLib</h2>
                        <p>Showcase your hobby</p>
                    </div>
                    <div className='fields'>
                        <label>Firstname</label>
                        <input 
                            type='text'
                            className={`${inputError[0]?'input-error':''}`}
                            value={firstname}
                            onChange={(e) => {setFirstname(e.target.value);cleanUp()}}
                        />
                    </div>
                    <div className='fields'>
                        <label>Lastname</label>
                        <input 
                            type='text'
                            className={`${inputError[1]?'input-error':''}`}
                            value={lastname}
                            onChange={(e) => {setLastname(e.target.value);cleanUp()}}
                        />
                    </div>
                    <div className='fields'>
                        <label>Email</label>
                        <input 
                            id='email-field'
                            type='email'
                            className={`${inputError[2]?'input-error':''}`}
                            value={email}
                            onChange={(e) => {setEmail(e.target.value);cleanUp()}}
                            onInput={validateEmail}
                        />
                    </div>
                    <div className='fields'>
                        <label>Username</label>
                        <input 
                            type='text' 
                            className={`${inputError[3]?'input-error':''}`}
                            value={username}
                            onChange={(e)=>{setUsername(e.target.value);cleanUp()}}
                        />
                    </div>
                    <div className='fields'>
                        <label>Password</label>
                        <input 
                            id='password-field'
                            type='password'
                            className={`${inputError[4]?'input-error':''}`}
                            value={password}
                            onChange={(e) => {setPassword(e.target.value);cleanUp()}}
                            onInput={validatePassword}
                        />
                    </div>
                    <div className={`hovermodal offset250Btm ${emailFocus?'':'hidden'}`}>
                        <p className={`${emailMessage.includes('yeeaaay')?'good':''}`}>{emailMessage}</p>
                    </div>
                    <div className={`hovermodal ${passwordFocus?'':'hidden'}`}>
                        <p className={`${passwordValidation[0]?'good':''}`}>At least 1 Uppercase letter</p>
                        <p className={`${passwordValidation[1]?'good':''}`}>At least 1 lowercase letter</p>
                        <p className={`${passwordValidation[2]?'good':''}`}>At least 1 number</p>
                        <p className={`${passwordValidation[3]?'good':''}`}>At least 8 characters in length</p>
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
           </div> 
        </>
    )
}

export default RegistrationFormComponent