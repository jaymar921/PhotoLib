import React, { useEffect, useState } from 'react'
import ProfileComponent from '../components/ProfileComponent'
import '../Components.css'
import AlbumComponent from '../components/AlbumComponent'
import PhotosContainerComponent from '../components/PhotosContainerComponent'
import { retrieveUserInformation, useQueryParams } from '../Utils/DataHelper'
import { User } from '../objects/User'

function ProfileDashboard() {
  const params = useQueryParams();
  const [userData, setUserData] = useState(new User());
  
  useEffect(()=>{
    // get the user data [API call]
    async function GetData(){
      if('user' in params){
        const data = await retrieveUserInformation(params.user)
        setUserData(data);
      }else{
        const cachedUser = localStorage.getItem('token');
        if(cachedUser){
          setUserData(JSON.parse(cachedUser).User);
          
        }
      }
    }

    GetData();
  },[]);
  return (
    <>
        <div className='Profile-Dashboard'>
            <div className='flex-block'>
                <ProfileComponent UserInfo={userData} />
                <div className='dashboard-flexblock'>
                    <AlbumComponent />
                    <PhotosContainerComponent />
                </div>
            </div>
        </div>
    </>
  )
}

export default ProfileDashboard