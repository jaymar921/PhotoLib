import React from 'react'
import '../Components.css'

function Social({src, href, platform}) {
  return (
    <div className='Social'>
        <div className='SocialIcon'>
            <img src={src}/>
        </div>
        <div className='Link'>
            <a href={href} target='_blank'>{platform}</a>
        </div>
    </div>
  )
}

export default Social