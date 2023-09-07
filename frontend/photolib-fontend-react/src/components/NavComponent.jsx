import React, { useEffect, useRef, useState } from 'react'
import '../Components.css'
import Button, { Radio } from './Button'
import { Capitalize, GetCountries, GetOfflineUserData } from '../Utils/Utility';
import {GetUserInfoAsync} from '../Utils/DataHelper'
import {config} from '../config'

function NavComponent() {
    const [showUpdateModal, setShowUpdateModal] = useState('hidden');
    const showModal = (e) => {
        document.getElementById('nav-modal').classList.remove('hidden')
        document.getElementById('profile-dashboard').classList.add('blur');
    }
    return (
        <>
            <NavModal callUpdateModal={setShowUpdateModal}/>
            <UpdateProfileModal show={showUpdateModal} setShow={setShowUpdateModal}/>
            <div className='nav'>
                <Button onClick={showModal} styles={'width100p darker'}>
                    <i className="fa-solid fa-bars"></i>
                </Button>
            </div>
        </>
    )
}


function NavModal({callUpdateModal}){
    const hideThisModal = (e) => {
        if(e.target.id === 'nav-modal'){
            e.target.classList.add('hidden')
            callUpdateModal('hidden')
            document.getElementById('profile-dashboard').classList.remove('blur');
        }
    }

    const logoutFunction = () => {
        window.localStorage.removeItem('token');
        // return to url
        window.location.href = "/login";
    }

    const updateProfile = () => {
        callUpdateModal('');
    }
    return (
        <>
            <div id='nav-modal' className='nav-modal hidden' onClick={hideThisModal}>
                <div className='nav-center'>
                    <Button onClick={updateProfile}>Profile</Button>
                    <Button onClick={logoutFunction}>Logout</Button>
                </div>
            </div>
        </>
    )
}

