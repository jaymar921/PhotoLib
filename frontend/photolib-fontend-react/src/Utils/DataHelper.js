import { useLocation } from 'react-router-dom';
import configData from '../config.json';
import { User } from '../objects/User';
import config from '../config.json';

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
    .then( async (d) => {
        const user = d.user;

        const albums = await retrieveUserAlbumInformation(username);
        
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
            AuthToken: token,
            Albums:albums
        }))
        window.location = '/'
    });
}

export async function AuthTokenExpired(token) {
    let verified = false;

    await fetch(configData.SERVER_URL_AUTH_MICROSERVICE+"/auth",{
        headers:{
            AuthToken: token
        }
    })
    .then(r => r.json())
    .then(d => {
        verified = d.expired;
    })

    return verified;
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

export async function retrieveUserAlbumInformation(username){
    let albums = [];
    await fetch(config.SERVER_URL_ALBUM_MICROSERVICE+"/Album",{
        headers: {
            username 
        },
        method: 'GET'
    })
    .then(r => r.json())
    .then(d => {
        if(d && d.albums !== undefined)
            d.albums.forEach(item => albums.push(item));
    })
    .catch(e => console.error(e.toString()))
    return albums;
}

export function GetMonthYear(date){
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date(date);
    return [monthNames[d.getMonth()], d.getFullYear()];
}

export function GetSocialLink(social){
    if(social.platform === 'facebook')
        return ['./assets/fb.png', 'Facebook', social.link];
    else if(social.platform === 'instagram')
        return ['./assets/ig.png', 'Instagram', social.link];
    return ['./assets/website.png', 'Website', social.link];
}

export async function CreateNewAlbum(userData, token, title, description, isPublic, image){
    console.log(userData,title, description, isPublic, image, token)

    const newAlbumResponse = await fetch(config.SERVER_URL_ALBUM_MICROSERVICE+"/Album",{
        method: "POST",
        headers:{
            Username: userData.username,
            AuthToken: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: "00000000-0000-0000-0000-000000000000",
            dateCreated: new Date().toISOString(),
            dateLastModified: new Date().toISOString(),
            title: title,
            description: new String(description),
            views: 0,
            isPublic: new Boolean(isPublic)
        })
    })

    const newAlbumResponseJson = await newAlbumResponse.json();

    if(newAlbumResponseJson.statusCode === 401){
        console.log("Unauthorized, failed to create new album");
        return;
    }

    // get all albums
    const getAlbumsResponse = await fetch(config.SERVER_URL_ALBUM_MICROSERVICE+"/Album",{
        headers:{
            Username: userData.username
        }
    })

    const getAlbumsResponseJson = await getAlbumsResponse.json();

    console.log(getAlbumsResponseJson);

    let albumID = null;
    try{
        if('albums' in getAlbumsResponseJson){
            getAlbumsResponseJson.albums.forEach(album => {
                if(album.title == title){
                    albumID = album.guid;
                }
            })
        }
    }catch(e){}

    if(albumID === null){
        console.log("No album ID found")
        return;
    }

    // upload a photo, get the ID first
    const photoApiResponse = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo",{
        method: 'POST',
        headers:{
            AuthToken: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "photoId": "00000000-0000-0000-0000-000000000000",
            "albumID": albumID,
            "caption": "Album Photo",
            "dateCreated": new Date().toISOString(),
            "views": 0
        })
    })

    const photoApiResponseJson = await photoApiResponse.json();

    let imageID = null;
    if(!('imageID' in photoApiResponseJson)){
        console.log("Failed to retrieve image ID, could not proceed to upload album photo");
        return;
    }

    imageID = photoApiResponseJson.imageID;

    const formData = new FormData();
    

    // upload the Image
    const imageApiResponse = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE + "/Photo/Image",{
        method: "POST",
        headers:{
            AuthToken: token,
            Path: "Album",
            ImageID: new String(imageID)
        },
        body: formData,
        redirect: 'follow'
    });

    const imageApiResponseJson = await imageApiResponse.json();

   

    console.log(imageApiResponseJson)
    setTimeout(()=> {
        window.location.href = '/';
    }, 2000)
}

export async function getAlbumImage(albumID){
    let imageID = null;

    await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo",{
        headers:{
            AlbumID: albumID
        }
    })
    .then(r => r.json())
    .then(d => {
        for(var image of d.photos){
            imageID = image.photoId;
            console.log(image)
            break;
        }
    })
    
    const resp = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo/Image",{
        headers: {
            Path: "Album",
            PhotoID: new String(imageID)
        }
    });

    const reader = await resp.body.getReader();
    let chunks = [];

    
    let imageFile;
    await reader.read().then(function processText({ done, value }) {
        

        if (done) {
            console.log('Stream finished. Content received:')

            console.log(chunks);


            const blob = new Blob([chunks], { type: "image/png" });
            console.log(blob);

            imageFile = URL.createObjectURL(blob);
            return
        }

        console.log(`Received ${chunks.length} chars so far!`)
        // console.log(value);
        const tempArray = new Uint8Array(chunks.length + value.length);
        tempArray.set(chunks);
        tempArray.set(value, chunks.length);
        chunks = tempArray

        return reader.read().then(processText)
    });
    
    return imageFile;
}

export default LoginUserAsync;