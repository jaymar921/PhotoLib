import React, { useEffect, useState } from 'react'
import ProfileComponent from '../components/ProfileComponent'
import '../Components.css'
import AlbumComponent, {NewAlbumModal} from '../components/AlbumComponent'
import PhotosContainerComponent from '../components/PhotosContainerComponent'
import { retrieveUserAlbumInformation, retrieveUserInformation, useQueryParams, AuthTokenExpired } from '../Utils/DataHelper'
import { User } from '../objects/User'

function ProfileDashboard() {
  const params = useQueryParams();
  const [userData, setUserData] = useState(new User());
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState('');
  const [showNewAlbumModal, setShowNewAlbumModal] = useState('hidden');
  const [token, setToken] = useState('');
  

  useEffect(()=>{
    // get the user data [API call]
    async function GetData(){
      if('user' in params){
        const data = await retrieveUserInformation(params.user)
        setUserData(data);
        setAlbums(await retrieveUserAlbumInformation(params.user));
      }else{
        const cachedData = localStorage.getItem('token');
        if(cachedData){
          const authenticationToken = JSON.parse(cachedData).AuthToken;
          if(!authenticationToken){
            window.location.href = '/login'
          }

          AuthTokenExpired(authenticationToken).then(expired => {
            if(expired){
              window.location.href = '/login';
            }
          });

          setToken(authenticationToken);

          const userParsed = JSON.parse(cachedData).User;
          
          setUserData(userParsed);
          setAlbums(JSON.parse(cachedData).Albums);
        }
      }
    }
    GetData();

    
  }, []);

  function newAlbumCallback(e){
    setShowNewAlbumModal('');
  }

  return (
    <>
        <div className='Profile-Dashboard'>
            <div className='flex-block'>
                <ProfileComponent UserInfo={userData} />
                <div className='dashboard-flexblock'>
                    <AlbumComponent albums={albums} callback={setActiveAlbum} addAlbumCallback={newAlbumCallback} />
                    <NewAlbumModal show={showNewAlbumModal} setShow={setShowNewAlbumModal} userData={userData} token={token}/>
                    <PhotosContainerComponent currentAlbum={activeAlbum} />
                </div>
            </div>
        </div>
    </>
  )
}

export default ProfileDashboard