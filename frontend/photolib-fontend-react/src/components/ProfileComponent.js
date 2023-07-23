import React from 'react'
import '../Components.css';
import ViewsComponent from './ViewsComponent';
import Social from './Social';

function ProfileComponent() {
  return (
    <>
        <div className='Profile-Container'>
            <br />
            <div className='Profile-Image'>
                <img src='./assets/myself.jpg'/>
            </div>
            <div className='Profile-Info'>
                <h1 className='FullName'>Jayharron Mar Abejar</h1>
                <h4 className='Username'>@JayMar921</h4>
                <div className='Flex'>
                    <ViewsComponent />
                    <p className='Pronouns'>(He/Him)</p>
                    <p className='Country'>🇵🇭</p>
                </div>
                <div className='Bio'>
                    <p className='Bio-Ind'>Bio</p>
                    <p className='Bio-Details'>def __init__(self):
                        self.skills = 'no record found'
                        
                    message - "You don't need to know me"
                    </p>
                </div>
                <hr className='HR-Line' />
                <div className='Socials'>
                    <h3>Socials</h3>
                    <div className='Socials-Container'>
                        <Social src={'./assets/fb.png'} platform={'Facebook'}/>
                        <Social src={'./assets/ig.png'} platform={'Instagram'}/>
                    </div>
                </div>
            </div>
            <div className='Profile-CopyLink'>
                Copy profile link <i className="fa-solid fa-share"></i>
            </div>
        </div>
    </>
  )
}

export default ProfileComponent