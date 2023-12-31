import { useLocation } from 'react-router-dom';
import { User } from '../objects/User';
import {config} from '../config';
import { GetOfflineUserData } from './Utility';

const LoginUserAsync = async (user, pass) => {
    let status = '';
    await fetch(config.SERVER_URL_AUTH_MICROSERVICE + "/Auth", {
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


export const GetUserInfoAsync = async (username, token) => {
    await fetch(config.SERVER_URL_AUTH_MICROSERVICE + "/User", {
        headers: {
            'Username': username
        },
        method: "GET"
    })
    .then( r => r.json())
    .then( async (d) => {
        const user = d.user;

        const albums = await retrieveUserAlbumInformation(username);
        const USER_DATA = new User(
            `${user.firstname} ${user.lastname}`,
            user.bio,
            username,
            user.pronouns,
            user.country,
            user.views,
            user.socials
        )
        USER_DATA.firstname = user.firstname;
        USER_DATA.lastname = user.lastname;
        USER_DATA.isPublic = user.isPublic;
        USER_DATA.userid = d.userId;

        localStorage.setItem("token", JSON.stringify({
            User: USER_DATA,
            AuthToken: token,
            Albums:albums,
        }))


        window.location = '/'
    });
}

export async function AuthTokenExpired(token) {
    let verified = false;

    await fetch(config.SERVER_URL_AUTH_MICROSERVICE+"/auth",{
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
    await fetch(config.SERVER_URL_AUTH_MICROSERVICE + "/User", {
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

        localStorage.setItem('temporaryID', d.userId)
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
    //console.log(userData,title, description, isPublic, image, token)

    const newAlbumResponse = await fetch(config.SERVER_URL_ALBUM_MICROSERVICE+"/Album",{
        method: "POST",
        headers:{
            Username: userData.username,
            AuthToken: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: GetOfflineUserData().UserID,
            dateCreated: new Date().toISOString(),
            dateLastModified: new Date().toISOString(),
            title: title,
            description,
            views: 0,
            isPublic
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


    let albumID = null;
    try{
        if('albums' in getAlbumsResponseJson){
            getAlbumsResponseJson.albums.forEach(album => {
                if(album.title === title){
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
    formData.append("Image", image)
    

    // upload the Image
    const imageApiResponse = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE + "/Photo/Image",{
        method: "POST",
        headers:{
            AuthToken: token,
            Path: "Album",
            ImageID: imageID
        },
        body: formData,
        redirect: 'follow'
    });

    await imageApiResponse.json();

   

    //console.log(imageApiResponseJson)
    
    setTimeout(()=> {
        window.location.href = '/';
    }, 2000)
    
}

export async function APIUpdateAlbum(albumID, title, description, isPublic){
    const userData = GetOfflineUserData();
    await fetch(config.SERVER_URL_ALBUM_MICROSERVICE+"/Album",{
        method: "PUT",
        headers:{
            AlbumID: albumID,
            AuthToken: userData.AuthToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: userData.UserID,
            dateCreated: new Date().toISOString(),
            dateLastModified: new Date().toISOString(),
            title: title,
            description,
            views: 0,
            isPublic
        })
    })
    window.location.href = "/"
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
            //console.log(image)
            break;
        }
    })
    
    const resp = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo/Image",{
        headers: {
            Path: "Album",
            PhotoID: imageID
        }
    });

    const reader = resp.body.getReader();
    let chunks = [];

    
    let imageFile;
    await reader.read().then(function processText({ done, value }) {
        

        if (done) {
            //console.log('Stream finished. Content received:')

            //console.log(chunks);


            const blob = new Blob([chunks], { type: "image/png" });
            //console.log(blob);

            imageFile = URL.createObjectURL(blob);
            return
        }

        //console.log(`Received ${chunks.length} chars so far!`)
        // console.log(value);
        const tempArray = new Uint8Array(chunks.length + value.length);
        tempArray.set(chunks);
        tempArray.set(value, chunks.length);
        chunks = tempArray

        return reader.read().then(processText)
    });
    
    return imageFile;
}

async function ReadStream(reader){
    let chunks = [];

    
    let imageFile;
    await reader.read().then(function processText({ done, value }) {
        

        if (done) {
            //console.log('Stream finished. Content received:')

            //console.log(chunks);


            const blob = new Blob([chunks], { type: "image/png" });
            //console.log(blob);

            imageFile = URL.createObjectURL(blob);
            return
        }

        //console.log(`Received ${chunks.length} chars so far!`)
        // console.log(value);
        const tempArray = new Uint8Array(chunks.length + value.length);
        tempArray.set(chunks);
        tempArray.set(value, chunks.length);
        chunks = tempArray

        return reader.read().then(processText)
    });
    
    return imageFile;
}

export async function UploadPhotoInAlbum(payload, setWaitMessage){
    const {captions, currentAlbum} = payload;
    const images = [...payload.files]

    const authenticationToken = JSON.parse(localStorage.getItem('token')).AuthToken;

    let index = 0;
    for(const image of images){
        setWaitMessage(`Uploading ${index+1} of ${images.length}`)
        let caption = captions[index++].caption;
        if(caption === '')
            caption = '~';
        // prepare the file for upload, call the upload photo api
        const apiRes = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo", {
            method: "POST",
            headers: {
                AuthToken: authenticationToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "photoId": "00000000-0000-0000-0000-000000000000",
                "albumID": currentAlbum.guid,
                "caption": caption,
                "dateCreated": new Date().toISOString(),
                "views": 0
            })
        })

        const JsonRes = await apiRes.json();
        
        const imageID = JsonRes.imageID;

        const formData = new FormData();
        formData.append('Image', image);

        const imageApiRes = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo/Image",{
            method: "POST",
            headers:{
                AuthToken : authenticationToken,
                ImageID: imageID,
                Path: currentAlbum.guid
            },
            body: formData,
            redirect: 'follow'
        })

        const imageApiJson = await imageApiRes.json();
        console.log(imageApiJson);
    }

    window.location.href = '/'
    
}

export async function DeletePhoto(path, id, auth){
    // check if image exists
    const photoStream = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/photo/image",{
        headers:{
            Path: path,
            PhotoID: id
        }
    })

    if(photoStream.ok){
        // delete
        try{
            await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/photo",{
                method: 'DELETE',
                headers:{
                    AuthToken: auth,
                    Path: path,
                    PhotoID: id
                }
            })
        }catch{}
    }
}


