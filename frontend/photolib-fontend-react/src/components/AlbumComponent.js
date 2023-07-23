import React from 'react'
import ViewsComponent from './ViewsComponent'

function AlbumComponent() {
  return (
    <div className='Album-Container'>
        <h1 className='Title'>Albums</h1>
        <div className='Albums-List'>
            <div className='Album'>
                <div className='darkbg selected'></div>
                <div className='Image-Container'>
                    <img src='./assets/IMG_0013.JPG' />
                </div>
                <div className='info'>
                    <h2>My Album 1</h2>
                    <p>June 2023</p>
                    <ViewsComponent />
                </div>
                
            </div>
            <div className='Album'>
                <div className='darkbg'></div>
                <div className='Image-Container'>
                    <img src='./assets/IMG_0989.JPG' />
                </div>
                <div className='info'>
                    <h2>My Album 2</h2>
                    <p>June 2023</p>
                    <ViewsComponent />
                </div>
            </div>
            <div className='Album'>
                <div className='darkbg'></div>
                <div className='Image-Container'>
                    <img src='./assets/IMG_2967.JPG' />
                </div>
                <div className='info'>
                    <h2>My Album 3</h2>
                    <p>June 2023</p>
                    <ViewsComponent />
                </div>
            </div>
        </div>
    </div>
  )
}

export default AlbumComponent