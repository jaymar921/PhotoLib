import React, { useEffect, useState } from 'react'
import ProfileComponent from '../components/ProfileComponent'
import '../Components.css'
import AlbumComponent from '../components/AlbumComponent'
import PhotosContainerComponent from '../components/PhotosContainerComponent'
import { retrieveUserAlbumInformation, retrieveUserInformation, useQueryParams } from '../Utils/DataHelper'
import { User } from '../objects/User'

function ProfileDashboard() {
  const params = useQueryParams();
  const [userData, setUserData] = useState(new User());
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState('');

  useEffect(()=>{
    // get the user data [API call]
    async function GetData(){
      if('user' in params){
        const data = await retrieveUserInformation(params.user)
        setUserData(data);
        setAlbums(await retrieveUserAlbumInformation(params.user));
      }else{
        const cachedUser = localStorage.getItem('token');
        if(cachedUser){
          const userParsed = JSON.parse(cachedUser).User;
          setUserData(userParsed);
          setAlbums(await retrieveUserAlbumInformation(userParsed.username));
        }
      }
    }
    GetData();
    
  },[]);

  function newAlbumCallback(e){
    
  }

  return (
    <>
        <div className='Profile-Dashboard'>
            <div className='flex-block'>
                <ProfileComponent UserInfo={userData} />
                <div className='dashboard-flexblock'>
                    <AlbumComponent albums={albums} callback={setActiveAlbum} addAlbumCallback={newAlbumCallback} />
                    <PhotosContainerComponent />
                </div>
            </div>
        </div>
    </>
  )
}

export default ProfileDashboard