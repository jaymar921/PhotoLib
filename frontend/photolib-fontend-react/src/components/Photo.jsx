import React, { useState } from 'react'
import '../Components.css'
import ViewsComponent from './ViewsComponent';
import { config } from '../config';
import { GetOfflineUserData } from '../Utils/Utility';

function Photo({src, text, onClick, metaData, setActive, setShowDisplay}) {
  return (
    <div className='Photo' onClick={(e)=>{
      if(onClick)
        onClick({
          metaData,
          imageSrc: src,
          event:e
        });
        setActive({metaData,
          imageSrc: src,
          event:e});
        setShowDisplay('');
    }}>
        <div className='Image-Container'>
            <img alt={src} src={src} />    
            {text}
        </div>
    </div>
  )
}


export function DisplayPhoto({data, show, setShow}){
  const [focus, setFocus] = useState(false);
  const image = data;
  if(!image)
      return;
    
  const toggleCaptionEdit = () => {
    if(focus)
      return;
    const parentElement = document.getElementById('image-caption');
    // create an input element
    const inputEl = document.createElement('input');
    inputEl.id = 'update-caption';
    inputEl.className = "input-special-md  w300 bld"
    inputEl.value = parentElement.innerHTML;
    

    parentElement.innerHTML = ''
    parentElement.appendChild(inputEl);
    setFocus(true)
    inputEl.focus();
  }

  const toggleCaptionUpdate = async () => {
    if(!focus)
      return;
    const parentElement = document.getElementById('image-caption');

    const inputEl = document.getElementById('update-caption');

    if(!inputEl)
      return;
    if(inputEl.value === '')
      return;

    // api call async
    {
      const userData = GetOfflineUserData();
      fetch(config.SERVER_URL_PHOTO_MICROSERVICE+"/photo",{
        method: 'PATCH',
        headers:{
          AuthToken: userData.AuthToken,
          ImageID: data.metaData.photoId,
          Caption: inputEl.value
        }
      })
    }

    parentElement.innerHTML = inputEl.value;
    setFocus(false)
  }
  const captureCaptionClick = (e) => {
    if(e){
      if(e.target.id === 'image-caption' && !focus)
        toggleCaptionEdit(e);
      else if(e.target.id !== 'update-caption' && focus){
        toggleCaptionUpdate();
      }
    }
  }

  return (
    <div id='show-image-modal' className={`photo-modal ${show}`} onClick={(e)=> {
      if(e.target.id === 'show-image-modal'){
        setShow('hidden');
        toggleCaptionUpdate()
      }
    }}>
      <div className='photo' onClick={captureCaptionClick}>
        <div className='photo-container'>
          <img alt={image.imageSrc} src={image.imageSrc}/>
        </div>
        <div id='image-caption' className='caption'>{image.metaData.caption}</div>
        
      </div>

    </div>
  )
}

export default Photo