function UpdateProfileModal({show, setShow}){
    const [countriesList, setCountriesList] = useState([]);
    const [IsPublic, SetIsPublic] = useState(false);
    const [Firstname, setFirstname] = useState('');
    const [Lastname, setLastname] = useState('');
    const [Bio, setBio] = useState('');
    const [Pronouns, setPronouns] = useState('He/Him');
    const [Country, setCountry] = useState('Afghanistan');
    const [Socials, SetSocials] = useState([]);
    const AnimateSocialsRef = useRef();

    
    function hideThisModal(e){
        if(e.target.id === 'update-profile-modal')
            setShow('hidden')
    }
    useEffect(() => {
        async function getCountry(){
            const ctry = await GetCountries();
            
            setCountriesList(ctry.sort())
        };
        getCountry();

        // set the info
        const userData = GetOfflineUserData();
        if(!userData)
            return;
        SetIsPublic(userData.isPublic);
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setBio(userData.bio);
        setCountry(userData.country!==""?userData.country:'-');
        setPronouns(userData.pronouns!==""?userData.pronouns:'-');
        const socialsRaw = userData.socials;
        const socialsUpdate = [];
        let i = 1;
        socialsRaw.forEach(raw => {
            socialsUpdate.push({
                id:i++,
                link: raw.link,
                platform: raw.platform
            })
        })
        SetSocials(socialsUpdate)
    }, [])

    async function SaveProfile(){
        const userDataPayload = {
            firstname: Capitalize(Firstname),
            lastname: Capitalize(Lastname),
            bio: Bio,
            pronouns: Pronouns,
            country: Country,
            views: 0,
            isPublic: IsPublic,
            socials: Socials
        }
        const userData = GetOfflineUserData();
        
        await fetch(config.SERVER_URL_AUTH_MICROSERVICE+"/user", {
            method: 'PUT',
            headers: {
                AuthToken: userData.AuthToken,
                username: userData.username,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDataPayload)
        })
        await GetUserInfoAsync(userData.username, userData.AuthToken)
        //window.location.href = "/"
    }

    function AnimateAddSocials (){
        let s = AnimateSocialsRef.current;
        for(let x of s.childNodes){
            if(x.id.includes('profile-social')){
                const arr = [...x.classList]
                if(!arr.includes('showOpacity'))
                    x.classList.add('showOpacity');
            }
        }

    }
    function AddSocials(){
        if(Socials.length >= 3)
            return;
        const id = Socials.length + 1;
        const newSocialData = {
            id,
            link: "",
            platform: "facebook"
        }
        SetSocials([...Socials, newSocialData])
        setTimeout(()=> {
            AnimateAddSocials()
        }, 1);
        
    }
    return (
        <>
            <div id='update-profile-modal' className={`update-modal ${show}`} onClick={hideThisModal}>
                <div className='profile-form'>
                    <form>
                        <div className='input-design'>
                            <label>Firstname</label>
                            <input id='fname' type='text' value={Firstname} onChange={(e)=>{e.preventDefault();setFirstname(e.target.value)}}/>
                        </div>
                        <div className='input-design'>
                            <label>Lastname</label>
                            <input id='lname' type='text' value={Lastname} onChange={(e)=>{e.preventDefault();setLastname(e.target.value)}}/>
                        </div>
                        <div className='input-design'>
                            <label>Bio</label>
                            <textarea id='bio' value={Bio} onChange={(e)=>{
                                e.preventDefault();
                                if(e.target.value.length >= 101)
                                    return;
                                setBio(e.target.value)
                                document.getElementById('bio-counter').innerHTML = `${e.target.value.length}/100`;
                            }}></textarea>
                            <p id='bio-counter' className='counter'>0/100</p>
                        </div>
                        <div className='input-design'>
                            <label>Pronouns</label>
                            <select id='pronouns-set' value={Pronouns} onChange={(e)=>{e.preventDefault();setPronouns(e.target.value)}}>
                                <option value={"He/Him"}>He/Him</option>
                                <option value={"She/Her"}>She/Her</option>
                                <option value={"They/Them"}>They/Them</option>
                                <option value={"-"} disabled={true}>Select pronouns</option>
                            </select>
                        </div>
                        <div className='input-design'>
                            <label>Country</label>
                            <select id='country-set' value={Country} onChange={(e)=>{e.preventDefault();setCountry(e.target.value)}}>
                                <option value={"-"} disabled={true}>Select a country</option>
                                {
                                    countriesList.map(country => {
                                        const key = Math.ceil(20000000000 * Math.random());
                                        return <option key={key} value={country}>{country}</option>
                                    })
                                }
                            </select>
                        </div>
                        <br />
                        <div ref={AnimateSocialsRef} id='socials-holder' className='socials-holder'>
                            <label>Socials</label>
                            {
                                Socials.map(social => <SocialData key={social.id} data={social} socialSetter={SetSocials} socials={Socials}/>)
                            }
                        </div>
                        <Button onClick={AddSocials}>{
                            Socials.length<=2?"Add Socials":"Maximum"
                        }</Button>
                        <div className='hidden'>
                            <label>Show profile in public</label>
                            <Radio getValue={SetIsPublic} setValue={IsPublic}></Radio>
                            <br />
                        </div>
                        <Button onClick={SaveProfile}>Save</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

function SocialData({data, socialSetter, socials}){
    const [Link, setLink] = useState(data.link);
    const [Platform, setPlatform] = useState(data.platform);

    function deleteSocialData(e){
        e.preventDefault()
        const allOtherSocials = socials.filter(s => s.id !== data.id);
        const element = document.getElementById(`profile-social-${data.id}`);
        if(element.classList.contains('showOpacity')){
            element.classList.remove('showOpacity');
            element.classList.add('hideOpacity');
        }
        setTimeout(()=> {
            socialSetter([...allOtherSocials]);
        }, 800);
        
    }

    function updateLink(e){
        e.preventDefault(); 
        setLink(e.target.value);

        for(const social of socials){
            if(social.id === data.id){
                social.link = e.target.value;
            }
        }
        socialSetter(socials)
    }

    function updatePlatform(e){
        e.preventDefault();
        setPlatform(e.target.value)
        for(const social of socials){
            if(social.id === data.id){
                social.platform = e.target.value;
            }
        }
        socialSetter(socials)
    }
    return(
        <div id={`profile-social-${data.id}`} className={`profile-socials ${data.id?"showOpacity":""}`}>
            <div className='smallFont'>
                <label>Link</label>
                <div className='input-design'>
                    <input className='smallFont' type='text' value={Link} onChange={updateLink}/>
                </div>
            </div>
            <div className='smallFont'>
                <label>Platform</label>
                <div className='input-design'>
                    <select className='smallFont' value={Platform} onChange={updatePlatform}>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="website">Website</option>
                    </select>
                </div>
            </div>
            <Button onClick={deleteSocialData} styles={'smallerFont'}><i className="fa-solid fa-trash"></i></Button>
        </div>
    )
}

export default NavComponent