export async function LoadPhoto(path){
    const offlineData = GetOfflineUserData();
    let userID = localStorage.getItem('temporaryID');
    if(offlineData)
        userID = offlineData.UserID;

    const photoStream = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/photo/image",{
        headers:{
            Path: path,
            PhotoID: userID
        }
    })

    if(!photoStream.ok)
        return null;
    try{
        return await ReadStream(photoStream.body.getReader());
    }catch(e){
        return null;
    }
}
export async function UploadPhoto(image, path, caption){
    const offlineData = GetOfflineUserData();

    DeletePhoto("profile", offlineData.UserID, offlineData.AuthToken);
    // prepare the file for upload, call the upload photo api
    const apiRes = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo", {
        method: "POST",
        headers: {
            AuthToken: offlineData.AuthToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "photoId": offlineData.UserID,
            "albumID": "00000000-0000-0000-0000-000000000000",
            "caption": caption,
            "dateCreated": new Date().toISOString(),
            "views": 0
        })
    })

    const JsonRes = await apiRes.json();

    const imageID = JsonRes.imageID;

    const formData = new FormData();
    formData.append('Image', image);

    const imageApiRes = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo/Image",{
        method: "POST",
        headers:{
            AuthToken : offlineData.AuthToken,
            ImageID: imageID,
            Path: path
        },
        body: formData,
        redirect: 'follow'
    })

    const imageApiJson = await imageApiRes.json();
    console.log(imageApiJson);
}

