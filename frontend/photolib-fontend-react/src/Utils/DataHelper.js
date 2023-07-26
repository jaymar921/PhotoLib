import React from 'react';
import { useLocation } from 'react-router-dom';
import configData from '../config.json';
import { User } from '../objects/User';

const LoginUserAsync = async (user, pass) => {
    let status = '';
    await fetch(configData.SERVER_URL_AUTH_MICROSERVICE + "/Auth", {
        headers:{
            "Username" : user,
            "Password" : pass
        },
        method: 'POST'
    })
    .then( r => r.json())
    .then( d => {
        const authToken = d.authToken;
        const statusCode = d.statusCode;
        
        if(statusCode === 401){
            // unauthorized
            status = 'Invalid login credentials';
            localStorage.clear();
        }

        if(statusCode === 200){
            GetUserInfoAsync(user, authToken);
        }
    })
    .catch(e => {
        console.log('error')
    })
    return [status];
}


const GetUserInfoAsync = async (username, token) => {
    await fetch(configData.SERVER_URL_AUTH_MICROSERVICE + "/User", {
        headers: {
            'Username': username
        },
        method: "GET"
    })
    .then( r => r.json())
    .then( d => {
        const user = d.user;
        
        localStorage.setItem("token", JSON.stringify({
            User: new User(
                `${user.firstname} ${user.lastname}`,
                user.bio,
                username,
                user.pronouns,
                user.country,
                user.views,
                user.socials
            ),
            AuthToken: token
        }))
        window.location = '/'
    });
}


export function useQueryParams(){
    const search = useLocation().search;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params
}

export async function retrieveUserInformation(username){
    const user = new User();
    await fetch(configData.SERVER_URL_AUTH_MICROSERVICE + "/User", {
        headers: {
            'Username': username
        },
        method: "GET"
    })
    .then( r => r.json())
    .then( d => {
        if(d.statusCode !== 200)
            return;

        const userData = d.user;
        
        user.fullname = `${userData.firstname} ${userData.lastname}`;
        user.country = userData.country;
        user.socials = userData.socials;
        user.views = userData.views;
        user.pronouns = userData.pronouns;
        user.username = username;
        user.bio = userData.bio;
    });

    return user;
}

export function GetSocialLink(social){
    if(social.platform === 'facebook')
        return ['./assets/fb.png', 'Facebook', social.link];
    else if(social.platform === 'instagram')
        return ['./assets/ig.png', 'Instagram', social.link];
    return ['./assets/website.png', 'Website', social.link];
}

export default LoginUserAsync;