import { User } from "../objects/User";

export const IsLoggedIn = () => {
    return window.localStorage.getItem('token') !== null;
}

export function GetOfflineUserData(){
    const user = new User();

    const offlineData = localStorage.getItem('token');
    if(!offlineData)
        return null;

    const offlineUser = JSON.parse(offlineData).User
    
    user.bio = offlineUser.bio;
    user.country = offlineUser.country;
    user.fullname = offlineUser.fullname;
    user.pronouns = offlineUser.pronouns;
    user.socials = offlineUser.socials;
    user.username = offlineUser.username;
    user.views = offlineUser.views;
    user.lastname = offlineUser.lastname;
    user.firstname = offlineUser.firstname;
    user.isPublic = offlineUser.isPublic;
    user.AuthToken = JSON.parse(offlineData).AuthToken;
    user.UserID = offlineUser.userid;
    return user;
}

export async function GetCountries(){
    if(window.localStorage.getItem('counties')){
        return JSON.parse(window.localStorage.getItem('counties'));
    }
    const resp = await fetch('https://restcountries.com/v3.1/all');

    const data = await resp.json();
    const arr = [];
    try{
        data.forEach(country => {
            arr.push(country.name.common)
        });
        window.localStorage.setItem('counties', JSON.stringify(arr));
    }catch(e){console.log(e)}
    return arr;
}