export const GENERATOR_FUNCTION = function*(arr){
    yield* arr;
}

export async function GetPhotoInAlbumGENERIC(albumData){
    return GENERATOR_FUNCTION(await GetPhotoInAlbum(albumData));
}

export async function GetPhotoInAlbum(albumData){
    const {guid:albumID} = albumData
    // retrieve all photos in album
    const apiRes = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo",{
        method: 'GET',
        headers: {
            AlbumID : albumID
        }
    })
    
    const apiResJson = await apiRes.json();

    const retrievedPhotos = apiResJson.photos;
    if(!retrievedPhotos)
        return [];
    return retrievedPhotos;
}

export async function GetIndividualPhoto(photo, currentAlbum){
    const { photoId, caption } = photo;
    if(caption === 'Album Photo')
        return null;
    const albumID = currentAlbum.guid;
        try{
            // get the photo object
            const resp = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo/Image",{
                headers: {
                    Path: albumID,
                    PhotoID: photoId
                }
            });
            //console.log(resp)
            const reader = resp.body.getReader();
            let chunks = []; 
        
            
            let imageFile;
            await reader.read().then(function processText({ done, value }) {
                
        
                if (done) {
                    //console.log('Stream finished. Content received:')
        
                    //console.log(chunks);
        
        
                    const blob = new Blob([chunks], { type: "image/png" });
                    //console.log(blob);
        
                    imageFile = URL.createObjectURL(blob);
                    return
                }
        
                //console.log(`Received ${chunks.length} chars so far!`)
                // console.log(value);
                const tempArray = new Uint8Array(chunks.length + value.length);
                tempArray.set(chunks);
                tempArray.set(value, chunks.length);
                chunks = tempArray
        
                return reader.read().then(processText)
            });

            photo.image = imageFile;
    }catch(e){return null;}
    return photo;
}

export async function LoadPhotosInAlbum_NoPhoto(albumData){
    if(!albumData)
        return [];
    const {guid:albumID} = albumData
    // retrieve all photos in album
    const apiRes = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo",{
        method: 'GET',
        headers: {
            AlbumID : albumID
        }
    })
    
    const apiResJson = await apiRes.json();

    const retrievedPhotos = apiResJson.photos;

    if(!retrievedPhotos)
        return [];

    return retrievedPhotos;
}

export async function LoadPhotosInAlbum(albumData){
    if(!albumData)
        return [];
    const {guid:albumID} = albumData
    // retrieve all photos in album
    const apiRes = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo",{
        method: 'GET',
        headers: {
            AlbumID : albumID
        }
    })
    
    const apiResJson = await apiRes.json();

    const retrievedPhotos = apiResJson.photos;

    if(!retrievedPhotos)
        return [];

    const PhotosList = [];

    for(const photo of retrievedPhotos){
        const { photoId, caption } = photo;

        if(caption === 'Album Photo')
            continue;

        try{
            // get the photo object
            const resp = await fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/Photo/Image",{
                headers: {
                    Path: albumID,
                    PhotoID: photoId
                }
            });
            //console.log(resp)
            const reader = resp.body.getReader();
            let chunks = []; 
        
            
            let imageFile;
            await reader.read().then(function processText({ done, value }) {
                
        
                if (done) {
                    //console.log('Stream finished. Content received:')
        
                    //console.log(chunks);
        
        
                    const blob = new Blob([chunks], { type: "image/png" });
                    //console.log(blob);
        
                    imageFile = URL.createObjectURL(blob);
                    return;
                }
        
                //console.log(`Received ${chunks.length} chars so far!`)
                // console.log(value);
                const tempArray = new Uint8Array(chunks.length + value.length);
                tempArray.set(chunks);
                tempArray.set(value, chunks.length);
                chunks = tempArray
        
                return reader.read().then(processText)
            });

            photo.image = imageFile;
            PhotosList.push(photo);
        }catch(e){}
    }

    return PhotosList;
}

export default LoginUserAsync;