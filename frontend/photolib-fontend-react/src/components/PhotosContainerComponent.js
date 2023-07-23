import React from 'react'
import Photo from './Photo'

function PhotosContainerComponent() {
  return (
    <div className='Photos-Container'>
        <div className='Title'>
            <div className='info'>
                <h3>My Album 1 - Photos</h3>
                <p>This album covers all of my June's moments</p>
                <div className='date'>
                    <p>June 2023</p>
                </div>
            </div>
        </div>
        <div className='Photos-List'>
        <Photo src={'./assets/IMG_0013.JPG'}/>
        <Photo src={'./assets/IMG_0002.JPG'}/>
        <Photo src={'./assets/IMG_0003.JPG'}/>
        <Photo src={'./assets/IMG_0004.JPG'}/>
        <Photo src={'./assets/IMG_0107.JPG'}/>
        <Photo src={'./assets/IMG_0934.JPG'}/>
        <Photo src={'./assets/IMG_0993.JPG'}/>
        <Photo src={'./assets/IMG_1128.JPG'}/>
        </div>

    </div>
  )
}

export default PhotosContainerComponent