import React from 'react'
import '../Components.css'

function Photo({src}) {
  return (
    <div className='Photo'>
        <div className='Image-Container'>
            <img src={src} />    
        </div>
    </div>
  )
}

export default Photo