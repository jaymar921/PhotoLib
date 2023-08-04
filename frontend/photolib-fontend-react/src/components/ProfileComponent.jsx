import React, { useEffect, useState } from 'react'
import '../Components.css';
import ViewsComponent from './ViewsComponent';
import Social from './Social';
import { User } from '../objects/User';
import { GetSocialLink } from '../Utils/DataHelper';

function ProfileComponent({UserInfo = new User()}) {
    const [showBio, setShowBio] = useState('hidden');
    const [showSocials, setShowSocials] = useState('hidden');

    const copyLinkUrl = () => {
        var dummy = document.createElement('input'),
        text = window.location.href + `?user=${UserInfo.username}`;

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
    }

    useEffect(()=>{
        if(UserInfo.bio !== '')
            setShowBio('');
        if(UserInfo.socials.length > 0)
            setShowSocials('');
    }, []);

  return (
    <>
        <div className='Profile-Container'>
            <br />
            <div className='Profile-Image'>
                <img src='./assets/myself.jpg'/>
            </div>
            <div className='Profile-Info'>
                <h1 className='FullName'>{UserInfo.fullname}</h1>
                <h4 className='Username'>@{UserInfo.username}</h4>
                <div className='Flex'>
                    <ViewsComponent views={UserInfo.views} />
                    <p className='Pronouns'>({UserInfo.pronouns})</p>
                    <p className='Country'>{UserInfo.country}</p>
                </div>
                <div className={`Bio ${showBio}`}>
                    <p className='Bio-Ind'>Bio</p>
                    <p className='Bio-Details'>{UserInfo.bio}</p>
                </div>
                <hr className='HR-Line' />
                <div className={`Socials ${showSocials}`}>
                    <h3>Socials</h3>
                    <div className='Socials-Container'>
                        {
                            UserInfo.socials.map(social => {
                                const socialData = GetSocialLink(social);
                                
                                return <Social key={Math.floor(Math.random()*100000)} src={socialData[0]} platform={socialData[1]} href={socialData[2]}/>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className='Profile-CopyLink' onClick={(e) => {
                copyLinkUrl();     
            }}>
                Copy profile link <i className="fa-solid fa-share"></i>
            </div>
        </div>
    </>
  )
}

export default ProfileComponent