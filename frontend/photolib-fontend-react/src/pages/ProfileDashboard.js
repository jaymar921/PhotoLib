import React from 'react'
import ProfileComponent from '../components/ProfileComponent'
import '../Components.css'
import AlbumComponent from '../components/AlbumComponent'
import PhotosContainerComponent from '../components/PhotosContainerComponent'

function ProfileDashboard() {
  return (
    <>
        <div className='Profile-Dashboard'>
            <div className='flex-block'>
                <ProfileComponent />
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